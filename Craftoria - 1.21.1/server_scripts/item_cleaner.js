// ═══════════════════════════════════════════════════════════════
//   CRAFTORIA
//   Limpeza Automática de Itens — KubeJS 7 · NeoForge 1.21.1
//   Arquivo: kubejs/server_scripts/craftoria_item_cleaner.js
// ═══════════════════════════════════════════════════════════════
//
//   COMANDOS:
//     /craftoria cleaner          → limpeza manual imediata
//     /craftoria cleaner status   → mostra tempo até próxima limpeza
//
//   PERMISSÕES:
//     PERMISSAO_COMANDO = 0  → todos os jogadores
//     PERMISSAO_COMANDO = 2  → apenas operadores
//
// ═══════════════════════════════════════════════════════════════

;(function () {

// ── CONFIGURAÇÃO ─────────────────────────────────────────────

var INTERVALO_MINUTOS  = 30         // A cada quantos minutos limpar
var AVISOS_MINUTOS     = [5, 3, 1]  // Avisos em minutos antes (ordem decrescente)
var COUNTDOWN_SEGUNDOS = 10         // Countdown de segundos antes da limpeza

// Itens que NUNCA serão removidos
var WHITELIST = [
  // 'minecraft:diamond',
  // 'minecraft:netherite_ingot',
]

// true  = remove APENAS os itens da BLACKLIST abaixo
// false = remove TUDO exceto a WHITELIST acima
var MODO_BLACKLIST = false

var BLACKLIST = [
  // 'minecraft:dirt',
  // 'minecraft:cobblestone',
]

// Permissão para /craftoria cleaner (0 = todos, 2 = op)
var PERMISSAO_COMANDO = 0

// ── ESTADO GLOBAL ────────────────────────────────────────────

var tickInicioUltimoCiclo = -1
var INTERVALO_TICKS_GLOBAL = 0

// ── PALETA DE CORES (Craftoria) ───────────────────────────────
//   Cobre/laranja  0xE07830   §6
//   Bege dourado   0xF0C070   §e
//   Ciano élfico   0x2AFFDD   §b
//   Cinza pedra    0x8899AA   §7
//   Vermelho       0xFF4455   §c
//   Branco         0xFFFFFF   §f

// ── MENSAGENS ─────────────────────────────────────────────────

function prefixo() {
  return Text.of(' ⚙ ').color(0x2AFFDD)
    .append(Text.of('Craftoria').color(0xE07830).bold())
    .append(Text.of(' › ').color(0x8899AA))
}

function msgAvisoMinutos(min) {
  var urgente = min <= 1
  return prefixo()
    .append(Text.of('Limpeza de itens do chão em ').color(urgente ? 0xFFAA00 : 0xF0C070))
    .append(Text.of(min + ' minuto' + (min > 1 ? 's' : '')).color(0xFFFFFF).bold())
    .append(Text.of('! ').color(urgente ? 0xFFAA00 : 0xF0C070))
    .append(Text.of('Guarde seus itens.').color(0x8899AA).italic())
}

function msgAvisoSegundos(seg) {
  var cor = seg <= 3 ? 0xFF4455 : 0xFFAA00
  return prefixo()
    .append(Text.of('Removendo itens em ').color(cor))
    .append(Text.of(seg + 's').color(0xFFFFFF).bold())
    .append(Text.of('...').color(cor))
}

function msgLimpeza(qtd, dimensoes) {
  var txt = prefixo()
    .append(Text.of('Limpeza concluída: ').color(0xF0C070))
    .append(Text.of(qtd + ' item' + (qtd !== 1 ? 's' : '')).color(0xFF4455).bold())
    .append(Text.of(' removido' + (qtd !== 1 ? 's' : '') + ' ').color(0xF0C070))

  if (dimensoes && dimensoes.length > 0) {
    txt = txt.append(Text.of('(' + dimensoes.join(', ') + ')').color(0x8899AA).italic())
  }

  return txt
}

function msgNada() {
  return prefixo()
    .append(Text.of('Nenhum item encontrado no chão.').color(0x2AFFDD))
}

function msgComando(qtd, dimensoes) {
  var txt = prefixo()
    .append(Text.of('Limpeza manual: ').color(0xE07830))
    .append(Text.of(qtd + ' item' + (qtd !== 1 ? 'ns' : '') + ' removido' + (qtd !== 1 ? 's' : '') + ' ').color(0xFFFFFF))

  if (dimensoes && dimensoes.length > 0) {
    txt = txt.append(Text.of('(' + dimensoes.join(', ') + ')').color(0x8899AA).italic())
  }

  return txt
}

function msgComandoNada() {
  return prefixo()
    .append(Text.of('Não há itens no chão no momento.').color(0x2AFFDD))
}

function msgStatus(server) {
  var ticksRestantes = 0
  if (tickInicioUltimoCiclo >= 0) {
    var elapsed = server.tickCount - tickInicioUltimoCiclo
    ticksRestantes = Math.max(0, INTERVALO_TICKS_GLOBAL - elapsed)
  }
  var totalSeg = Math.floor(ticksRestantes / 20)
  var min = Math.floor(totalSeg / 60)
  var seg = totalSeg % 60
  var tempoStr = min > 0
    ? min + 'min ' + seg + 's'
    : seg + 's'

  return prefixo()
    .append(Text.of('Próxima limpeza em ').color(0xF0C070))
    .append(Text.of(tempoStr).color(0x2AFFDD).bold())
    .append(Text.of(' · Intervalo: ').color(0x8899AA))
    .append(Text.of(INTERVALO_MINUTOS + 'min').color(0xE07830))
}

// ── LIMPEZA ───────────────────────────────────────────────────

function nomeDimensao(level) {
  try {
    var key = level.dimension.location()
    var path = key.getPath()
    // Formata: minecraft:overworld → Overworld
    var partes = path.split('/')
    var nome = partes[partes.length - 1]
    return nome.charAt(0).toUpperCase() + nome.slice(1).replace(/_/g, ' ')
  } catch (e) {
    return 'Dimensão desconhecida'
  }
}

var ItemEntityClass = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')

function executarLimpeza(server) {
  var removidos = 0
  var dimensoesAfetadas = []

  var levelIter = server.getAllLevels().iterator()
  while (levelIter.hasNext()) {
    var level = levelIter.next()
    var removidosNivel = 0
    var snapshot = []

    var entIter = level.getAllEntities().iterator()
    while (entIter.hasNext()) {
      var ent = entIter.next()
      if (ent instanceof ItemEntityClass) {
        snapshot.push(ent)
      }
    }

    for (var j = 0; j < snapshot.length; j++) {
      var ent = snapshot[j]
      var id = ent.getItem().getItem().builtInRegistryHolder().key().location().toString()
      var deveRemover = MODO_BLACKLIST
        ? BLACKLIST.indexOf(id) !== -1
        : WHITELIST.indexOf(id) === -1

      if (deveRemover) {
        ent.discard()
        removidos++
        removidosNivel++
      }
    }

    if (removidosNivel > 0) {
      dimensoesAfetadas.push(nomeDimensao(level))
    }
  }

  return { qtd: removidos, dimensoes: dimensoesAfetadas }
}

// ── LÓGICA DO CICLO ──────────────────────────────────────────

ServerEvents.loaded(function (event) {
  var server = event.server
  var INTERVALO_TICKS = INTERVALO_MINUTOS * 60 * 20

  function agendarCiclo() {
    tickInicioUltimoCiclo = server.tickCount
    INTERVALO_TICKS_GLOBAL = INTERVALO_TICKS

    // Avisos em minutos
    AVISOS_MINUTOS.forEach(function (min) {
      var delay = INTERVALO_TICKS - (min * 60 * 20)
      if (delay < 0) return
      server.scheduleInTicks(delay, function () {
        server.tell(msgAvisoMinutos(min))
      })
    })

    // Countdown em segundos
    for (var seg = COUNTDOWN_SEGUNDOS; seg >= 1; seg--) {
      // Evita sobrepor com avisos de minutos inteiros
      if (seg % 60 === 0 && AVISOS_MINUTOS.indexOf(seg / 60) !== -1) continue
      ;(function (s) {
        server.scheduleInTicks(INTERVALO_TICKS - (s * 20), function () {
          server.tell(msgAvisoSegundos(s))
        })
      })(seg)
    }

    // Limpeza
    server.scheduleInTicks(INTERVALO_TICKS, function () {
      var resultado = executarLimpeza(server)
      server.tell(
        resultado.qtd > 0
          ? msgLimpeza(resultado.qtd, resultado.dimensoes)
          : msgNada()
      )
      agendarCiclo()
    })
  }

  agendarCiclo()

  console.info('[Craftoria] ItemCleaner ativo — ' +
    INTERVALO_MINUTOS + 'min › Countdown: ' +
    COUNTDOWN_SEGUNDOS + 's › Avisos: ' +
    AVISOS_MINUTOS.join(', ') + ' min antes')
})

// ── REGISTRO DO COMANDO ───────────────────────────────────────

ServerEvents.commandRegistry(function (event) {
  var Commands = event.commands

  event.register(
    Commands.literal('craftoria')
      .then(
        Commands.literal('cleaner')
          .requires(function (src) { return src.hasPermission(PERMISSAO_COMANDO) })
          .executes(function (ctx) {
            var server = ctx.source.server
            var resultado = executarLimpeza(server)
            server.tell(
              resultado.qtd > 0
                ? msgComando(resultado.qtd, resultado.dimensoes)
                : msgComandoNada()
            )
            return 1
          })
          .then(
            Commands.literal('status')
              .executes(function (ctx) {
                var player = ctx.source.player
                if (player) {
                  player.tell(msgStatus(ctx.source.server))
                } else {
                  ctx.source.server.tell(msgStatus(ctx.source.server))
                }
                return 1
              })
          )
      )
  )
})

})()