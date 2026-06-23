// ═══════════════════════════════════════════════════════════════
//   CRAFTORIA
//   Sistema de Restart com Countdown — KubeJS (1.21.1+)
//   Arquivo: kubejs/server_scripts/craftoria_restart.js
// ═══════════════════════════════════════════════════════════════
//
//   COMANDOS:
//     /craftoria restart <minutos>         → agenda countdown
//     /craftoria restart delay <minutos>   → posterga o restart ativo
//     /craftoria restart cancel            → cancela o restart ativo
//     /craftoria restart 0                 → restart imediato
//
// ═══════════════════════════════════════════════════════════════

var restartVersion = 0
var restartAtivo = false
var restartMinutosTotal = 0

var AVISOS_MINUTOS  = [30, 20, 15, 10, 5, 3, 2, 1]
var AVISOS_SEGUNDOS = [30, 15, 10, 5, 4, 3, 2, 1]

function corTitulo(minutosRestantes) {
    if (minutosRestantes <= 1) return 'red'
    if (minutosRestantes <= 5) return 'gold'
    return 'aqua'
}

function corChat(minutosRestantes) {
    if (minutosRestantes <= 1) return 0xFF4455
    if (minutosRestantes <= 5) return 0xFFAA00
    return 0xE07830
}

function formatarTempo(minutos, segundos) {
    if (minutos > 0 && segundos === undefined) {
        return minutos === 1 ? '1 minuto' : minutos + ' minutos'
    }
    if (minutos === 0 && segundos !== undefined) {
        return segundos === 1 ? '1 segundo' : segundos + ' segundos'
    }
    return minutos + 'm ' + segundos + 's'
}

function avisarTodos(server, minutos, segundos) {
    var tempoStr = formatarTempo(minutos, segundos)
    var cor = minutos === 0 ? 0xFF4455 : corChat(minutos)
    var prefixo = minutos <= 1 && segundos === undefined ? '⚠' : '⚙'
    var urgente = minutos === 0 || (minutos <= 1 && segundos !== undefined && segundos <= 10)

    server.players.forEach(function(p) {
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

    var pitch = minutos === 0 ? 2.0 : minutos <= 1 ? 1.5 : minutos <= 5 ? 1.2 : 1.0
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

function anunciarInicio(server, minutos, quemChamou) {
    server.tell(Text.of('§6§m                                                  '))
    server.tell(
        Text.of('  ⚙ CRAFTORIA — REINÍCIO AGENDADO ✦')
            .color(0xE07830)
            .bold(true)
    )
    server.tell(Text.of(' '))
    server.tell(
        Text.of('  ◈ O servidor será reiniciado em ')
            .color(0xF0C070)
        .append(
            Text.of(formatarTempo(minutos))
                .color(0xFFFFFF)
                .bold(true)
        )
        .append(Text.of('.').color(0xF0C070))
    )
    server.tell(
        Text.of('  ➤ Finalize suas atividades e salve seu progresso.')
            .color(0x8899AA)
            .italic(true)
    )
    server.tell(Text.of(' '))
    server.tell(Text.of('  §8Solicitado por: §7' + quemChamou))
    server.tell(Text.of('§6§m                                                  '))
}

function anunciarPostergamento(server, minutosAdicionados, novoTotal, quemChamou) {
    server.tell(Text.of('§6§m                                                  '))
    server.tell(
        Text.of('  ⏱ CRAFTORIA — RESTART POSTERGADO')
            .color(0xFFAA00)
            .bold(true)
    )
    server.tell(Text.of(' '))
    server.tell(
        Text.of('  ◈ O restart foi adiado em ')
            .color(0xF0C070)
        .append(
            Text.of(formatarTempo(minutosAdicionados))
                .color(0xFFFFFF)
                .bold(true)
        )
        .append(Text.of('.').color(0xF0C070))
    )
    server.tell(
        Text.of('  ◈ Novo tempo restante: ')
            .color(0xF0C070)
        .append(
            Text.of(formatarTempo(novoTotal))
                .color(0x2AFFDD)
                .bold(true)
        )
        .append(Text.of('.').color(0xF0C070))
    )
    server.tell(Text.of(' '))
    server.tell(Text.of('  §8Postergado por: §7' + quemChamou))
    server.tell(Text.of('§6§m                                                  '))
}

function anunciarCancelamento(server, quemChamou) {
    server.tell(Text.of('§6§m                                                  '))
    server.tell(
        Text.of('  ✔ CRAFTORIA — RESTART CANCELADO')
            .color(0x2AFFDD)
            .bold(true)
    )
    server.tell(Text.of(' '))
    server.tell(
        Text.of('  O servidor não será reiniciado por enquanto.')
            .color(0x8899AA)
            .italic(true)
    )
    server.tell(Text.of(' '))
    server.tell(Text.of('  §8Cancelado por: §7' + quemChamou))
    server.tell(Text.of('§6§m                                                  '))
}

function anunciarRestartImediato(server) {
    server.tell(Text.of('§6§m                                                  '))
    server.tell(
        Text.of('  ⚠ O SERVIDOR ESTÁ REINICIANDO AGORA ⚠')
            .color(0xFF4455)
            .bold(true)
    )
    server.tell(
        Text.of('  Até logo, aventureiros da Craftoria...')
            .color(0x2AFFDD)
            .italic(true)
    )
    server.tell(Text.of('§6§m                                                  '))

    server.players.forEach(function(p) {
        server.runCommandSilent(
            '/kick ' + p.username +
            ' §6⚙ Craftoria §r\n' +
            '§fO servidor está reiniciando.\n' +
            '§7Voltamos em §f1 minuto§7.\n\n' +
            '§bAté logo, aventureiro...'
        )
    })
}

// ── Função central: agenda todos os ticks para uma versão ─────
function agendarRestart(server, minutos, versao) {
    var totalTicks = minutos * 60 * 20

    // Avisos em minutos
    for (var i = 0; i < AVISOS_MINUTOS.length; i++) {
        var m = AVISOS_MINUTOS[i]
        if (m < minutos) {
            var ticksAteMin = (minutos - m) * 60 * 20
            ;(function(capM, capV, capTicks) {
                server.scheduleInTicks(capTicks, function() {
                    if (restartVersion !== capV) return
                    avisarTodos(server, capM, undefined)
                })
            })(m, versao, ticksAteMin)
        }
    }

    // Avisos em segundos (último minuto)
    if (minutos >= 1) {
        var baseTicks = (minutos - 1) * 60 * 20
        for (var j = 0; j < AVISOS_SEGUNDOS.length; j++) {
            var s = AVISOS_SEGUNDOS[j]
            var ticksAteSeg = baseTicks + ((60 - s) * 20)
            ;(function(capS, capV, capTicks) {
                server.scheduleInTicks(capTicks, function() {
                    if (restartVersion !== capV) return
                    avisarTodos(server, 0, capS)
                })
            })(s, versao, ticksAteSeg)
        }
    }

    // Restart final
    ;(function(capV) {
        server.scheduleInTicks(totalTicks, function() {
            if (restartVersion !== capV) return
            restartAtivo = false
            anunciarRestartImediato(server)
            server.scheduleInTicks(60, function() {
                server.runCommandSilent('/stop')
            })
        })
    })(versao)
}

// ── Registro dos Comandos ─────────────────────────────────────
ServerEvents.commandRegistry(function(event) {
    var Commands  = event.commands
    var Arguments = event.arguments

    event.register(
        Commands.literal('craftoria')
            .then(
                Commands.literal('restart')

                    // /craftoria restart <minutos>
                    .then(
                        Commands.argument('minutos', Arguments.INTEGER.create(event))
                            .executes(function(ctx) {
                                var minutos      = Arguments.INTEGER.getResult(ctx, 'minutos')
                                var server       = ctx.source.server
                                var senderPlayer = ctx.source.player
                                var senderNome   = senderPlayer ? senderPlayer.username : 'Servidor'

                                if (!ctx.source.hasPermission(2)) {
                                    if (senderPlayer) {
                                        senderPlayer.tell(
                                            Text.of('  ✗ Você não tem permissão para reiniciar o servidor.')
                                                .color(0xFF4455)
                                        )
                                    }
                                    return 0
                                }

                                if (minutos === 0) {
                                    restartAtivo = false
                                    restartVersion++
                                    anunciarRestartImediato(server)
                                    server.scheduleInTicks(60, function() {
                                        server.runCommandSilent('/stop')
                                    })
                                    return 1
                                }

                                if (minutos < 0 || minutos > 120) {
                                    if (senderPlayer) {
                                        senderPlayer.tell(
                                            Text.of('  ✗ Tempo inválido. Use entre 0 e 120 minutos.')
                                                .color(0xFF4455)
                                        )
                                    }
                                    return 0
                                }

                                restartVersion++
                                restartAtivo = true
                                restartMinutosTotal = minutos
                                var versaoAtual = restartVersion

                                anunciarInicio(server, minutos, senderNome)
                                agendarRestart(server, minutos, versaoAtual)
                                return 1
                            })
                    )

                    // /craftoria restart delay <minutos>
                    .then(
                        Commands.literal('delay')
                            .then(
                                Commands.argument('minutos', Arguments.INTEGER.create(event))
                                    .executes(function(ctx) {
                                        var minutos      = Arguments.INTEGER.getResult(ctx, 'minutos')
                                        var server       = ctx.source.server
                                        var senderPlayer = ctx.source.player
                                        var senderNome   = senderPlayer ? senderPlayer.username : 'Servidor'

                                        if (!ctx.source.hasPermission(2)) {
                                            if (senderPlayer) {
                                                senderPlayer.tell(
                                                    Text.of('  ✗ Você não tem permissão.')
                                                        .color(0xFF4455)
                                                )
                                            }
                                            return 0
                                        }

                                        if (!restartAtivo) {
                                            if (senderPlayer) {
                                                senderPlayer.tell(
                                                    Text.of('  ✗ Não há nenhum restart ativo para postergar.')
                                                        .color(0xFF4455)
                                                )
                                            }
                                            return 0
                                        }

                                        if (minutos <= 0 || minutos > 120) {
                                            if (senderPlayer) {
                                                senderPlayer.tell(
                                                    Text.of('  ✗ Use entre 1 e 120 minutos para postergar.')
                                                        .color(0xFF4455)
                                                )
                                            }
                                            return 0
                                        }

                                        restartMinutosTotal = restartMinutosTotal + minutos
                                        restartVersion++
                                        var versaoAtual = restartVersion

                                        anunciarPostergamento(server, minutos, restartMinutosTotal, senderNome)
                                        agendarRestart(server, restartMinutosTotal, versaoAtual)
                                        return 1
                                    })
                            )
                    )

                    // /craftoria restart cancel
                    .then(
                        Commands.literal('cancel')
                            .executes(function(ctx) {
                                var server       = ctx.source.server
                                var senderPlayer = ctx.source.player
                                var senderNome   = senderPlayer ? senderPlayer.username : 'Servidor'

                                if (!ctx.source.hasPermission(2)) {
                                    if (senderPlayer) {
                                        senderPlayer.tell(
                                            Text.of('  ✗ Você não tem permissão.')
                                                .color(0xFF4455)
                                        )
                                    }
                                    return 0
                                }

                                if (!restartAtivo) {
                                    if (senderPlayer) {
                                        senderPlayer.tell(
                                            Text.of('  ✗ Não há nenhum restart ativo para cancelar.')
                                                .color(0xFF4455)
                                        )
                                    }
                                    return 0
                                }

                                restartVersion++
                                restartAtivo = false
                                restartMinutosTotal = 0

                                anunciarCancelamento(server, senderNome)
                                return 1
                            })
                    )
            )
    )
})