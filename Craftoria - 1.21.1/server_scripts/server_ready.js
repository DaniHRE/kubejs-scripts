// ═══════════════════════════════════════════════════════════════════════════════
//   CRAFTORIA
//   Arte de boot no console — KubeJS NeoForge (1.21.1)
//   Arquivo : kubejs/server_scripts/craftoria_serverready.js
//   Autor   : DaniHRE
//   Versão  : 1.2.0
//
//   Todas as infos são lidas DINAMICAMENTE via APIs nativas do KubeJS/MC.
//   Sem Java reflection — compatível com o filtro de classes do KubeJS NeoForge.
//   Único valor manual: ADDRESS (IP público não existe em nenhuma API do server).
// ═══════════════════════════════════════════════════════════════════════════════

ServerEvents.loaded(event => {

    var ADDRESS = 'tresmoscas.jogar.io'

    var s = event.server

    s.scheduleInTicks(300, () => {

        // ── ANSI escape codes ─────────────────────────────────────────────────
        var E       = '\u001B['
        var RESET   = E + '0m'
        var BOLD    = E + '1m'
        var DIM_TXT = E + '2m'
        var ITALIC  = E + '3m'

        // Paleta Craftoria — extraída do server-icon
        var TERRA   = E + '38;5;166m'   // Terracota queimado  — Primary · Logo
        var AMBER   = E + '38;5;172m'   // Âmbar/laranja       — Accent · Brilho
        var SAND    = E + '38;5;180m'   // Arenito/bege        — Labels · Destaque
        var COPPER  = E + '38;5;136m'   // Cobre/dourado       — Headers
        var WOOD    = E + '38;5;130m'   // Madeira marrom      — Mid-tone
        var DARK    = E + '38;5;52m'    // Mogno escuro        — Shadow · Bordas
        var CREAM   = E + '38;5;223m'   // Creme off-white     — White text
        var RUST    = E + '38;5;95m'    // Cinza ferrugem      — Dim · Separadores
        var GREEN   = E + '38;5;64m'    // Verde musgo         — Status OK
        var COAL    = E + '38;5;235m'   // Carvão              — Background ref

        // ── Helpers ───────────────────────────────────────────────────────────

        function ln(text) { console.log(typeof text !== 'undefined' ? text : '') }

        function sep(color, char, len) {
            var c = typeof char !== 'undefined' ? char : '-'
            var l = typeof len  !== 'undefined' ? len  : 88
            return color + c.repeat(l) + RESET
        }

        function stripAnsi(text) {
            var ESC = '\u001B'
            var out = ''
            var i   = 0
            while (i < text.length) {
                if (text[i] === ESC && i + 1 < text.length && text[i + 1] === '[') {
                    i += 2
                    while (i < text.length && !(text[i] >= 'A' && text[i] <= 'Z') && !(text[i] >= 'a' && text[i] <= 'z')) {
                        i++
                    }
                    i++
                } else {
                    out += text[i]
                    i++
                }
            }
            return out
        }

        function center(text, width) {
            var w   = typeof width !== 'undefined' ? width : 88
            var vis = stripAnsi(text)
            var pad = Math.max(0, Math.floor((w - vis.length) / 2))
            return ' '.repeat(pad) + text
        }

        function kv(label, value, col) {
            var c   = typeof col !== 'undefined' ? col : 22
            var pad = Math.max(1, c - label.length)
            return (
                '  ' +
                SAND + label + RESET +
                ' '.repeat(pad) +
                RUST + '|' + RESET +
                '  ' + CREAM + value + RESET
            )
        }

        // ── Data/hora manual ─────────────────────────────────────────────────
        var now  = new Date()
        var dd   = now.getDate()
        var mm   = now.getMonth() + 1
        var yyyy = now.getFullYear()
        var hh   = now.getHours()
        var mi   = now.getMinutes()
        var ss   = now.getSeconds()

        function z(n) { return n < 10 ? '0' + n : '' + n }

        var dateStr = z(dd) + '/' + z(mm) + '/' + yyyy
        var timeStr = z(hh) + ':' + z(mi) + ':' + z(ss)

        // ── Dados do servidor ─────────────────────────────────────────────────
        var mcVersion  = s.serverVersion
        var loaderRaw  = s.serverModName
        var loaderName = loaderRaw.substring(0, 1).toUpperCase() + loaderRaw.substring(1)
        var kjsVersion = Platform.mods.kubejs.version

        // ── ARTE ASCII ────────────────────────────────────────────────────────

        ln('')
        ln(sep(DARK + DIM_TXT, '.'))
        ln('')

        // Logo CRAFTORIA — paleta terracota/âmbar do ícone
        ln(TERRA + BOLD + '  ██████╗ ██████╗  █████╗  ███████╗████████╗ ██████╗ ██████╗  ██╗ █████╗' + RESET)
        ln(TERRA + BOLD + '  ██╔════╝ ██╔══██╗██╔══██╗ ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗ ██║██╔══██╗' + RESET)
        ln(AMBER + BOLD + '  ██║      ██████╔╝███████║ █████╗     ██║   ██║   ██║██████╔╝ ██║███████║' + RESET)
        ln(AMBER + BOLD + '  ██║      ██╔══██╗██╔══██║ ██╔══╝     ██║   ██║   ██║██╔══██╗ ██║██╔══██║' + RESET)
        ln(COPPER + BOLD + '  ╚██████╗ ██║  ██║██║  ██║ ██║        ██║   ╚██████╔╝██║  ██║ ██║██║  ██║' + RESET)
        ln(WOOD  +         '   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═╝        ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═╝╚═╝  ╚═╝' + RESET)
        ln('')

        ln(center(SAND + ITALIC + 'Tech. Magic. Automation. Adventure.' + RESET))
        ln(center(RUST + DIM_TXT + 'by TeamAOE  -  500+ mods  -  2000+ quests' + RESET))
        ln('')

        // ── SERVER INFO ───────────────────────────────────────────────────────
        ln(sep(WOOD + DIM_TXT, '='))
        ln('')
        ln(COPPER + BOLD + '  >>  SERVER INFO' + RESET)
        ln('')
        ln(kv('Modpack',     'Craftoria'))
        ln(kv('Minecraft',   mcVersion))
        ln(kv('Loader',      loaderName + '  -  KubeJS ' + kjsVersion))
        ln(kv('Endereco',    ADDRESS))
        ln('')

        // ── RUNTIME STATUS ────────────────────────────────────────────────────
        ln(COPPER + BOLD + '  >>  RUNTIME STATUS' + RESET)
        ln('')
        ln(kv('Estado',      GREEN + BOLD + '[ ONLINE ]' + RESET))
        ln(kv('Data / Hora', dateStr + '  ' + RUST + timeStr + RESET))
        ln('')

        // ── Rodape ────────────────────────────────────────────────────────────
        ln(sep(WOOD + DIM_TXT, '='))
        ln('')
        ln(center(AMBER + BOLD + 'SERVER READY' + RESET + RUST + '  >>  ' + RESET + SAND + ITALIC + 'your factory awaits, engineer.' + RESET))
        ln('')
        ln(sep(DARK + DIM_TXT, '.'))
        ln('')

    })
})