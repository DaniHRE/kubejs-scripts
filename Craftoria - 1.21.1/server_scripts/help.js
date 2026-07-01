// ═══════════════════════════════════════════════════════════════════════
// Craftoria - /craftoria help
// KubeJS + NeoForge 1.21.1
// ═══════════════════════════════════════════════════════════════════════

ServerEvents.commandRegistry(event => {
    const { commands: Commands } = event

    event.register(
        Commands.literal('craftoria')
            .then(
                Commands.literal('help')
                    .executes(ctx => {
                        const player = ctx.source.player

                        const GOLD = 0xD4843A
                        const COPPER = 0xC4622D
                        const TEXT = 0xE8D5B0
                        const DIM = 0x7A6856
                        const GREEN = 0x6A9B4A

                        function tell(msg) {
                            player.tell(msg)
                        }

                        function line() {
                            tell(
                                Text.of('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
                                    .color(DIM)
                            )
                        }

                        function title() {
                            tell(
                                Text.of('✦ ')
                                    .color(GOLD)
                                    .append(
                                        Text.of('CRAFTORIA')
                                            .color(COPPER)
                                            .bold(true)
                                    )
                                    .append(
                                        Text.of(' • Guia Rápido')
                                            .color(TEXT)
                                    )
                            )
                        }

                        function category(icon, name) {
                            tell(
                                Text.of('')
                                    .append(Text.of(icon + ' ').color(GOLD))
                                    .append(
                                        Text.of(name)
                                            .color(COPPER)
                                            .bold(true)
                                    )
                            )
                        }

                        function cmd(command, description) {
                            tell(
                                Text.of('  ')
                                    .append(
                                        Text.of(command)
                                            .color(GOLD)
                                            .clickSuggestCommand(command)
                                            .hover('Clique para preencher')
                                    )
                                    .append(
                                        Text.of(' • ' + description)
                                            .color(TEXT)
                                    )
                            )
                        }

                        tell(Text.of(''))
                        line()
                        title()
                        line()

                        tell(Text.of(''))

                        category('✦', 'TELEPORTE')
                        cmd('/tpa ', 'Solicitar teleporte')
                        cmd('/tpaccept', 'Aceitar teleporte')
                        cmd('/tpadeny', 'Recusar teleporte')
                        cmd('/back', 'Voltar ao local anterior')
                        cmd('/spawn', 'Ir para o Spawn')

                        tell(Text.of(''))

                        category('⌂', 'HOME')
                        cmd('/sethome', 'Definir sua Home')
                        cmd('/home', 'Ir para sua Home')
                        cmd('/delhome', 'Remover Home')

                        tell(Text.of(''))

                        category('ℹ', 'LIMITES')
                        tell(Text.of('  • 1 Home').color(TEXT))
                        tell(Text.of('  • 255 Chunks').color(TEXT))
                        tell(Text.of('  • 50 Force Loaded').color(TEXT))
                        tell(Text.of('  • Cooldown TP/Home: 15 min').color(TEXT))

                        tell(Text.of(''))

                        category('🌐', 'DISCORD')
                        tell(
                            Text.of('  discord.gg/PwpmmRm7qK')
                                .color(GOLD)
                                .underlined(true)
                                .clickOpenUrl('https://discord.gg/PwpmmRm7qK')
                                .hover('Abrir Discord')
                        )

                        line()
                        tell(Text.of(''))

                        return 1
                    })
            )
    )
})
