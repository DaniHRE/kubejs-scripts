// ============================================================
//  TELEPORTE DIMENSÕES DO CATACLYSM
//  Modpack: NightfallCraft - Casket of Reveries
//  KubeJS 6 | Minecraft 1.20.1 Forge
//  Arquivo: kubejs/server_scripts/cataclysm_tp_menu.js
// ============================================================
//
//  COMANDOS:
//    /cataclysm  — abre o menu clicável no chat
//    /pharaoh /abyssal /frost /inferno /souls
//    /bastion /forge /sanctum  — TP direto (sem OP)
//    /voltar     — retorna ao ponto anterior
//
//  EDITAR PLACEHOLDERS: procure "// ??? CONFIRMAR"
// ============================================================

// ------------------------------------------------------------------
// MAPEAMENTO dimensões
// ------------------------------------------------------------------
var DIMENSOES = {
    'pharaoh': { nome: "Pharaoh's Bane", sub: 'Olho do Deserto', dim: 'cataclysm_dimension:cataclysm_pharaohs_bane', x: 0, y: 120, z: 0, cor: 'gold' },
    'abyssal': { nome: 'Abyssal Depths', sub: 'Olho do Abismo', dim: 'cataclysm_dimension:cataclysm_abyssal_depths', x: 0, y: 120, z: 0, cor: 'aqua' },
    'frost': { nome: 'Eternal Frosthold', sub: 'Olho da Maldição', dim: 'cataclysm_dimension:cataclysm_eternal_frosthold', x: 0, y: 180, z: 0, cor: 'white' },
    'inferno': { nome: "Inferno's Maw", sub: 'Olho Flamejante', dim: 'cataclysm_dimension:cataclysm_infernos_maw', x: 0, y: 70, z: 0, cor: 'red' },
    'souls': { nome: 'Souls Anvil', sub: 'Olho da Forja', dim: 'cataclysm_dimension:cataclysm_souls_anvil', x: 0, y: 80, z: 0, cor: 'lightPurple' },
    'bastion': { nome: 'Bastion Lost', sub: 'Olho Mecânico', dim: 'cataclysm_dimension:cataclysm_bastion_lost', x: 0, y: 120, z: 0, cor: 'gray' }, // ??? CONFIRMAR
    'forge': { nome: 'Forge of Aeons', sub: 'Olho da Tempestade', dim: 'cataclysm_dimension:cataclysm_forge_of_aeons', x: 0, y: 120, z: 0, cor: 'yellow' }, // ??? CONFIRMAR
    'sanctum': { nome: 'Sanctum Fallen', sub: 'Olho do Vazio', dim: 'cataclysm_dimension:cataclysm_sanctum_fallen', x: 0, y: 120, z: 0, cor: 'darkPurple' }, // ??? CONFIRMAR
};

// ------------------------------------------------------------------
// COOLDOWN (segundos). 0 = desativado.
// ------------------------------------------------------------------
var COOLDOWN_SEG = 5; // mesmo delay do countdown
var cooldowns = {};
var posicaoAnterior = {};
var pendingTP = {}; // { uuid: { boss, ticks restantes } }

function emCooldown(uuid) {
    if (!cooldowns[uuid]) return false;
    return (Date.now() - cooldowns[uuid]) / 1000 < COOLDOWN_SEG;
}
function secsRestantes(uuid) {
    if (!cooldowns[uuid]) return 0;
    return Math.ceil(COOLDOWN_SEG - (Date.now() - cooldowns[uuid]) / 1000);
}

// ------------------------------------------------------------------
// MENU CLICÁVEL no chat
// ------------------------------------------------------------------
function mostrarMenu(player) {
    player.tell(
        Component.of('§5§l☽ Cataclysm §8| §7clique para teleportar  §8·  ')
            .append(Component.of('§e/voltar').click({ action: 'run_command', value: '/voltar' }))
    );

    var chaves = Object.keys(DIMENSOES);
    for (var i = 0; i < chaves.length; i++) {
        var chave = chaves[i];
        var boss = DIMENSOES[chave];

        player.tell(
            Component.of('')
                .append(
                    Component[boss.cor]('► ' + boss.nome)
                        .click({ action: 'run_command', value: '/' + chave })
                        .hover(Text.string('§7' + boss.sub + '\n§8Clique para teleportar'))
                )
        );
    }
}

// ------------------------------------------------------------------
// EXECUTA O TELEPORTE com countdown de 5s na action bar
// ------------------------------------------------------------------
function executarTP(player, chave) {
    var uuid = player.stringUUID;
    var boss = DIMENSOES[chave];

    if (!boss) {
        player.tell('§cDestino não encontrado: ' + chave);
        return 0;
    }

    if (emCooldown(uuid)) {
        player.displayClientMessage(
            Component.red('⏳ Aguarde ' + secsRestantes(uuid) + 's antes do próximo TP!'),
            true
        );
        return 0;
    }

    posicaoAnterior[uuid] = {
        dim: player.level.dimension.toString(),
        x: player.x, y: player.y, z: player.z,
        yaw: player.yaw, pitch: player.pitch
    };

    cooldowns[uuid] = Date.now();

    // Título inicial
    player.server.runCommandSilent('title ' + player.username + ' title {"text":"' + boss.nome + '","color":"' + boss.cor + '","bold":true}');
    player.server.runCommandSilent('title ' + player.username + ' subtitle {"text":"Preparando teleporte...","color":"gray"}');
    player.server.runCommandSilent('title ' + player.username + ' times 5 60 20');

    var ticks = [0, 20, 40, 60, 80];
    var msgs = [
        '§e⏳ Teleportando em §l5§r§e...',
        '§e⏳ Teleportando em §l4§r§e...',
        '§6⏳ Teleportando em §l3§r§e...',
        '§c⏳ Teleportando em §l2§r§e...',
        '§c§l⏳ Teleportando em §l1§r§c§l...'
    ];

    // Countdown — closure captura player e msg corretamente
    for (var t = 0; t < ticks.length; t++) {
        (function (tick, msg) {
            player.server.scheduleInTicks(tick, function () {
                var p = player.server.getPlayerList().getPlayerByUUID(player.uuid);
                if (!p) return;
                p.displayClientMessage(Component.literal(msg), true);
            });
        })(ticks[t], msgs[t]);
    }

    // TP após 5s (100 ticks)
    player.server.scheduleInTicks(100, function () {
        player.server.runCommandSilent(
            'execute in ' + boss.dim + ' run teleport ' + player.username +
            ' ' + boss.x + ' ' + boss.y + ' ' + boss.z
        );

        player.displayClientMessage(Component[boss.cor]('☽ Bem-vindo a ' + boss.nome + '!'), true);
        player.server.runCommandSilent('title ' + player.username + ' title {"text":"' + boss.nome + '","color":"' + boss.cor + '","bold":true}');
        player.server.runCommandSilent('title ' + player.username + ' subtitle {"text":"' + boss.sub + '","color":"gray"}');
        player.server.runCommandSilent('title ' + player.username + ' times 10 40 20');
        player.tell('§7Use §e/voltar §7para retornar ao ponto anterior.');
    });

    return 1;
}

// ------------------------------------------------------------------
// REGISTRO DE COMANDOS
// ------------------------------------------------------------------
ServerEvents.commandRegistry(function (event) {
    var Commands = event.commands;

    // /cataclysm — menu clicável
    event.register(
        Commands.literal('cataclysm')
            .executes(function (ctx) {
                mostrarMenu(ctx.source.player);
                return 1;
            })
    );

    // Um comando por dimensão — sem .requires() = qualquer jogador
    var chaves = Object.keys(DIMENSOES);
    for (var i = 0; i < chaves.length; i++) {
        (function (chave) {
            event.register(
                Commands.literal(chave)
                    .executes(function (ctx) {
                        return executarTP(ctx.source.player, chave);
                    })
            );
        })(chaves[i]);
    }

    // /voltar
    event.register(
        Commands.literal('voltar')
            .executes(function (ctx) {
                var player = ctx.source.player;
                var uuid = player.stringUUID;
                var pos = posicaoAnterior[uuid];
                if (!pos) {
                    player.tell('§cNenhuma posição salva. Use §e/cataclysm §cprimeiro.');
                    return 0;
                }
                player.teleportTo(pos.dim, pos.x, pos.y, pos.z, pos.yaw, pos.pitch);
                player.displayClientMessage(Component.green('✔ Voltou!'), true);
                player.tell('§a✔ Voltou para a posição anterior!');
                delete posicaoAnterior[uuid];
                return 1;
            })
    );
});

// ------------------------------------------------------------------
// LIMPEZA ao deslogar
// ------------------------------------------------------------------
PlayerEvents.loggedOut(function (event) {
    var uuid = event.player.stringUUID;
    delete cooldowns[uuid];
    delete posicaoAnterior[uuid];
});