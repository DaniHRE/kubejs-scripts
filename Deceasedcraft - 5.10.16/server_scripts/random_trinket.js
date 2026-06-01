// random_trinket.js - KubeJS 1.20.1
ServerEvents.commandRegistry(event => {
    const { commands: Commands } = event;

    event.register(
        Commands.literal('random_trinket')
            .executes(ctx => {
                const player = ctx.source.playerOrException;
                const server = ctx.source.server;
                const name = player.username;
                const targetItem = 'apocalypsenow:highvaluemoneyblock';

                // Checa se tem pelo menos 64 do item
                const checkResult = server.commands.performPrefixedCommand(
                    ctx.source,
                    `clear ${name} ${targetItem} 0`
                );

                if (checkResult < 64) {
                    player.tell('§cVocê precisa de §61 pack (64x) de High Value Money Block§c!');
                    return 0;
                }

                // Remove 64 do item
                server.commands.performPrefixedCommand(
                    ctx.source,
                    `clear ${name} ${targetItem} 64`
                );

                // Dá o trinket
                server.commands.performPrefixedCommand(
                    ctx.source,
                    `give ${name} nameless_trinkets:mysterious_trinket 1`
                );

                player.tell('§a✔ Você trocou §61 pack (64x)§a por um §dMysterious Trinket§a! Boa sorte...');
                return 1;
            })
    );
});