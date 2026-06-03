import { readFileSync } from 'node:fs'
import { compile } from '@tailwindcss/node'
import { describe, expect, it } from 'vitest'

const plugin = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

async function compileWith(candidates: string[], extraCss = '') {
    const { build } = await compile(`@import 'tailwindcss';\n${extraCss}\n${plugin}`, {
        base: process.cwd(),
        onDependency: () => {},
    })
    return build(candidates)
}

function rule(css: string, selector: string) {
    const start = css.indexOf(selector)
    if (start === -1) return null
    const open = css.indexOf('{', start)
    let depth = 1
    let i = open + 1
    while (depth > 0 && i < css.length) {
        if (css[i] === '{') depth++
        if (css[i] === '}') depth--
        i++
    }
    return css.slice(start, i)
}

describe('bare hit-slop', () => {
    it('defaults all four sides to spacing 2 (8px)', async () => {
        const css = await compileWith(['hit-slop'])
        const r = rule(css, '.hit-slop')
        expect(r).toContain('--tw-hit-slop-t: calc(var(--spacing) * 2)')
        expect(r).toContain('--tw-hit-slop-r: calc(var(--spacing) * 2)')
        expect(r).toContain('--tw-hit-slop-b: calc(var(--spacing) * 2)')
        expect(r).toContain('--tw-hit-slop-l: calc(var(--spacing) * 2)')
    })

    it('renders the ::before hit area reading the side vars', async () => {
        const css = await compileWith(['hit-slop'])
        const r = rule(css, '.hit-slop')
        expect(r).toContain('::before')
        expect(r).toContain('position: relative')
        expect(r).toContain('top: calc(var(--tw-hit-slop-t, 0px) * -1)')
        expect(r).toContain('border-radius: inherit')
        expect(r).toContain('pointer-events: inherit')
    })
})
