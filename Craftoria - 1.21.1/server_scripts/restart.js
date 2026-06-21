// ═══════════════════════════════════════════════════════════════
//   CRAFTORIA
//   Sistema de Restart com Countdown — KubeJS (1.21.1+)
//   Arquivo: kubejs/server_scripts/craftoria_restart.js
// ═══════════════════════════════════════════════════════════════
//
//   USO:
//     /craftoria restart <minutos>
//
//   EXEMPLOS:
//     /craftoria restart 10   → countdown de 10 minutos
//     /craftoria restart 5    → countdown de 5 minutos
//     /craftoria restart 1    → aviso de último minuto
//     /craftoria restart 0    → reinicia imediatamente
//
//   PERMISSÕES:
//     Apenas operadores (nível 2+) podem executar o comando.
//
// ═══════════════════════════════════════════════════════════════
//
//   PALETA DE CORES (baseada na arte oficial do modpack)
//   ┌─────────────────────┬───────────┬────────────┬──────────┐
//   │ Papel               │ Hex       │ 0x (chat)  │ § code   │
//   ├─────────────────────┼───────────┼────────────┼──────────┤
//   │ Cobre/laranja (marca)│ #E07830  │ 0xE07830   │ §6       │
//   │ Laranja vivo        │ #C8642A   │ 0xC8642A   │ §6       │
//   │ Ciano élfico        │ #2AFFDD   │ 0x2AFFDD   │ §b       │
//   │ Bege/dourado texto  │ #F0C070   │ 0xF0C070   │ §e       │
//   │ Marrom fundo        │ #3D1F0F   │ 0x3D1F0F   │ §8       │
//   │ Cinza pedra         │ #8899AA   │ 0x8899AA   │ §7       │
//   │ Vermelho alerta     │ #FF4455   │ 0xFF4455   │ §c       │
//   │ Âmbar aviso         │ #FFAA00   │ 0xFFAA00   │ §6       │
//   └─────────────────────┴───────────┴────────────┴──────────┘
//
// ═══════════════════════════════════════════════════════════════

// ── Avisos programados (em minutos antes do restart) ────────────
const AVISOS_MINUTOS = [30, 20, 15, 10, 5, 3, 2, 1]

// ── Avisos em segundos (no último minuto) ───────────────────────
const AVISOS_SEGUNDOS = [30, 15, 10, 5, 4, 3, 2, 1]

// ── Cor dos títulos na tela ──────────────────────────────────────
function corTitulo(minutosRestantes) {
    if (minutosRestantes <= 1) return 'red'
    if (minutosRestantes <= 5) return 'gold'
    return 'aqua'           // ciano élfico Craftoria
}

// ── Cor do texto no chat ─────────────────────────────────────────
function corChat(minutosRestantes) {
    if (minutosRestantes <= 1) return 0xFF4455   // vermelho alerta
    if (minutosRestantes <= 5) return 0xFFAA00   // âmbar aviso
    return 0xE07830                              // cobre/laranja Craftoria
}

// ── Formatação de tempo para exibição ───────────────────────────
function formatarTempo(minutos, segundos) {
    if (minutos > 0 && segundos === undefined) {
        return minutos === 1 ? '1 minuto' : minutos + ' minutos'
    }
    if (minutos === 0 && segundos !== undefined) {
        return segundos === 1 ? '1 segundo' : segundos + ' segundos'
    }
    return minutos + 'm ' + segundos + 's'
}

// ── Função: Aviso broadcast para todos os jogadores ─────────────
function avisarTodos(server, minutos, segundos) {
    let tempoStr = formatarTempo(minutos, segundos)
    let cor = minutos === 0 ? 0xFF4455 : corChat(minutos)
    let prefixo = minutos <= 1 && segundos === undefined ? '⚠' : '⚙'
    let urgente = minutos === 0 || (minutos <= 1 && segundos !== undefined && segundos <= 10)

    server.players.forEach(p => {
        server.runCommandSilent('/title ' + p.username + ' times 10 40 10')
        server.runCommandSilent(
            '/title ' + p.username + ' title ' +
            '{"text":"' + (urgente ? '⚠ RESTART ⚠' : '⚙ RESTART ⚙') + '",' +
            '"color":"' + (urgente ? 'red' : minutos <= 5 ? 'gold' : 'aqua') + '",' +
            '"bold":true}'
        )
        server.runCommandSilent(
            '/title ' + p.username + ' subtitle ' +
            '{"text":"em ' + tempoStr + '",' +
            '"color":"' + (urgente ? 'yellow' : 'gray') + '"}'
        )
    })

    let pitch = minutos === 0 ? 2.0 : minutos <= 1 ? 1.5 : minutos <= 5 ? 1.2 : 1.0
    server.runCommandSilent(
        '/execute as @a run playsound minecraft:block.amethyst_block.chime master @s ~ ~ ~ 1 ' + pitch
    )

    server.tell(
        Text.of('  ' + prefixo + ' O servidor reiniciará em ')
            .color(cor)
            .bold(urgente)
        .append(
            Text.of(tempoStr)
                .color(urgente ? 0xFF6666 : 0xFFFFFF)
                .bold(true)
        )
        .append(
            Text.of('.')
                .color(cor)
                .bold(urgente)
        )
    )

    if (urgente) {
        server.tell(
            Text.of('  ➤ Salve seu progresso agora!')
                .color(0xFFAA00)
                .bold(true)
        )
    }
}

// ── Função: Mensagem de início do countdown ─────────────────────
function anunciarInicio(server, minutos, quemChamou) {
    server.tell(Text.of('§6§m                                                  '))

    server.tell(
        Text.of('  ⚙ CRAFTORIA — REINÍCIO AGENDADO ✦')
            .color(0xE07830)    // cobre/laranja
            .bold(true)
    )

    server.tell(Text.of(' '))

    server.tell(
        Text.of('  ◈ O servidor será reiniciado em ')
            .color(0xF0C070)    // bege dourado
        .append(
            Text.of(formatarTempo(minutos))
                .color(0xFFFFFF)
                .bold(true)
        )
        .append(
            Text.of('.')
                .color(0xF0C070)
        )
    )

    server.tell(
        Text.of('  ➤ Finalize suas atividades e salve seu progresso.')
            .color(0x8899AA)    // cinza pedra
            .italic(true)
    )

    server.tell(Text.of(' '))

    server.tell(
        Text.of('  §8Solicitado por: §7' + quemChamou)
    )

    server.tell(Text.of('§6§m                                                  '))
}

// ── Função: Restart imediato — kick de todos + /stop ────────────
function anunciarRestartImediato(server) {
    server.tell(Text.of('§6§m                                                  '))

    server.tell(
        Text.of('  ⚠ O SERVIDOR ESTÁ REINICIANDO AGORA ⚠')
            .color(0xFF4455)    // vermelho alerta
            .bold(true)
    )

    server.tell(
        Text.of('  Até logo, aventureiros da Craftoria...')
            .color(0x2AFFDD)    // ciano élfico
            .italic(true)
    )

    server.tell(Text.of('§6§m                                                  '))

    // Kick de todos com mensagem temática na tela de desconexão
    server.players.forEach(p => {
        server.runCommandSilent(
            '/kick ' + p.username +
            ' §6⚙ Craftoria §r\n' +
            '§fO servidor está reiniciando.\n' +
            '§7Voltamos em §f1 minuto§7.\n\n' +
            '§bAté logo, aventureiro...'
        )
    })
}

// ── Registro do Comando ──────────────────────────────────────────
ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event

    event.register(
        Commands.literal('craftoria')
            .then(
                Commands.literal('restart')
                    .then(
                        Commands.argument('minutos', Arguments.INTEGER.create(event))
                            .executes(ctx => {
                                const minutos      = Arguments.INTEGER.getResult(ctx, 'minutos')
                                const server       = ctx.source.server
                                const senderPlayer = ctx.source.player   // null se for console
                                const senderNome   = senderPlayer ? senderPlayer.username : 'Servidor'

                                // ── Verificação de permissão ────────────────
                                if (!ctx.source.hasPermission(2)) {
                                    if (senderPlayer) {
                                        senderPlayer.tell(
                                            Text.of('  ✗ Você não tem permissão para reiniciar o servidor.')
                                                .color(0xFF4455)
                                        )
                                    }
                                    return 0
                                }

                                // ── Restart imediato ────────────────────────
                                if (minutos === 0) {
                                    anunciarRestartImediato(server)
                                    server.scheduleInTicks(60, () => {
                                        server.runCommandSilent('/stop')
                                    })
                                    return 1
                                }

                                // ── Validação ───────────────────────────────
                                if (minutos < 0 || minutos > 120) {
                                    if (senderPlayer) {
                                        senderPlayer.tell(
                                            Text.of('  ✗ Tempo inválido. Use entre 0 e 120 minutos.')
                                                .color(0xFF4455)
                                        )
                                    }
                                    return 0
                                }

                                // ── Anúncio inicial ─────────────────────────
                                anunciarInicio(server, minutos, senderNome)

                                let totalTicks = minutos * 60 * 20

                                // ── Agenda avisos em minutos ────────────────
                                AVISOS_MINUTOS.forEach(m => {
                                    if (m < minutos) {
                                        let ticksAteMin = (minutos - m) * 60 * 20
                                        server.scheduleInTicks(ticksAteMin, () => {
                                            avisarTodos(server, m, undefined)
                                        })
                                    }
                                })

                                // ── Agenda avisos em segundos (último minuto) ─
                                if (minutos >= 1) {
                                    let baseTicks = (minutos - 1) * 60 * 20
                                    AVISOS_SEGUNDOS.forEach(s => {
                                        let ticksAteSeg = baseTicks + ((60 - s) * 20)
                                        server.scheduleInTicks(ticksAteSeg, () => {
                                            avisarTodos(server, 0, s)
                                        })
                                    })
                                }

                                // ── Restart final: kick todos + /stop ───────
                                server.scheduleInTicks(totalTicks, () => {
                                    anunciarRestartImediato(server)
                                    server.scheduleInTicks(60, () => {
                                        server.runCommandSilent('/stop')
                                    })
                                })

                                return 1
                            })
                    )
            )
    )
})