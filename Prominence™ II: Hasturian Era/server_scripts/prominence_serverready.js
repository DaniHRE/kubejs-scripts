// ═══════════════════════════════════════════════════════════════
//   PROMINENCE™ II: HASTURIAN ERA
//   Arte de boot no console — KubeJS (1.20.x+)
//   Arquivo: kubejs/server_scripts/prominence_serverready.js
// ═══════════════════════════════════════════════════════════════
ServerEvents.loaded(event => {
    const server = event.server
    server.scheduleInTicks(300, () => {

    const c      = '\u00A7'
    const RESET  = c + 'r'
    const GOLD   = c + 'e'   // Dourado pálido  — Primary
    const AMBER  = c + '6'   // Âmbar/oxidado   — Accent
    const PURPLE = c + '5'   // Roxo escuro     — Deep
    const WHITE  = c + 'f'   // Branco sujo     — Highlight
    const DIM    = c + '7'   // Cinza médio     — Dim
    const GRAY   = c + '8'   // Cinza escuro    — Shadow
    const CORRUPT= c + 'd'   // Roxo claro      — Corruption
    const BOLD   = c + 'l'
    const ITALIC = c + 'o'

    console.log('')
    console.log(GRAY   + '       ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·')
    console.log('')
    console.log(AMBER  + '                    ❂                          ✦'                 )
    console.log('')
    // ── P R O M I N E N C E ─────────────────────────────────────
    console.log(GOLD   + BOLD + '  ██████╗  ██████╗   ██████╗  ███╗   ███╗ ██╗ ███╗  ██╗' + RESET)
    console.log(GOLD   + BOLD + '  ██╔══██╗ ██╔══██╗ ██╔═══██╗ ████╗ ████║ ██║ ████╗ ██║' + RESET)
    console.log(AMBER  + BOLD + '  ██████╔╝ ██████╔╝ ██║   ██║ ██╔████╔██║ ██║ ██╔██╗██║' + RESET)
    console.log(AMBER  + BOLD + '  ██╔═══╝  ██╔══██╗ ██║   ██║ ██║╚██╔╝██║ ██║ ██║╚████║' + RESET)
    console.log(GOLD   + BOLD + '  ██║      ██║  ██║ ╚██████╔╝ ██║ ╚═╝ ██║ ██║ ██║ ╚███║' + RESET)
    console.log(GRAY   +        '  ╚═╝      ╚═╝  ╚═╝  ╚═════╝  ╚═╝     ╚═╝ ╚═╝ ╚═╝  ╚══╝' + RESET)
    console.log('')
    // ── H A S T U R I A N   E R A ───────────────────────────────
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
    console.log(DIM    + ITALIC + '              ✦  Prominence™ II: Hasturian Era  ✦' + RESET)
    console.log('')
    console.log(AMBER  + '                    ❂                          ✦'  )
    console.log('')
    console.log(GRAY   + '       ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·')
    console.log('')
    console.log(AMBER  + '                    ' + WHITE + BOLD + 'SERVER READY' + RESET + AMBER + '  ◈  ' + DIM + ITALIC + 'the era begins, traveler.')
    console.log('')

    }) // fim do scheduleInTicks
})