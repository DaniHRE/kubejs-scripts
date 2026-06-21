// ═══════════════════════════════════════════════════════════════
//   CRAFTORIA
//   Script de Entrada do Jogador — KubeJS 7 · NeoForge 1.21.1
//   Arquivo: kubejs/server_scripts/craftoria_login.js
// ═══════════════════════════════════════════════════════════════

PlayerEvents.loggedIn(event => {
    const player = event.player
    const server = event.server

    // ── Cabeçalho ────────────────────────────────────────────────
    player.tell(Text.of('§6§m                                                  '))

    player.tell(
        Text.of('  ⚙ ').color(0x2AFFDD)
        .append(Text.of('CRAFTORIA').color(0xE07830).bold(true))
        .append(Text.of('  Bem-vindo(a), ').color(0x8899AA))
        .append(Text.of(player.username).color(0xF0C070).bold(true))
        .append(Text.of(' ✦').color(0x2AFFDD))
    )

    player.tell(Text.of('§6§m                                                  '))
    player.tell(Text.of(' '))

    // ── Avisos em linha ──────────────────────────────────────────
    player.tell(
        Text.of('  ')
        .append(Text.of('◈ ').color(0xE07830))
        .append(Text.of('Verifique o Discord').color(0xFCA5A5).bold(true))
        .append(Text.of(' — atualizações podem ter sido implementadas.').color(0x8899AA))
    )

    player.tell(
        Text.of('  ')
        .append(Text.of('◈ ').color(0xE07830))
        .append(Text.of('Explore, construa e progrida.').color(0xF0C070).italic(true))
        .append(Text.of(' Consulte os canais de quests.').color(0x8899AA).italic(true))
    )

    player.tell(Text.of(' '))

    // ── Links ────────────────────────────────────────────────────
    player.tell(
        Text.of('  ')
        .append(
            Text.of('[ Discord ]')
                .color(0xE07830).bold(true).underlined(true)
                .clickOpenUrl('https://discord.gg/PwpmmRm7qK')
                .hover('§6Abrir servidor do Discord')
        )
        .append(Text.of('  ').color(0x8899AA))
    )

    player.tell(Text.of(' '))
    player.tell(Text.of('§6§m                                                  '))
})