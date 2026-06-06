// tailwindcss@3 is installed under the `tailwindcss-v3` npm alias so it can run
// alongside the v4 toolchain in the same project. Tailwind v3 publishes no type
// declarations for its PostCSS plugin entry, and the alias name can't pick up
// community @types — so we declare its real shape here, exactly as an @types/*
// package would. It is the Tailwind PostCSS plugin: a postcss PluginCreator.
declare module 'tailwindcss-v3' {
    import type { PluginCreator } from 'postcss'

    const tailwindcss: PluginCreator<Record<string, unknown>>
    export = tailwindcss
}
