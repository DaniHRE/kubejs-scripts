// ============================================================
//  alerts_broadcast.js  —  Craftoria / NeoForge 1.21.1
//  Envia alertas periódicos no chat para todos os jogadores.
//  Roda até a próxima reinicialização do servidor.
// ============================================================

var ALERTS = [
    "§6[Servidor] §eInstale o mod §b'discord-chat' §epara sincronizar o chat com o Discord! - Disponível no canal de Notas!",
    "§6[Servidor] §eNão se esqueça de verificar o canal de Notas para as últimas atualizações!"
];

// Intervalo entre alertas (em ticks). 1 segundo = 20 ticks.
// 6000 ticks = 5 minutos
var ALERT_INTERVAL_TICKS = 6000;

var alertIndex = 0;
var tickCounter  = 0;

ServerEvents.tick(function (event) {
    tickCounter++;

    if (tickCounter < ALERT_INTERVAL_TICKS) {
        return;
    }

    tickCounter = 0;

    var server  = event.server;
    var players = server.players;

    // Sem jogadores online? Não envia.
    if (players.size() === 0) {
        return;
    }

    var message = ALERTS[alertIndex % ALERTS.length];
    alertIndex++;

    // Envia para todos os jogadores conectados
    server.tell(message);
});