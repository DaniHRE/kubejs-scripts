// ============================================================
// server_start.js
// KubeJS 7.2 - NeoForge 1.21.1
// Craftoria
//
// /serverstart
// ============================================================

let SERVER_STARTING = false
let START_TICK = 0

const COUNTDOWN_SECS = 5
const TICKS_PER_SEC = 20

const WELCOMED = {}

function applyStartKit(player, server) {
    console.info(`[SERVERSTART] applyStartKit called for ${player.username}`)

    try {
        server.runCommandSilent(`give ${player.username} minecraft:bread 8`)
    } catch(e) { console.error(`[SERVERSTART] give FAILED: ${e}`) }

    try {
        server.runCommandSilent(`effect give ${player.username} minecraft:speed 20 1 true`)
    } catch(e) { console.error(`[SERVERSTART] effect speed FAILED: ${e}`) }

    try {
        server.runCommandSilent(`effect give ${player.username} minecraft:jump_boost 20 9 true`)
    } catch(e) { console.error(`[SERVERSTART] effect jump FAILED: ${e}`) }

    try {
        server.runCommandSilent(`effect give ${player.username} minecraft:resistance 20 4 true`)
    } catch(e) { console.error(`[SERVERSTART] effect resistance FAILED: ${e}`) }

    // Partículas ao redor do player
    try {
        server.runCommandSilent(`execute at ${player.username} run particle minecraft:totem_of_undying ~ ~1 ~ 0.5 1 0.5 0.1 80 force`)
        server.runCommandSilent(`execute at ${player.username} run particle minecraft:firework ~ ~0.5 ~ 0.3 0.8 0.3 0.2 60 force`)
        server.runCommandSilent(`execute at ${player.username} run particle minecraft:end_rod ~ ~1 ~ 0.6 1.2 0.6 0.05 40 force`)
    } catch(e) { console.error(`[SERVERSTART] particles FAILED: ${e}`) }

    // Foguetes na direção que o player tá olhando
    try {
        // pega rotação horizontal (yaw) e converte pra vetor de direção
        var yaw = player.yaw * (Math.PI / 180)
        var pitch = player.pitch * (Math.PI / 180)

        var dx = -Math.sin(yaw) * Math.cos(pitch)
        var dy = -Math.sin(pitch)
        var dz = Math.cos(yaw) * Math.cos(pitch)

        // normaliza pra velocidade fixa
        var speed = 2.5
        var vx = Math.round(dx * speed * 100) / 100
        var vy = Math.round(dy * speed * 100) / 100
        var vz = Math.round(dz * speed * 100) / 100

        // posição levemente à frente do player pra não spawnar dentro dele
        var px = player.x + dx * 1.5
        var py = player.y + 1.2 + dy * 1.5
        var pz = player.z + dz * 1.5

        // spawna 5 foguetes em leque levemente espalhado
        for (var i = 0; i < 5; i++) {
            var spread = 0.15
            var ox = (Math.random() - 0.5) * spread
            var oz = (Math.random() - 0.5) * spread

            server.runCommandSilent(
                `summon minecraft:firework_rocket ${px} ${py} ${pz} {LifeTime:10,FireworksItem:{id:"minecraft:firework_rocket",Count:1,tag:{Fireworks:{Flight:1,Explosions:[{Type:1,Colors:[I;16711680,16776960,255],FadeColors:[I;16777215],Trail:1,Flicker:1}]}}}}`
            )

            // aplica velocidade via data depois de spawnar não é possível direto no summon de forma confiável,
            // então spawna múltiplos em posições ligeiramente diferentes pra simular leque
            var fx = px + ox * (i + 1)
            var fz = pz + oz * (i + 1)
            var fy = py + (vy * 0.1 * i)

            server.runCommandSilent(
                `summon minecraft:firework_rocket ${fx} ${fy} ${fz} {LifeTime:${8 + i * 2},FireworksItem:{id:"minecraft:firework_rocket",Count:1,tag:{Fireworks:{Flight:1,Explosions:[{Type:1,Colors:[I;16711680,16776960,255],FadeColors:[I;16777215],Trail:1,Flicker:1}]}}}}`
            )
        }

        console.info(`[SERVERSTART] rockets OK | yaw=${player.yaw.toFixed(1)} pitch=${player.pitch.toFixed(1)} dir=(${dx.toFixed(2)},${dy.toFixed(2)},${dz.toFixed(2)})`)
    } catch(e) { console.error(`[SERVERSTART] rockets FAILED: ${e}`) }

    try {
        player.tell(Text.of("§aKit aplicado! §7🎆"))
    } catch(e) {}
}

function startSequence(source) {

    const server = source.server

    if (SERVER_STARTING) {
        source.sendFailure(Text.of("§cJá existe uma inicialização em andamento."))
        return
    }

    SERVER_STARTING = true
    START_TICK = server.tickCount || 0

    Object.keys(WELCOMED).forEach(function(k) { delete WELCOMED[k] })

    const players = server.players

    console.info(`[SERVERSTART] Started with ${players.length} players`)

    for (let p of players) {
        var puuid = p.uuid.toString()  // var, nome diferente pra evitar conflito
        console.info(`[SERVERSTART] Adding to WELCOMED: ${p.username} | uuid=${puuid}`)
        WELCOMED[puuid] = true

        p.tell(Text.of("§8§m--------------------------------------"))
        p.tell(Text.of("§6§l🚀 SERVIDOR INICIADO 🚀"))
        p.tell(Text.of("§8§m--------------------------------------"))
    }
}

ServerEvents.commandRegistry(event => {

    const Commands = event.commands

    event.register(
        Commands.literal("serverstart")
            .requires(src => src.hasPermission(2))
            .executes(ctx => {
                startSequence(ctx.source)
                return 1
            })
    )
})

ServerEvents.tick(event => {

    if (!SERVER_STARTING) return

    const server = event.server
    const currentTick = server.tickCount || 0
    const elapsed = currentTick - START_TICK
    const totalTicks = COUNTDOWN_SECS * TICKS_PER_SEC

    let secsLeft = Math.ceil((totalTicks - elapsed) / TICKS_PER_SEC)
    if (secsLeft < 0) secsLeft = 0

    let progress = (totalTicks - elapsed) / totalTicks
    if (progress < 0) progress = 0

    const players = server.players

    for (let p of players) {
        var tuuid = p.uuid.toString()
        if (!WELCOMED[tuuid]) continue

        try {
            p.experienceLevel = secsLeft
            p.experienceProgress = progress
        } catch (err) {}
    }

    if (elapsed % TICKS_PER_SEC === 0 && secsLeft > 0) {
        for (let p of players) {
            var cuuid = p.uuid.toString()
            if (!WELCOMED[cuuid]) continue
            p.tell(Text.of(`§e§l⌛ ${secsLeft}...`))
        }
    }

    if (elapsed < totalTicks) return

    SERVER_STARTING = false

    console.info("[SERVERSTART] Countdown finished")
    console.info(`[SERVERSTART] Players online: ${players.length}`)
    console.info(`[SERVERSTART] WELCOMED keys: ${Object.keys(WELCOMED).length}`)

    for (let p of players) {
        var fuuid = p.uuid.toString()
        console.info(`[SERVERSTART] Checking ${p.username} | uuid=${fuuid} | inWelcomed=${!!WELCOMED[fuuid]}`)

        if (!WELCOMED[fuuid]) continue

        applyStartKit(p, server)

        p.tell(Text.of("§8§m--------------------------------------"))
        p.tell(Text.of("§7Bom jogo a todos!"))
        p.tell(Text.of("§8§m--------------------------------------"))
    }

    server.runCommandSilent('title @a title {"text":"✦ BEM-VINDOS! ✦","color":"gold","bold":true}')
    server.runCommandSilent('title @a subtitle {"text":"Servidor iniciado com sucesso!","color":"green"}')
    server.runCommandSilent('playsound minecraft:entity.firework_rocket.large_blast master @a ~ ~ ~ 1 1')
    server.runCommandSilent('playsound minecraft:ui.toast.challenge_complete master @a ~ ~ ~ 1 1')
})

PlayerEvents.loggedIn(event => {

    if (!SERVER_STARTING) return

    const player = event.player
    var luuid = player.uuid.toString()

    if (WELCOMED[luuid]) return

    WELCOMED[luuid] = true

    console.info(`[SERVERSTART] Late join: ${player.username} | uuid=${luuid}`)

    player.tell(Text.of("§6§l✦ §eVocê entrou durante a inicialização!"))
    player.tell(Text.of("§7Aguarde o kit..."))
})