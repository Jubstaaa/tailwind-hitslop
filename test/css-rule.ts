import postcss from 'postcss'

// The engines print a utility's pseudo-element either nested (`.x { &::before {} }`)
// or flattened into its own rule (`.x::before {}`): Tailwind v3 always flattens, v4
// flattens when the pseudo-element is the utility's only content. Collecting every
// top-level rule for the class keeps the assertions independent of that choice.
export function rule(css: string, selector: string): string {
    const found: string[] = []
    postcss.parse(css).walkRules((r) => {
        if (r.parent?.type === 'rule') return
        if (r.selectors.some((s) => s === selector || s.startsWith(`${selector}:`))) {
            found.push(r.toString())
        }
    })
    return found.join('\n')
}
