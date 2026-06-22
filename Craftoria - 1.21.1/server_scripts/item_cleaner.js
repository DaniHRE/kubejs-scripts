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

// ── PALETA ───────────────────────────────────────────────────
//   Âmbar / marca     0xE8A44A   (nome do servidor, label comando)
//   Verde-ciano       0x5ECFB1   (símbolo ◈, mensagens neutras/info)
//   Branco            0xF5F5F5   (destaques — contagem, tempo)
//   Cinza separador   0x666666   (│, detalhes secundários)
//   Cinza texto       0xC8D0D8   (corpo das mensagens)
//   Laranja urgência  0xF5A623   (aviso 1 min)
//   Vermelho          0xFF6B6B   (contagem removida, countdown)
//   Vermelho crítico  0xFF4444   (countdown ≤ 3s)

// ── COMPONENTES DE TEXTO ─────────────────────────────────────

function prefixo() {
  return Text.of('◈ ').color(0x5ECFB1)
    .append(Text.of('Craftoria').color(0x00FF7F).bold())
    .append(Text.of(' │ ').color(0x666666))
}

// ── MENSAGENS ─────────────────────────────────────────────────

function msgAvisoMinutos(min) {
  var urgente = min <= 1
  if (urgente) {
    return prefixo()
      .append(Text.of('Limpeza em ').color(0xF5A623).bold())
      .append(Text.of(min + ' minuto!').color(0xFFFFFF).bold())
  }
  return prefixo()
    .append(Text.of('Limpeza em ').color(0xC8D0D8))
    .append(Text.of(min + ' minutos').color(0xF5F5F5).bold())
    .append(Text.of('. Guarde seus itens.').color(0xC8D0D8))
}

function msgAvisoSegundos(seg) {
  var critico = seg <= 3
  var cor = critico ? 0xFF4444 : 0xFF6B6B
  return prefixo()
    .append(Text.of('Removendo em ').color(cor).bold())
    .append(Text.of(seg + 's').color(0xFFFFFF).bold())
    .append(Text.of('...').color(0x888888))
}

function msgLimpeza(qtd) {
  var plural = qtd !== 1
  return prefixo()
    .append(Text.of('Limpeza concluída: ').color(0xC8D0D8))
    .append(Text.of(qtd + (plural ? ' itens' : ' item')).color(0xFF6B6B).bold())
    .append(Text.of(plural ? ' removidos' : ' removido').color(0xC8D0D8))
}

function msgNada() {
  return prefixo()
    .append(Text.of('Nenhum item no chão no momento.').color(0x5ECFB1))
}

function msgComando(qtd) {
  var plural = qtd !== 1
  return prefixo()
    .append(Text.of(qtd + (plural ? ' itens' : ' item') + (plural ? ' removidos' : ' removido')).color(0xF5F5F5))
}

function msgComandoNada() {
  return prefixo()
    .append(Text.of('Nenhum item no chão no momento.').color(0x5ECFB1))
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
  var tempoStr = min > 0 ? min + 'min ' + seg + 's' : seg + 's'

  return prefixo()
    .append(Text.of('Próxima limpeza em ').color(0xC8D0D8))
    .append(Text.of(tempoStr).color(0x5ECFB1).bold())
    .append(Text.of('  ·  ').color(0x444444))
    .append(Text.of('Intervalo: ').color(0x666666))
    .append(Text.of(INTERVALO_MINUTOS + 'min').color(0xE8A44A))
}

// ── LIMPEZA ───────────────────────────────────────────────────

function nomeDimensao(level) {
  try {
    var key = level.dimension.location()
    var path = key.getPath()
    var partes = path.split('/')
    var nome = partes[partes.length - 1]
    return nome.charAt(0).toUpperCase() + nome.slice(1).replace(/_/g, ' ')
  } catch (e) {
    return 'Desconhecida'
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
          ? msgLimpeza(resultado.qtd)
          : msgNada()
      )
      agendarCiclo()
    })
  }

  agendarCiclo()

  console.info('[Craftoria] ItemCleaner ativo — ' +
    INTERVALO_MINUTOS + 'min · Countdown: ' +
    COUNTDOWN_SEGUNDOS + 's · Avisos: ' +
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
                ? msgComando(resultado.qtd)
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