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
    const start = css.indexOf(`${selector} {`)
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

describe('functional hit-slop-*', () => {
    it('resolves spacing-scale numbers', async () => {
        const css = await compileWith(['hit-slop-2'])
        const r = rule(css, '.hit-slop-2')
        expect(r).toContain('--tw-hit-slop-t: calc(var(--spacing) * 2)')
        expect(r).toContain('--tw-hit-slop-l: calc(var(--spacing) * 2)')
    })

    it('resolves fractional numbers', async () => {
        const css = await compileWith(['hit-slop-3.5'])
        const r = rule(css, '.hit-slop-3\\.5')
        expect(r).toContain('calc(var(--spacing) * 3.5)')
    })

    it('resolves arbitrary lengths', async () => {
        const css = await compileWith(['hit-slop-[10px]'])
        const r = rule(css, '.hit-slop-\\[10px\\]')
        expect(r).toContain('--tw-hit-slop-t: 10px')
    })

    it('drops the unresolved value arms (no duplicate declarations)', async () => {
        const css = await compileWith(['hit-slop-2'])
        const r = rule(css, '.hit-slop-2')
        expect(r!.match(/--tw-hit-slop-t:/g)).toHaveLength(1)
    })

    it('generates classes from --hit-slop-* theme tokens', async () => {
        const css = await compileWith(['hit-slop-row'], '@theme { --hit-slop-row: 6px; }')
        const r = rule(css, '.hit-slop-row')
        expect(r).toContain('var(--hit-slop-row)')
    })

    it('generates nothing for unknown named values without a token', async () => {
        const css = await compileWith(['hit-slop-row'])
        expect(css).not.toContain('.hit-slop-row')
    })
})

describe('directional and axis utilities', () => {
    it('sets only its own side var', async () => {
        const css = await compileWith(['hit-slop-t-2'])
        const r = rule(css, '.hit-slop-t-2')
        expect(r).toContain('--tw-hit-slop-t: calc(var(--spacing) * 2)')
        expect(r).not.toContain('--tw-hit-slop-b:')
        expect(r).not.toContain('--tw-hit-slop-l:')
        expect(r).not.toContain('--tw-hit-slop-r:')
    })

    it('axis utilities set their two sides and stack with each other', async () => {
        const css = await compileWith(['hit-slop-x-1', 'hit-slop-y-3'])
        const x = rule(css, '.hit-slop-x-1')
        const y = rule(css, '.hit-slop-y-3')
        expect(x).toContain('--tw-hit-slop-l: calc(var(--spacing) * 1)')
        expect(x).toContain('--tw-hit-slop-r: calc(var(--spacing) * 1)')
        expect(x).not.toContain('--tw-hit-slop-t:')
        expect(y).toContain('--tw-hit-slop-t: calc(var(--spacing) * 3)')
        expect(y).toContain('--tw-hit-slop-b: calc(var(--spacing) * 3)')
        expect(y).not.toContain('--tw-hit-slop-l:')
    })

    it('every directional utility renders the full ::before reading all four vars', async () => {
        for (const candidate of [
            'hit-slop-t-2',
            'hit-slop-r-2',
            'hit-slop-b-2',
            'hit-slop-l-2',
            'hit-slop-x-2',
            'hit-slop-y-2',
        ]) {
            const css = await compileWith([candidate])
            const r = rule(css, `.${candidate}`)
            expect(r, candidate).toContain('top: calc(var(--tw-hit-slop-t, 0px) * -1)')
            expect(r, candidate).toContain('left: calc(var(--tw-hit-slop-l, 0px) * -1)')
        }
    })
})

describe('hit-slop-after-* fallback family', () => {
    it('renders via ::after with its own private vars', async () => {
        const css = await compileWith(['hit-slop-after-2'])
        const r = rule(css, '.hit-slop-after-2')
        expect(r).toContain('::after')
        expect(r).not.toContain('::before')
        expect(r).toContain('--tw-hit-slop-after-t: calc(var(--spacing) * 2)')
        expect(r).toContain('top: calc(var(--tw-hit-slop-after-t, 0px) * -1)')
    })

    it('coexists with the ::before family on one element without var clobbering', async () => {
        const css = await compileWith(['hit-slop-2', 'hit-slop-after-4'])
        const before = rule(css, '.hit-slop-2')
        const after = rule(css, '.hit-slop-after-4')
        expect(before).toContain('--tw-hit-slop-t: calc(var(--spacing) * 2)')
        expect(after).toContain('--tw-hit-slop-after-t: calc(var(--spacing) * 4)')
        expect(after).not.toContain('--tw-hit-slop-t:')
    })

    it('ships bare default and directional forms', async () => {
        const css = await compileWith(['hit-slop-after', 'hit-slop-after-x-1', 'hit-slop-after-t-[6px]'])
        expect(rule(css, '.hit-slop-after')).toContain('--tw-hit-slop-after-t: calc(var(--spacing) * 2)')
        expect(rule(css, '.hit-slop-after-x-1')).toContain('--tw-hit-slop-after-l: calc(var(--spacing) * 1)')
        expect(rule(css, '.hit-slop-after-t-\\[6px\\]')).toContain('--tw-hit-slop-after-t: 6px')
    })
})

describe('debug utilities', () => {
    it('hit-slop-debug paints the ::before area', async () => {
        const css = await compileWith(['hit-slop-debug'])
        const r = rule(css, '.hit-slop-debug')
        expect(r).toContain('::before')
        expect(r).toContain('outline')
        expect(r).toContain('dashed')
        expect(r).toContain('background-color')
    })

    it('hit-slop-after-debug paints the ::after area', async () => {
        const css = await compileWith(['hit-slop-after-debug'])
        const r = rule(css, '.hit-slop-after-debug')
        expect(r).toContain('::after')
        expect(r).not.toContain('::before')
    })
})

describe('core variant composition', () => {
    it('wraps in pointer-coarse media query', async () => {
        const css = await compileWith(['pointer-coarse:hit-slop-2'])
        expect(css).toContain('@media (pointer: coarse)')
        expect(css).toContain('--tw-hit-slop-t: calc(var(--spacing) * 2)')
    })

    it('wraps in hover and breakpoint variants', async () => {
        const css = await compileWith(['hover:hit-slop-3', 'md:hit-slop-2'])
        expect(css).toContain('@media (hover: hover)')
        expect(css).toContain('@media (width >= 48rem)')
    })

    it('emits nothing for negative or junk candidates', async () => {
        const css = await compileWith(['-hit-slop-2', 'hit-slop-junk!!'])
        expect(css).not.toContain('hit-slop')
    })
})
