// ═══════════════════════════════════════════════════════════════
//   NIGHTFALL CRAFT: THE CASKET OF REVERIES
//   Arte de boot no console — KubeJS (1.20.x+)
//   Arquivo: kubejs/server_scripts/nightfall_serverready.js
// ═══════════════════════════════════════════════════════════════

ServerEvents.loaded(event => {
    const server = event.server
    server.scheduleInTicks(300, () => {

    const c      = '\u00A7'
    const RESET  = c + 'r'
    const PURPLE = c + '5'
    const PINK   = c + 'd'
    const GRAY   = c + '8'
    const WHITE  = c + 'f'
    const DIM    = c + '7'
    const BOLD   = c + 'l'
    const ITALIC = c + 'o'

    console.log('')
    console.log(GRAY   + '       ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·')
    console.log('')
    console.log(PURPLE + '                    ☽                          ☾'                 )
    console.log('')

    // ── N I G H T ───────────────────────────────────────────────
    console.log(PURPLE + BOLD + '  ██╗  ██╗ ██╗  ██████╗  ██╗  ██╗ ████████╗' + RESET)
    console.log(PURPLE + BOLD + '  ███╗ ██║ ██║ ██╔════╝  ██║  ██║ ╚══██╔══╝' + RESET)
    console.log(PINK   + BOLD + '  ████╗██║ ██║ ██║  ███╗ ███████║    ██║   '  + RESET)
    console.log(PINK   + BOLD + '  ██╔████║ ██║ ██║   ██║ ██╔══██║    ██║   '  + RESET)
    console.log(PURPLE + BOLD + '  ██║╚███║ ██║ ╚██████╔╝ ██║  ██║    ██║   '  + RESET)
    console.log(GRAY   +        '  ╚═╝ ╚══╝ ╚═╝  ╚═════╝  ╚═╝  ╚═╝    ╚═╝  '  + RESET)

    console.log('')

    // ── F A L L ─────────────────────────────────────────────────
    console.log(PURPLE + BOLD + '  ███████╗  █████╗  ██╗      ██╗     ' + RESET)
    console.log(PURPLE + BOLD + '  ██╔════╝ ██╔══██╗ ██║      ██║     ' + RESET)
    console.log(PINK   + BOLD + '  █████╗   ███████║ ██║      ██║     ' + RESET)
    console.log(PINK   + BOLD + '  ██╔══╝   ██╔══██║ ██║      ██║     ' + RESET)
    console.log(PURPLE + BOLD + '  ██║      ██║  ██║ ███████╗ ███████╗' + RESET)
    console.log(GRAY   +        '  ╚═╝      ╚═╝  ╚═╝ ╚══════╝ ╚══════╝' + RESET)

    console.log('')
    console.log(DIM  + ITALIC + '              ✦  The Casket of Reveries  ✦' + RESET)
    console.log('')
    console.log(PURPLE + '                    ☽                          ☾'  )
    console.log('')
    console.log(GRAY   + '       ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·  ·  ·  ✦  ·  ·  ·')
    console.log('')
    console.log(PURPLE + '                    ' + WHITE + BOLD + 'SERVER READY' + RESET + PURPLE + '  ☾  ' + DIM + ITALIC + 'good luck, travelers.')
    console.log('')
    }) // fim do scheduleInTicks

})