// ═══════════════════════════════════════════════════════════════
//   PROMINENCE™ II: HASTURIAN ERA
//   Script de Entrada do Jogador — KubeJS (1.20.x+)
//   Arquivo: kubejs/server_scripts/prominence_login.js
// ═══════════════════════════════════════════════════════════════

PlayerEvents.loggedIn(event => {
    const player = event.player
    const server = event.server

    player.playSound('minecraft:block.amethyst_block.chime', 0.8, 0.85)

    server.runCommandSilent('/title ' + player.username + ' times 20 80 20')
    server.runCommandSilent(
        '/title ' + player.username + ' title ' +
        '{"text":"❂ PROMINENCE™ II ❂","color":"gold","bold":true}'
    )
    server.runCommandSilent(
        '/title ' + player.username + ' subtitle ' +
        '{"text":"Hasturian Era","color":"yellow","italic":true}'
    )

    // ── Cabeçalho ────────────────────────────────────────────────
    player.tell(Text.of('§6§m                                                  '))

    player.tell(
        Text.of('  ❂ ').color(0xFFAA00)
        .append(Text.of('PROMINENCE™ II').color(0xFFFF55).bold(true))
        .append(Text.of('  Bem-vindo(a), ').color(0xAAAAAA))
        .append(Text.of(player.username).color(0xFFAA00).bold(true))
        .append(Text.of(' ✦').color(0xFFFF55))
    )

    player.tell(Text.of('§6§m                                                  '))
    player.tell(Text.of(' '))

    // ── Avisos em linha ──────────────────────────────────────────
    player.tell(
        Text.of('  ').color(0xFFAA00)
        .append(Text.of('◈ ').color(0xFFAA00))
        .append(Text.of('Verifique o Discord').color(0xFCA5A5).bold(true))
        .append(Text.of(' — atualizações podem ter sido implementadas.').color(0xAAAAAA))
    )

    player.tell(
        Text.of('  ').color(0xFFAA00)
        .append(Text.of('◈ ').color(0xFFAA00))
        .append(Text.of('Suas escolhas moldam sua história.').color(0xFFFF55).italic(true))
        .append(Text.of(' Consulte os canais de quests.').color(0x777777).italic(true))
    )

    player.tell(Text.of(' '))

    // ── Links ────────────────────────────────────────────────────
    player.tell(
        Text.of('  ')
        .append(
            Text.of('[ Discord ]')
                .color(0xFFAA00).bold(true).underlined(true)
                .clickOpenUrl('https://discord.gg/PwpmmRm7qK')
                .hover('§6Abrir servidor do Discord')
        )
        .append(Text.of('  ').color(0x777777))
        .append(
            Text.of('[ Novidades ]')
                .color(0xFFFF55).bold(true).underlined(true)
                .clickOpenUrl('https://discord.com/channels/1498044727612932181/1509754406575407184')
                .hover('§eVer atualizações recentes de mods e quests')
        )
        .append(Text.of('  ').color(0x777777))
    )

    player.tell(Text.of(' '))
    player.tell(Text.of('§6§m                                                  '))
})