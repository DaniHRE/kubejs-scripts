// ═══════════════════════════════════════════════════════════════
//   PROMINENCE™ II: HASTURIAN ERA
//   Arte de boot no console — KubeJS (1.20.x+)
//   Arquivo: kubejs/server_scripts/prominence_serverready.js
//
//   Cores via ANSI escape codes (funciona no terminal Fabric)
// ═══════════════════════════════════════════════════════════════
ServerEvents.loaded(event => {
    const server = event.server
    server.scheduleInTicks(300, () => {

    // ── ANSI escape codes ────────────────────────────────────────
    const E      = '\u001B['
    const RESET  = E + '0m'
    const BOLD   = E + '1m'
    const ITALIC = E + '3m'
    const GOLD   = E + '38;5;227m'   // Dourado pálido  — Primary
    const AMBER  = E + '38;5;214m'   // Âmbar/oxidado   — Accent
    const PURPLE = E + '38;5;91m'    // Roxo escuro     — Deep
    const WHITE  = E + '97m'         // Branco          — Highlight
    const DIM    = E + '38;5;245m'   // Cinza médio     — Dim
    const GRAY   = E + '38;5;240m'   // Cinza escuro    — Shadow
    const CORRUPT= E + '38;5;171m'   // Roxo claro      — Corruption

    console.log('')
    console.log(GRAY   + '       ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·' + RESET)
    console.log('')
    console.log(AMBER  + '                    ❂                          ✦' + RESET)
    console.log('')
    // ── P R O M I N E N C E ─────────────────────────────────────
    console.log(GOLD   + BOLD + '  ██████╗  ██████╗   ██████╗  ███╗   ███╗ ██╗ ███╗  ██╗' + RESET)
    console.log(GOLD   + BOLD + '  ██╔══██╗ ██╔══██╗ ██╔═══██╗ ████╗ ████║ ██║ ████╗ ██║' + RESET)
    console.log(AMBER  + BOLD + '  ██████╔╝ ██████╔╝ ██║   ██║ ██╔████╔██║ ██║ ██╔██╗██║' + RESET)
    console.log(AMBER  + BOLD + '  ██╔═══╝  ██╔══██╗ ██║   ██║ ██║╚██╔╝██║ ██║ ██║╚████║' + RESET)
    console.log(GOLD   + BOLD + '  ██║      ██║  ██║ ╚██████╔╝ ██║ ╚═╝ ██║ ██║ ██║ ╚███║' + RESET)
    console.log(GRAY   +        '  ╚═╝      ╚═╝  ╚═╝  ╚═════╝  ╚═╝     ╚═╝ ╚═╝ ╚═╝  ╚══╝' + RESET)
    console.log('')
    // ── H A S T U R I A N ───────────────────────────────────────
    console.log(PURPLE + BOLD + '  ██╗  ██╗ █████╗  ███████╗ ████████╗ ██╗   ██╗ ██████╗ ██╗  █████╗  ███╗  ██╗' + RESET)
    console.log(PURPLE + BOLD + '  ██║  ██║ ██╔══██╗ ██╔════╝ ╚══██╔══╝ ██║   ██║ ██╔══██╗██║ ██╔══██╗ ████╗ ██║' + RESET)
    console.log(CORRUPT+ BOLD + '  ███████║ ███████║ ███████╗    ██║    ██║   ██║ ██████╔╝██║ ███████║ ██╔██╗██║' + RESET)
    console.log(CORRUPT+ BOLD + '  ██╔══██║ ██╔══██║ ╚════██║    ██║    ██║   ██║ ██╔══██╗██║ ██╔══██║ ██║╚████║' + RESET)
    console.log(PURPLE + BOLD + '  ██║  ██║ ██║  ██║ ███████║    ██║    ╚██████╔╝ ██║  ██║██║ ██║  ██║ ██║ ╚███║' + RESET)
    console.log(GRAY   +        '  ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚══════╝    ╚═╝     ╚═════╝  ╚═╝  ╚═╝╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚══╝' + RESET)
    console.log('')
    // ── E R A ───────────────────────────────────────────────────
    console.log(AMBER  + BOLD + '                    ███████╗ ██████╗   █████╗ ' + RESET)
    console.log(AMBER  + BOLD + '                    ██╔════╝ ██╔══██╗ ██╔══██╗' + RESET)
    console.log(GOLD   + BOLD + '                    █████╗   ██████╔╝ ███████║' + RESET)
    console.log(GOLD   + BOLD + '                    ██╔══╝   ██╔══██╗ ██╔══██║' + RESET)
    console.log(AMBER  + BOLD + '                    ███████╗ ██║  ██║ ██║  ██║' + RESET)
    console.log(GRAY   +        '                    ╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝' + RESET)
    console.log('')
    console.log(DIM + ITALIC + '              ✦  Prominence™ II: Hasturian Era  ✦' + RESET)
    console.log('')
    console.log(AMBER  + '                    ❂                          ✦' + RESET)
    console.log('')
    console.log(GRAY   + '       ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·' + RESET)
    console.log('')
    console.log(AMBER + '                    ' + WHITE + BOLD + 'SERVER READY' + RESET + AMBER + '  ◈  ' + DIM + ITALIC + 'the era begins, traveler.' + RESET)
    console.log('')

    }) // fim do scheduleInTicks
})