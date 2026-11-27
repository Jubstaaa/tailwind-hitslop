import postcss from 'postcss'

export function rule(css: string, selector: string): string {
    const found: string[] = []
    postcss.parse(css).walkRules(r => {
        if (r.parent?.type === 'rule') return
        if (
            r.selectors.some(
                s => s === selector || s.startsWith(`${selector}:`)
            )
        ) {
            found.push(r.toString())
        }
    })
    return found.join('\n')
}
