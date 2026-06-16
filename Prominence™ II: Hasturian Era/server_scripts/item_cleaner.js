// ============================================================
//  item_cleaner.js  ·  KubeJS 6 · Fabric 1.20.1
//  Limpeza automática de itens dropados no chão
//  Versão 2.2.0
// ============================================================
;(function () {

// ── CONFIGURAÇÃO ─────────────────────────────────────────────

var INTERVALO_MINUTOS   = 30        // A cada quantos minutos limpar
var AVISOS_MINUTOS      = [5, 3, 1] // Avisos em minutos antes (ordem decrescente)
var COUNTDOWN_SEGUNDOS  = 10        // Countdown de segundos antes da limpeza

// Itens que NUNCA serão removidos
// Use IDs completos: 'minecraft:diamond', 'kubejs:meu_item', etc.
var WHITELIST = [
  // 'minecraft:diamond',
  // 'minecraft:netherite_ingot',
]

// true  = remove APENAS os itens da BLACKLIST abaixo
// false = remove TUDO exceto a WHITELIST acima
var MODO_BLACKLIST = false

// Itens removidos SOMENTE se MODO_BLACKLIST = true
var BLACKLIST = [
  // 'minecraft:dirt',
  // 'minecraft:cobblestone',
  // 'minecraft:gravel',
]

// Permissão para /limparitens  (0 = todos, 2 = op)
var PERMISSAO_COMANDO = 0

// ── MENSAGENS ─────────────────────────────────────────────────

function prefixo() {
  return Text.of('[').white()
    .append(Text.of('Limpeza').gold().bold())
    .append(Text.of('] ').white())
}

function msgAvisoMinutos(min) {
  return prefixo()
    .append(Text.of('Itens dropados serao removidos em ').yellow())
    .append(Text.of(min + ' minuto' + (min > 1 ? 's' : '')).white().bold())
    .append(Text.of('!').yellow())
}

function msgAvisoSegundos(seg) {
  var cor = seg <= 3 ? 'red' : 'yellow'
  return prefixo()
    .append(Text.of('Removendo itens em ').color(cor))
    .append(Text.of(seg + ' segundo' + (seg > 1 ? 's' : '')).white().bold())
    .append(Text.of('...').color(cor))
}

function msgLimpeza(qtd) {
  return prefixo()
    .append(Text.of(qtd + ' item' + (qtd !== 1 ? 's' : '') + ' ').red())
    .append(Text.of('removido' + (qtd !== 1 ? 's' : '') + ' do chao.').red())
}

function msgNada() {
  return prefixo()
    .append(Text.of('Nenhum item encontrado para remover.').aqua())
}

function msgComando(qtd) {
  return prefixo()
    .append(Text.of('Limpeza manual: ').green())
    .append(Text.of(qtd + ' item' + (qtd !== 1 ? 's' : '') + ' removido' + (qtd !== 1 ? 's' : '') + '.').white())
}

function msgComandoNada() {
  return prefixo()
    .append(Text.of('Nenhum item para remover no momento.').aqua())
}

// ── LIMPEZA ───────────────────────────────────────────────────

var ItemEntityClass = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')

function executarLimpeza(server) {
  var removidos = 0

  // getAllLevels() → Iterable<ServerLevel>
  var levelIter = server.getAllLevels().iterator()
  while (levelIter.hasNext()) {
    var level = levelIter.next()

    // Coleta snapshot antes de remover (evita ConcurrentModificationException)
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
      var id = ent.item.id
      var deveRemover = MODO_BLACKLIST
        ? BLACKLIST.indexOf(id) !== -1
        : WHITELIST.indexOf(id) === -1

      if (deveRemover) {
        ent.discard()
        removidos++
      }
    }
  }

  return removidos
}

// ── LÓGICA DO CICLO ──────────────────────────────────────────

ServerEvents.loaded(function (event) {
  var server = event.server
  var INTERVALO_TICKS = INTERVALO_MINUTOS * 60 * 20

  function agendarCiclo() {

    // Avisos em minutos
    AVISOS_MINUTOS.forEach(function (min) {
      var delay = INTERVALO_TICKS - (min * 60 * 20)
      if (delay < 0) return
      server.scheduleInTicks(delay, server, function (cb) {
        cb.server.tell(msgAvisoMinutos(min))
      })
    })

    // Countdown em segundos (evita sobrepor com avisos de minutos)
    for (var seg = COUNTDOWN_SEGUNDOS; seg >= 1; seg--) {
      if (seg % 60 === 0 && AVISOS_MINUTOS.indexOf(seg / 60) !== -1) continue
      ;(function (s) {
        server.scheduleInTicks(INTERVALO_TICKS - (s * 20), server, function (cb) {
          cb.server.tell(msgAvisoSegundos(s))
        })
      })(seg)
    }

    // Executa a limpeza
    server.scheduleInTicks(INTERVALO_TICKS, server, function (cb) {
      var s = cb.server
      var qtd = executarLimpeza(s)
      s.tell(qtd > 0 ? msgLimpeza(qtd) : msgNada())
      agendarCiclo()
    })
  }

  agendarCiclo()
  console.info('[ItemCleaner] Ativo — ' + INTERVALO_MINUTOS + 'min | Countdown: ' + COUNTDOWN_SEGUNDOS + 's | Avisos: ' + AVISOS_MINUTOS.join(', ') + ' min antes')
})

// ── COMANDO /limparitens ──────────────────────────────────────

ServerEvents.commandRegistry(function (event) {
  var Commands = event.commands

  event.register(
    Commands.literal('limparitens')
      .requires(function (src) { return src.hasPermission(PERMISSAO_COMANDO) })
      .executes(function (ctx) {
        var server = ctx.source.server
        var qtd = executarLimpeza(server)
        server.tell(qtd > 0 ? msgComando(qtd) : msgComandoNada())
        return 1
      })
  )
})

})()