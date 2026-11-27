declare module 'tailwindcss-v3' {
    import type { PluginCreator } from 'postcss'

    const tailwindcss: PluginCreator<Record<string, unknown>>
    export = tailwindcss
}
