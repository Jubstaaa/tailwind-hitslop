/*
 * tailwind-hitslop — plugin entry for Tailwind CSS v3 (and v4 via @plugin).
 * Mirrors index.css. Invisible expanded touch targets; visual size stays unchanged.
 *
 * v3:  plugins: [require('tailwind-hitslop')]   // in tailwind.config.js
 * v4:  @plugin 'tailwind-hitslop';              // in your css (the @import path stays pure CSS)
 *
 * Exported with `export =` so the compiled module is `module.exports = fn`, which
 * both v3 (plugins array) and v4 (@plugin loader) accept directly as a plugin.
 */

interface RuleObject {
    [key: string]: string | RuleObject
}

interface PluginAPI {
    matchUtilities(
        utilities: Record<string, (value: string) => RuleObject>,
        options?: { values?: Record<string, string>; type?: string[] },
    ): void
    addUtilities(utilities: Record<string, RuleObject>): void
    theme(path: 'spacing'): Record<string, string>
    theme(path: string, defaultValue?: string): string
}

function area(prefix: string): RuleObject {
    return {
        content: '""',
        position: 'absolute',
        top: `calc(var(--tw-hit-slop${prefix}-t, 0px) * -1)`,
        right: `calc(var(--tw-hit-slop${prefix}-r, 0px) * -1)`,
        bottom: `calc(var(--tw-hit-slop${prefix}-b, 0px) * -1)`,
        left: `calc(var(--tw-hit-slop${prefix}-l, 0px) * -1)`,
        borderRadius: 'inherit',
        pointerEvents: 'inherit',
    }
}

function sided(prefix: string, pseudo: string, sides: string[], value: string): RuleObject {
    const vars: RuleObject = {}
    for (const s of sides) vars[`--tw-hit-slop${prefix}-${s}`] = value
    return {
        position: 'relative',
        ...vars,
        [`&${pseudo}`]: area(prefix),
    }
}

const SIDES: Record<string, string[]> = {
    '': ['t', 'r', 'b', 'l'],
    t: ['t'],
    r: ['r'],
    b: ['b'],
    l: ['l'],
    x: ['l', 'r'],
    y: ['t', 'b'],
}

const FAMILIES = [
    { name: 'hit-slop', prefix: '', pseudo: '::before' },
    { name: 'hit-slop-after', prefix: '-after', pseudo: '::after' },
]

const DEBUG_PAINT: RuleObject = {
    backgroundColor: 'rgb(59 130 246 / 0.15)',
    outline: '1.5px dashed rgb(59 130 246 / 0.6)',
    outlineOffset: '-1.5px',
}

function hitSlop({ matchUtilities, addUtilities, theme }: PluginAPI): void {
    const spacing = theme('spacing')

    for (const { name, prefix, pseudo } of FAMILIES) {
        for (const [suffix, sides] of Object.entries(SIDES)) {
            const utility = suffix ? `${name}-${suffix}` : name
            const values = suffix ? { ...spacing } : { ...spacing, DEFAULT: theme('spacing.2', '0.5rem') }
            matchUtilities(
                { [utility]: (value) => sided(prefix, pseudo, sides, value) },
                { values, type: ['length'] },
            )
        }
    }

    addUtilities({
        '.hit-slop-debug': { '&::before': DEBUG_PAINT },
        '.hit-slop-after-debug': { '&::after': DEBUG_PAINT },
    })
}

export = hitSlop
