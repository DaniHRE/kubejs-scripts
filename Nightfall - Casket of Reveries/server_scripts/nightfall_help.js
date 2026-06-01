// ═══════════════════════════════════════════════════════════════
//   NIGHTFALL CRAFT: THE CASKET OF REVERIES
//   Comando /nightfall help — KubeJS (1.20.x+)
//   Arquivo: kubejs/server_scripts/nightfall_help.js
// ═══════════════════════════════════════════════════════════════

ServerEvents.commandRegistry(event => {
    const { commands: Commands } = event

    event.register(
        Commands.literal('nightfall')
            .then(
                Commands.literal('help')
                    .executes(ctx => {
                        const player = ctx.source.player

                        const S = '§'

                        // Cabeçalho
                        player.tell(Text.of(' '))
                        player.tell(Text.of(S + '5' + S + 'm                                        '))
                        player.tell(
                            Text.of('  ☽ ')
                                .color(0x7C3AED)
                            .append(Text.of('NIGHTFALL CRAFT').color(0xE2D4F0).bold(true))
                            .append(Text.of('  —  ').color(0x6B5A8A))
                            .append(Text.of('Guia de Comandos').color(0xA78BCC).italic(true))
                        )
                        player.tell(Text.of(S + '5' + S + 'm                                        '))
                        player.tell(Text.of(' '))

                        // ── Teleporte ───────────────────────────────
                        player.tell(
                            Text.of('  ✦ ').color(0xF59E0B)
                            .append(Text.of('TELEPORTE').color(0xFCD34D).bold(true))
                        )

                        player.tell(
                            Text.of('  ')
                            .append(
                                Text.of('/tpa <jogador>')
                                    .color(0x6EE7B7)
                                    .bold(true)
                                    .clickSuggestCommand('/tpa ')
                                    .hover('§aClique para preencher o comando')
                            )
                            .append(Text.of('  Solicitar teleporte').color(0xD1D5DB))
                        )

                        player.tell(
                            Text.of('  ')
                            .append(
                                Text.of('/tpaccept')
                                    .color(0x6EE7B7)
                                    .bold(true)
                                    .clickSuggestCommand('/tpaccept')
                                    .hover('§aClique para preencher o comando')
                            )
                            .append(Text.of('  Aceitar solicitação').color(0xD1D5DB))
                        )

                        player.tell(
                            Text.of('  ')
                            .append(
                                Text.of('/tpadeny')
                                    .color(0x6EE7B7)
                                    .bold(true)
                                    .clickSuggestCommand('/tpadeny')
                                    .hover('§aClique para preencher o comando')
                            )
                            .append(Text.of('  Recusar solicitação').color(0xD1D5DB))
                        )

                        player.tell(Text.of(' '))

                        // ── Warps ────────────────────────────────────
                        player.tell(
                            Text.of('  ✦ ').color(0xF59E0B)
                            .append(Text.of('LOCAIS').color(0xFCD34D).bold(true))
                        )

                        player.tell(
                            Text.of('  ')
                            .append(
                                Text.of('/warp <local>')
                                    .color(0x93C5FD)
                                    .bold(true)
                                    .clickSuggestCommand('/warp ')
                                    .hover('§bClique para preencher o comando')
                            )
                            .append(Text.of('  Ir a um local fixo').color(0xD1D5DB))
                        )

                        player.tell(Text.of(' '))

                        // ── Utilidades ───────────────────────────────
                        player.tell(
                            Text.of('  ✦ ').color(0xF59E0B)
                            .append(Text.of('UTILIDADES').color(0xFCD34D).bold(true))
                        )

                        player.tell(
                            Text.of('  ')
                            .append(
                                Text.of('/crafting')
                                    .color(0xFCA5A5)
                                    .bold(true)
                                    .clickRunCommand('/crafting')
                                    .hover('§cAbre a mesa de crafting')
                            )
                            .append(Text.of('  Mesa de crafting').color(0xD1D5DB))
                        )

                        player.tell(
                            Text.of('  ')
                            .append(
                                Text.of('/trashcan')
                                    .color(0xFCA5A5)
                                    .bold(true)
                                    .clickRunCommand('/trashcan')
                                    .hover('§cAbre a lixeira de itens')
                            )
                            .append(Text.of('  Descartar itens').color(0xD1D5DB))
                        )

                        player.tell(Text.of(' '))

                        // ── Rodapé ───────────────────────────────────
                        player.tell(
                            Text.of('  ')
                            .append(Text.of('[ ').color(0x6B5A8A))
                            .append(
                                Text.of('Discord')
                                    .color(0xA78BCC)
                                    .bold(true)
                                    .underlined(true)
                                    .clickOpenUrl('https://discord.gg/PwpmmRm7qK')
                                    .hover('§dAbrir servidor do Discord')
                            )
                            .append(Text.of(' ]  ').color(0x6B5A8A))
                            .append(Text.of('Dúvidas? Fale na comunidade.').color(0x6B7280).italic(true))
                        )

                        player.tell(Text.of(S + '5' + S + 'm                                        '))
                        player.tell(Text.of(' '))

                        return 1
                    })
            )
    )
})