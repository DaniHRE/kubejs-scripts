// ============================================================
//  hints_actionbar.js  —  Craftoria / NeoForge 1.21.1
//  Exibe hints acima da hotbar (action bar) dos jogadores.
//  Roda até a próxima reinicialização do servidor.
// ============================================================

var HINTS = [
    "§b✦ Dica: §fInstale o mod §e'discord-chat' §fpara uma experiência melhor!",
    "§b✦ Dica: §fUse §e/help §fpara abrir o guia do servidor.",
];

// 5 minutos de silêncio entre cada hint
var INTERVAL_TICKS = 18000; // 5min = 300s = 6000 ticks

// Quanto tempo a hint fica visível (10 segundos)
var DISPLAY_TICKS = 200; // 10s = 200 ticks

// Reenvia a cada 2s enquanto a hint está visível (action bar some após ~3s sem update)
var REFRESH_TICKS = 40;

var hintIndex     = 0;
var ticker        = 0;   // contador geral
var displayTicker = 0;   // conta quanto tempo a hint atual ficou na tela
var showing       = false;

ServerEvents.tick(function (event) {
    var server  = event.server;
    var players = server.players;

    if (players.size() === 0) {
        return;
    }

    ticker++;

    // --- Modo exibindo hint ---
    if (showing) {
        displayTicker++;

        // Reenvia a cada 2s para manter visível
        if (displayTicker % REFRESH_TICKS === 0) {
            var component = Text.of(HINTS[hintIndex]);
            players.forEach(function (player) {
                player.displayClientMessage(component, true);
            });
        }

        // Acabou o tempo de exibição?
        if (displayTicker >= DISPLAY_TICKS) {
            showing      = false;
            displayTicker = 0;
            ticker        = 0; // reseta o intervalo de espera
            hintIndex     = (hintIndex + 1) % HINTS.length;
        }

        return;
    }

    // --- Modo aguardando (5 minutos) ---
    if (ticker >= INTERVAL_TICKS) {
        ticker        = 0;
        displayTicker = 0;
        showing       = true;

        // Exibe imediatamente ao começar
        var component = Text.of(HINTS[hintIndex]);
        players.forEach(function (player) {
            player.displayClientMessage(component, true);
        });
    }
});