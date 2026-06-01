ServerEvents.recipes(event => {

    // Remove a recipe original
    event.remove({ output: 'fluxnetworks:flux_core' })

    // Nova recipe
    event.shaped('fluxnetworks:flux_core', [
        'FOF',
        'OEO',
        'FOF'
    ], {
        F: 'fluxnetworks:flux_dust',
        O: 'minecraft:obsidian',
        E: 'minecraft:ender_pearl'
    })

})