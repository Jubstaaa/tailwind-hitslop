interface PluginAPI {
    addUtilities(utilities: Record<string, RuleObject>): void
    matchUtilities(
        utilities: Record<string, (value: string) => RuleObject>,
        options?: { type?: string[]; values?: Record<string, string> }
    ): void
    theme(path: 'spacing'): Record<string, string>
    theme(path: string, defaultValue?: string): string
}

interface RuleObject {
    [key: string]: RuleObject | string
}

function area(prefix: string): RuleObject {
    return {
        borderRadius: 'inherit',
        bottom: `calc(var(--tw-hit-slop${prefix}-b, 0px) * -1)`,
        content: '""',
        left: `calc(var(--tw-hit-slop${prefix}-l, 0px) * -1)`,
        pointerEvents: 'inherit',
        position: 'absolute',
        right: `calc(var(--tw-hit-slop${prefix}-r, 0px) * -1)`,
        top: `calc(var(--tw-hit-slop${prefix}-t, 0px) * -1)`,
    }
}

function sided(
    prefix: string,
    pseudo: string,
    sides: string[],
    value: string
): RuleObject {
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
    'b': ['b'],
    'l': ['l'],
    'r': ['r'],
    't': ['t'],
    'x': ['l', 'r'],
    'y': ['t', 'b'],
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

// eslint-disable-next-line @typescript-eslint/unbound-method -- PluginAPI holds plain functions, and Tailwind documents destructuring them
function hitSlop({ addUtilities, matchUtilities, theme }: PluginAPI): void {
    const spacing = theme('spacing')

    for (const { name, prefix, pseudo } of FAMILIES) {
        for (const [suffix, sides] of Object.entries(SIDES)) {
            const utility = suffix ? `${name}-${suffix}` : name
            const values = suffix
                ? { ...spacing }
                : { ...spacing, DEFAULT: theme('spacing.2', '0.5rem') }
            matchUtilities(
                { [utility]: value => sided(prefix, pseudo, sides, value) },
                { type: ['length'], values }
            )
        }
    }

    addUtilities({
        '.hit-slop-after-debug': { '&::after': DEBUG_PAINT },
        '.hit-slop-debug': { '&::before': DEBUG_PAINT },
    })
}

export = hitSlop
