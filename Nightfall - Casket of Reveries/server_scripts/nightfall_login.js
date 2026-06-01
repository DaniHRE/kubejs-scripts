// ═══════════════════════════════════════════════════════════════
//   NIGHTFALL CRAFT: THE CASKET OF REVERIES
//   Script de Entrada do Jogador — KubeJS (1.20.x+)
//   Arquivo: kubejs/server_scripts/nightfall_login.js
// ═══════════════════════════════════════════════════════════════

PlayerEvents.loggedIn(event => {
    const player = event.player
    const server = event.server

    player.playSound('minecraft:block.amethyst_block.chime', 0.8, 0.85)

    server.runCommandSilent('/title ' + player.username + ' times 20 80 20')
    server.runCommandSilent(
        '/title ' + player.username + ' title ' +
        '{"text":"✦ NIGHTFALL CRAFT ✦","color":"dark_purple","bold":true}'
    )
    server.runCommandSilent(
        '/title ' + player.username + ' subtitle ' +
        '{"text":"The Casket of Reveries","color":"light_purple","italic":true}'
    )

    // ── Cabeçalho ────────────────────────────────────────────────
    player.tell(Text.of('§5§m                                                  '))

    player.tell(
        Text.of('  ☽ ').color(0x7C3AED)
        .append(Text.of('NIGHTFALL CRAFT').color(0xE2D4F0).bold(true))
        .append(Text.of('  Bem-vindo(a), ').color(0x6B5A8A))
        .append(Text.of(player.username).color(0xFCD34D).bold(true))
        .append(Text.of(' ☾').color(0x7C3AED))
    )

    player.tell(Text.of('§5§m                                                  '))
    player.tell(Text.of(' '))

    // ── Avisos em linha ──────────────────────────────────────────
    player.tell(
        Text.of('  ').color(0xF59E0B)
        .append(Text.of('✦ ').color(0xF59E0B))
        .append(Text.of('Verifique o Discord').color(0xFCA5A5).bold(true))
        .append(Text.of(' — atualizações podem ter sido implementadas.').color(0xD1D5DB))
    )

    player.tell(
        Text.of('  ').color(0xF59E0B)
        .append(Text.of('✦ ').color(0xF59E0B))
        .append(Text.of('Suas escolhas moldam sua história.').color(0xA78BCC).italic(true))
        .append(Text.of(' Consulte os canais de quests.').color(0x6B7280).italic(true))
    )

    player.tell(Text.of(' '))

    // ── Links ────────────────────────────────────────────────────
    player.tell(
        Text.of('  ')
        .append(
            Text.of('[ Discord ]')
                .color(0x9B84EC).bold(true).underlined(true)
                .clickOpenUrl('https://discord.gg/PwpmmRm7qK')
                .hover('§dAbrir servidor do Discord')
        )
        .append(Text.of('  ').color(0x6B5A8A))
        .append(
            Text.of('[ Novidades ]')
                .color(0x93C5FD).bold(true).underlined(true)
                .clickOpenUrl('https://discord.com/channels/1498044727612932181/1509754406575407184')
                .hover('§bVer atualizações recentes de mods e quests')
        )
        .append(Text.of('  ').color(0x6B5A8A))
        .append(
            Text.of('[ /nightfall help ]')
                .color(0x6EE7B7).bold(true).underlined(true)
                .clickRunCommand('/nightfall help')
                .hover('§aVer todos os comandos disponíveis')
        )
    )

    player.tell(Text.of(' '))
    player.tell(Text.of('§5§m                                                  '))
})