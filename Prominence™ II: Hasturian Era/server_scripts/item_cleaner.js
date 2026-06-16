// ============================================================
//  item_cleaner.js  ·  KubeJS 6 · Fabric 1.20.1
//  Limpeza automática de itens dropados no chão
//  Versão 1.0.0
// ============================================================

// ── CONFIGURAÇÃO ─────────────────────────────────────────────

const INTERVALO_MINUTOS = 15        // A cada quantos minutos limpar
const AVISOS_ANTES = [3, 1]         // Avisar X minutos antes (em ordem decrescente)

// Itens que NUNCA serão removidos (whitelist)
// Use IDs completos: 'minecraft:diamond', 'kubejs:meu_item', etc.
const WHITELIST = [
  // 'minecraft:diamond',
  // 'minecraft:netherite_ingot',
]

// true = remove APENAS os itens da lista abaixo (modo whitelist inverso)
// false = remove TODOS os itens EXCETO os da WHITELIST acima
const MODO_BLACKLIST = false

// Itens que serão removidos SOMENTE (usado se MODO_BLACKLIST = true)
const BLACKLIST = [
  // 'minecraft:dirt',
  // 'minecraft:cobblestone',
  // 'minecraft:gravel',
]

// ── MENSAGENS ─────────────────────────────────────────────────

const COR_AVISO   = 'yellow'
const COR_LIMPEZA = 'red'
const COR_INFO    = 'aqua'

function msgAviso(minutosRestantes) {
  return Text.of('[')
    .append(Text.of('Limpeza').gold().bold())
    .append(Text.of('] '))
    .append(Text.of(`Itens dropados serão removidos em `).color(COR_AVISO))
    .append(Text.of(`${minutosRestantes} minuto${minutosRestantes > 1 ? 's' : ''}`).white().bold())
    .append(Text.of('!').color(COR_AVISO))
}

function msgLimpeza(quantidade) {
  return Text.of('[')
    .append(Text.of('Limpeza').gold().bold())
    .append(Text.of('] '))
    .append(Text.of(`${quantidade} item${quantidade !== 1 ? 's' : ''} removido${quantidade !== 1 ? 's' : ''} do chão.`).color(COR_LIMPEZA))
}

function msgNada() {
  return Text.of('[')
    .append(Text.of('Limpeza').gold().bold())
    .append(Text.of('] '))
    .append(Text.of('Nenhum item encontrado para remover.').color(COR_INFO))
}

// ── LÓGICA PRINCIPAL ──────────────────────────────────────────

ServerEvents.loaded(event => {
  const server = event.server

  const INTERVALO_TICKS  = INTERVALO_MINUTOS * 60 * 20
  const AVISOS_TICKS = AVISOS_ANTES.map(m => m * 60 * 20)

  // Agenda avisos e a limpeza em sequência
  function agendarCiclo() {

    // Agenda cada aviso
    AVISOS_ANTES.forEach(minutosAviso => {
      const delayAviso = INTERVALO_TICKS - (minutosAviso * 60 * 20)
      if (delayAviso < 0) return // ignora se o intervalo total for menor que o aviso

      server.scheduleInTicks(delayAviso, server, cb => {
        cb.server.tell(msgAviso(minutosAviso))
      })
    })

    // Agenda a limpeza em si
    server.scheduleInTicks(INTERVALO_TICKS, server, cb => {
      const s = cb.server
      let removidos = 0

      // Coleta entidades ItemEntity em todas as dimensões
      s.levels.forEach(level => {
        level.getEntitiesOfClass(
          Java.loadClass('net.minecraft.world.entity.item.ItemEntity')
        ).forEach(itemEntity => {
          const itemId = itemEntity.item.id

          let deveRemover = false

          if (MODO_BLACKLIST) {
            // Remove APENAS os itens da BLACKLIST
            deveRemover = BLACKLIST.includes(itemId)
          } else {
            // Remove TUDO exceto a WHITELIST
            deveRemover = !WHITELIST.includes(itemId)
          }

          if (deveRemover) {
            itemEntity.discard()
            removidos++
          }
        })
      })

      // Anuncia resultado
      if (removidos > 0) {
        s.tell(msgLimpeza(removidos))
      } else {
        s.tell(msgNada())
      }

      // Reinicia o ciclo
      agendarCiclo()
    })
  }

  // Dispara o primeiro ciclo ao iniciar o servidor
  agendarCiclo()

  // Log de confirmação no console
  console.info(`[ItemCleaner] Ativo — limpeza a cada ${INTERVALO_MINUTOS} min | Avisos em: ${AVISOS_ANTES.join(', ')} min antes`)
})