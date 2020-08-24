module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
    // testMatch: ['test/Unit/.*.spec.js$'],
    moduleFileExtensions: [
        'js',
        'json',
        // tell Jest to handle `*.vue` files
        'vue',
    ],
    transform: {
        // process `*.vue` files with `vue-jest`
        '.*\\.(vue)$': 'vue-jest',
    },
}
