PlayerEvents.loggedIn(event => {

    const player = event.player

    // Som ao entrar
    player.playSound('minecraft:block.amethyst_block.chime', 0.7, 1)

    // Título
    event.server.runCommandSilent(
        '/title ' + player.username + ' title {"text":"☣ DECEASED CRAFT ☣","color":"dark_red","bold":true}'
    )

    event.server.runCommandSilent(
        '/title ' + player.username + ' subtitle {"text":"Confira o Discord antes de jogar","color":"gray"}'
    )

    // Chat
    player.tell(Text.of("§8§m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))

    player.tell(
        Text.of("☣ DECEASED CRAFT ☣")
        .red()
        .bold(true)
    )

    player.tell(Text.of(" "))

    player.tell(
        Text.of("➤ Antes de jogar, confira o Discord.")
            .white()
            .bold(true)
    )

    player.tell(
        Text.of("➤ Mudanças no server podem ter acontecido.")
            .gray()
    )

    player.tell(Text.of(" "))

    player.tell(
        Text.of("[ ABRIR DISCORD ]")
            .color(0x5865F2)
            .bold(true)
            .clickOpenUrl("https://discord.com/channels/1498044727612932181/1502653134781153431")
            .hover("Clique para abrir o Discord")
    )

    player.tell(Text.of("§8§m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))

})