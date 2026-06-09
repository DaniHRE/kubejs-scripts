// ═══════════════════════════════════════════════════════════════════════════════
//   PROMINENCE™ II: HASTURIAN ERA
//   Arte de boot no console — KubeJS 6 (1.20.x · Fabric)
//   Arquivo : kubejs/server_scripts/prominence_serverready.js
//   Autor   : DaniHRE
//   Versão  : 2.6.0
//
//   Todas as infos são lidas DINAMICAMENTE via APIs nativas do KubeJS/MC.
//   Sem Java reflection — 100% compatível com o filtro de classes do KubeJS 6.
//   Único valor manual: ADDRESS (IP público não existe em nenhuma API do server).
// ═══════════════════════════════════════════════════════════════════════════════

ServerEvents.loaded(event => {

    // Único valor que não vem de API — IP público/domínio externo do servidor
    var ADDRESS = 'tresmoscas.jogar.io'

    // Captura o server antes do callback — referência que o Rhino mantém viva no closure
    var s = event.server

    // Delay de 300 ticks (~15 s) para o servidor estabilizar antes de imprimir
    s.scheduleInTicks(300, () => {

        // ── ANSI escape codes ─────────────────────────────────────────────────
        var E       = '\u001B['
        var RESET   = E + '0m'
        var BOLD    = E + '1m'
        var DIM_TXT = E + '2m'
        var ITALIC  = E + '3m'

        // Paleta Hasturiana
        var GOLD    = E + '38;5;227m'   // Dourado pálido  — Primary
        var AMBER   = E + '38;5;214m'   // Âmbar/oxidado   — Accent
        var PURPLE  = E + '38;5;91m'    // Roxo profundo   — Deep
        var CORRUPT = E + '38;5;171m'   // Lilás corrupto  — Corruption
        var WHITE   = E + '97m'         // Branco puro     — Highlight
        var DIM     = E + '38;5;245m'   // Cinza médio     — Dim
        var GRAY    = E + '38;5;240m'   // Cinza escuro    — Shadow
        var GREEN   = E + '38;5;114m'   // Verde suave     — Status OK
        var CYAN    = E + '38;5;153m'   // Azul-ciano      — Labels

        // ── Helpers — sem default parameters (Rhino não suporta) ─────────────

        function ln(text) { console.log(typeof text !== 'undefined' ? text : '') }

        function sep(color, char, len) {
            var c = typeof char !== 'undefined' ? char : '\u2500'
            var l = typeof len  !== 'undefined' ? len  : 88
            return color + c.repeat(l) + RESET
        }

        function center(text, width) {
            var w      = typeof width !== 'undefined' ? width : 88
            var visual = text.replace(/\u001B\[[0-9;]*m/g, '')
            var pad    = Math.max(0, Math.floor((w - visual.length) / 2))
            return ' '.repeat(pad) + text
        }

        function kv(label, value, col) {
            var c   = typeof col !== 'undefined' ? col : 22
            var pad = Math.max(1, c - label.length)
            return (
                '  ' +
                CYAN  + label + RESET +
                ' '.repeat(pad) +
                GRAY  + '\u2502' + RESET +
                '  '  + WHITE + value + RESET
            )
        }

        // ── Dados dinâmicos ───────────────────────────────────────────────────

        // Data e hora reais (JS puro — sempre funciona no Rhino)
        var now     = new Date()
        var dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        var timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

        // Versão MC e loader
        var mcVersion  = s.serverVersion
        var loaderRaw  = s.serverModName
        var loaderName = loaderRaw.substring(0, 1).toUpperCase() + loaderRaw.substring(1)

        // Versão KubeJS
        var kjsVersion = Platform.mods.kubejs.version

        // MOTD limpo
        var motdClean = s.motd.replace(/\u00a7[0-9a-fklmnor]/gi, '').trim()

        // ── ARTE ASCII ────────────────────────────────────────────────────────

        ln('')
        ln(sep(GRAY, '\u00b7'))
        ln('')
        ln(AMBER + '        \u2742' + RESET)
        ln('')

        // PROMINENCE
        ln(GOLD  + BOLD + '  \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2557 \u2588\u2588\u2557 \u2588\u2588\u2588\u2557  \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557  \u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557' + RESET)
        ln(GOLD  + BOLD + '  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d \u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d' + RESET)
        ln(AMBER + BOLD + '  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551 \u2588\u2588\u2551 \u2588\u2588\u2554\u2588\u2588\u2557\u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2554\u2588\u2588\u2557\u2588\u2588\u2551 \u2588\u2588\u2551      \u2588\u2588\u2588\u2588\u2588\u2557  ' + RESET)
        ln(AMBER + BOLD + '  \u2588\u2588\u2554\u2550\u2550\u2550\u255d  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2551\u255a\u2588\u2588\u2554\u255d\u2588\u2588\u2551 \u2588\u2588\u2551 \u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u255d   \u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2551      \u2588\u2588\u2554\u2550\u2550\u255d  ' + RESET)
        ln(GOLD  + BOLD + '  \u2588\u2588\u2551      \u2588\u2588\u2551  \u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2551 \u255a\u2550\u255d \u2588\u2588\u2551 \u2588\u2588\u2551 \u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557' + RESET)
        ln(GRAY  +        '  \u255a\u2550\u255d      \u255a\u2550\u255d  \u255a\u2550\u255d  \u255a\u2550\u2550\u2550\u2550\u2550\u255d  \u255a\u2550\u255d     \u255a\u2550\u255d \u255a\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u2550\u255d  \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d' + RESET)
        ln('')

        // HASTURIAN
        ln(PURPLE + BOLD + '      \u2588\u2588\u2557  \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557   \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2557  \u2588\u2588\u2557' + RESET)
        ln(PURPLE + BOLD + '      \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255d \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551' + RESET)
        ln(CORRUPT+BOLD + '      \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557    \u2588\u2588\u2551    \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2554\u2588\u2588\u2557\u2588\u2588\u2551' + RESET)
        ln(CORRUPT+BOLD + '      \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u255a\u2550\u2550\u2550\u2550\u2588\u2588\u2551    \u2588\u2588\u2551    \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2551' + RESET)
        ln(PURPLE + BOLD + '      \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551    \u2588\u2588\u2551    \u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551 \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2551' + RESET)
        ln(GRAY   +        '      \u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d    \u255a\u2550\u255d     \u255a\u2550\u2550\u2550\u2550\u2550\u255d  \u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u2550\u255d' + RESET)
        ln('')

        // ERA
        ln(AMBER + BOLD + '                          \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2557 ' + RESET)
        ln(AMBER + BOLD + '                          \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557' + RESET)
        ln(GOLD  + BOLD + '                          \u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551' + RESET)
        ln(GOLD  + BOLD + '                          \u2588\u2588\u2554\u2550\u2550\u255d   \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551' + RESET)
        ln(AMBER + BOLD + '                          \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551  \u2588\u2588\u2551' + RESET)
        ln(GRAY  +        '                          \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d' + RESET)
        ln('')
        ln(center(DIM + ITALIC + '\u2726  The Yellow King stirs. The era has begun.  \u2726' + RESET))
        ln('')

        // ── SERVER INFO ───────────────────────────────────────────────────────
        ln(sep(PURPLE + DIM_TXT, '='))
        ln('')
        ln(AMBER + BOLD + '  \u25c8  SERVER INFO' + RESET)
        ln('')
        ln(kv('Modpack',     'Prominence\u2122 II: Hasturian Era'))
        ln(kv('Minecraft',   mcVersion))
        ln(kv('Loader',      loaderName + ' \u00b7 KubeJS ' + kjsVersion))
        ln(kv('Endereco',    ADDRESS))
        ln(kv('MOTD',        motdClean))
        ln('')

        // ── RUNTIME STATUS ────────────────────────────────────────────────────
        ln(AMBER + BOLD + '  \u25c8  RUNTIME STATUS' + RESET)
        ln('')
        ln(kv('Estado',      GREEN + BOLD + '\u25cf ONLINE' + RESET))
        ln(kv('Data / Hora', dateStr + '  ' + DIM + timeStr + RESET))
        ln('')

        // ── Rodape ────────────────────────────────────────────────────────────
        ln(sep(PURPLE + DIM_TXT, '='))
        ln('')
        ln(center(AMBER + BOLD + 'SERVER READY' + RESET + GRAY + '  \u25c8  ' + RESET + DIM + ITALIC + 'the era begins, traveler.' + RESET))
        ln('')
        ln(AMBER + '        \u2726' + RESET)
        ln(sep(GRAY, '\u00b7'))
        ln('')

    }) // fim do scheduleInTicks
})