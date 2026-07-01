// ============================================================
//  event_announcer.js  —  Craftoria / NeoForge 1.21.1
//  Anuncia eventos agendados no chat com avisos antecipados.
//  Verifica a hora real do servidor a cada 20 ticks (1 segundo).
// ============================================================

// ------------------------------------------------------------
//  CONFIGURAÇÃO DE EVENTOS
//
//  "preWarnings" = avisos em datas/horas fixas ANTES do evento
//  "warnings"    = avisos em minutos antes (no dia do evento)
// ------------------------------------------------------------

var EVENTS = [
    {
        name:        "Cacada ao Ender Dragon",
        year:        2026,
        month:       6,
        day:         26,
        hour:        23,
        minute:      0,
        description: "Vamos cacar a Stronghold e tentar ir para o The End!",

        // Avisos do dia anterior em horários fixos (dia/hora/min)
        preWarnings: [
            // Dia 25
            { day: 25, hour: 18, minute: 0  },
            { day: 25, hour: 19, minute: 30 },
            { day: 25, hour: 21, minute: 0  },
            { day: 25, hour: 22, minute: 30 },

            // Dia 26
            { day: 26, hour: 0,  minute: 0  },
            { day: 26, hour: 1,  minute: 30 },
            { day: 26, hour: 3,  minute: 0  },
            { day: 26, hour: 4,  minute: 30 },
            { day: 26, hour: 6,  minute: 0  },
            { day: 26, hour: 7,  minute: 30 },
            { day: 26, hour: 9,  minute: 0  },
            { day: 26, hour: 10, minute: 30 },
            { day: 26, hour: 12, minute: 0  },
            { day: 26, hour: 13, minute: 30 },
            { day: 26, hour: 15, minute: 0  },
            { day: 26, hour: 16, minute: 30 },
            { day: 26, hour: 18, minute: 0  },
            { day: 26, hour: 19, minute: 30 },
            { day: 26, hour: 21, minute: 0  },
            { day: 26, hour: 22, minute: 0  }
        ],

        // Avisos em minutos antes, no dia do evento
        warnings: [60, 30, 10, 5]
    },

    // --- Adicione mais eventos abaixo ---
    // {
    //     name:        "Torneio de PvP",
    //     year:        2026,
    //     month:       7,
    //     day:         5,
    //     hour:        20,
    //     minute:      0,
    //     description: "Arena PvP 1v1. Premio: kit lendario!",
    //     preWarnings: [],
    //     warnings:    [60, 30, 10, 5]
    // },
];

// ------------------------------------------------------------
//  Prefixos e cores
// ------------------------------------------------------------
var PREFIX_WARNING = "§5§l[EVENTO] §r§e";
var PREFIX_NOW     = "§5§l[EVENTO] §r§b";
var SEPARATOR      = "§5§m----------------------------------------§r";

// ------------------------------------------------------------
//  Controle interno
// ------------------------------------------------------------
var firedWarnings    = {};
var firedPreWarnings = {};
var firedEvents      = {};

var CHECK_INTERVAL = 20; // 1 segundo
var tickCounter    = 0;

function getNow() {
    var d = new Date();
    return {
        year:   d.getFullYear(),
        month:  d.getMonth() + 1,
        day:    d.getDate(),
        hour:   d.getHours(),
        minute: d.getMinutes()
    };
}

function toMinutes(year, month, day, hour, minute) {
    return (year * 525960) + (month * 43830) + (day * 1440) + (hour * 60) + minute;
}

function padMin(m) {
    return m < 10 ? "0" + m : "" + m;
}

function announce(server, lines) {
    if (server.players.size() === 0) return;
    for (var i = 0; i < lines.length; i++) {
        server.tell(lines[i]);
    }
}

ServerEvents.tick(function (event) {
    tickCounter++;
    if (tickCounter < CHECK_INTERVAL) return;
    tickCounter = 0;

    var server  = event.server;
    var players = server.players;
    if (players.size() === 0) return;

    var now        = getNow();
    var nowMinutes = toMinutes(now.year, now.month, now.day, now.hour, now.minute);

    for (var i = 0; i < EVENTS.length; i++) {
        var ev        = EVENTS[i];
        var evMinutes = toMinutes(ev.year, ev.month, ev.day, ev.hour, ev.minute);
        var diff      = evMinutes - nowMinutes;

        // Evento já passou há mais de 5min — ignora
        if (diff < -5) continue;

        // --------------------------------------------------------
        //  Avisos do dia anterior (horários fixos)
        // --------------------------------------------------------
        var preWarnings = ev.preWarnings;
        for (var p = 0; p < preWarnings.length; p++) {
            var pw  = preWarnings[p];
            var key = "pre_" + i + "_" + pw.day + "_" + pw.hour + "_" + pw.minute;

            var match = (now.month  === ev.month &&
                         now.day    === pw.day   &&
                         now.hour   === pw.hour  &&
                         now.minute === pw.minute);

            if (match && !firedPreWarnings[key]) {
                firedPreWarnings[key] = true;

                // Calcula quanto tempo falta em horas/minutos
                var pwMinutes  = toMinutes(ev.year, ev.month, pw.day, pw.hour, pw.minute);
                var minuteLeft = evMinutes - pwMinutes;
                var horasLeft  = Math.floor(minuteLeft / 60);
                var minsLeft   = minuteLeft % 60;

                var tempoStr;
                if (minsLeft === 0) {
                    tempoStr = horasLeft + "h";
                } else {
                    tempoStr = horasLeft + "h" + padMin(minsLeft) + "min";
                }

                announce(server, [
                    SEPARATOR,
                    PREFIX_WARNING + "§lEvento amanhã em " + tempoStr + ": §r§e" + ev.name,
                    PREFIX_WARNING + ev.description,
                    PREFIX_WARNING + "Marque na agenda! Começa dia §f" + ev.day + "/" + ev.month + " às " + ev.hour + "h" + padMin(ev.minute) + "§e. §5✦",
                    SEPARATOR
                ]);
            }
        }

        // --------------------------------------------------------
        //  Avisos em minutos antes (no dia do evento)
        // --------------------------------------------------------
        var warnings = ev.warnings;
        for (var w = 0; w < warnings.length; w++) {
            var warnMin = warnings[w];
            var wkey    = "warn_" + i + "_" + warnMin;

            if (diff === warnMin && !firedWarnings[wkey]) {
                firedWarnings[wkey] = true;

                var tempoStr;
                if (warnMin >= 60 && warnMin % 60 === 0) {
                    var h = warnMin / 60;
                    tempoStr = h === 1 ? "1 hora" : h + " horas";
                } else {
                    tempoStr = warnMin === 1 ? "1 minuto" : warnMin + " minutos";
                }

                announce(server, [
                    SEPARATOR,
                    PREFIX_WARNING + "§lEvento em " + tempoStr + ": §r§e" + ev.name,
                    PREFIX_WARNING + ev.description,
                    PREFIX_WARNING + "Prepare-se! Começa às §f" + ev.hour + "h" + padMin(ev.minute) + "§e. §5✦",
                    SEPARATOR
                ]);
            }
        }

        // --------------------------------------------------------
        //  Anúncio "começa AGORA!"
        // --------------------------------------------------------
        if (diff === 0 && !firedEvents[i]) {
            firedEvents[i] = true;
            announce(server, [
                SEPARATOR,
                PREFIX_NOW + "§l" + ev.name + " §r§bcomeça AGORA!",
                PREFIX_NOW + ev.description,
                PREFIX_NOW + "Junte-se e divirta-se com a galera! §5✦",
                SEPARATOR
            ]);
        }
    }
});