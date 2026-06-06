import { fileURLToPath } from 'node:url'
import { compile } from '@tailwindcss/node'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import tailwind3 from 'tailwindcss-v3'
import hitslop from '../plugin'

// v4 @plugin loads the compiled artifact; `bun run build` emits it before tests run.
const pluginPath = fileURLToPath(new URL('../dist/plugin.js', import.meta.url))

async function compileV3(candidates: string[]) {
    const result = await postcss([
        tailwind3({
            content: [{ raw: candidates.map((c) => `<div class="${c}"></div>`).join('') }],
            corePlugins: { preflight: false },
            plugins: [hitslop],
        }),
    ]).process('@tailwind utilities;', { from: undefined })
    return result.css as string
}

async function compileV4(candidates: string[]) {
    const { build } = await compile(`@import 'tailwindcss';\n@plugin '${pluginPath}';`, {
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

// v3 flattens nested `&::before` into a separate `.x::before {}` rule; v4 keeps
// it nested inside `.x {}`. Return whichever holds the pseudo-element declarations.
function area(css: string, base: string, pseudo: string) {
    return rule(css, `${base}${pseudo}`) ?? rule(css, base)
}

const engines: Array<[string, (c: string[]) => Promise<string>]> = [
    ['v3', compileV3],
    ['v4', compileV4],
]

describe.each(engines)('hit-slop plugin under tailwind %s', (_label, build) => {
    it('bare hit-slop defaults all four sides to spacing 2', async () => {
        const r = rule(await build(['hit-slop']), '.hit-slop')
        expect(r).toContain('position: relative')
        expect(r).toContain('--tw-hit-slop-t: 0.5rem')
        expect(r).toContain('--tw-hit-slop-r: 0.5rem')
        expect(r).toContain('--tw-hit-slop-b: 0.5rem')
        expect(r).toContain('--tw-hit-slop-l: 0.5rem')
    })

    it('renders the ::before hit area reading the side vars', async () => {
        const a = area(await build(['hit-slop']), '.hit-slop', '::before')
        expect(a).toContain('top: calc(var(--tw-hit-slop-t, 0px) * -1)')
        expect(a).toContain('border-radius: inherit')
        expect(a).toContain('pointer-events: inherit')
    })

    it('functional hit-slop-* resolves spacing scale', async () => {
        const r = rule(await build(['hit-slop-2']), '.hit-slop-2')
        expect(r).toContain('--tw-hit-slop-t: 0.5rem')
        expect(r).toContain('--tw-hit-slop-l: 0.5rem')
    })

    it('resolves arbitrary lengths', async () => {
        const r = rule(await build(['hit-slop-[10px]']), '.hit-slop-\\[10px\\]')
        expect(r).toContain('--tw-hit-slop-t: 10px')
    })

    it('directional utility sets only its own side var', async () => {
        const r = rule(await build(['hit-slop-t-2']), '.hit-slop-t-2')
        expect(r).toContain('--tw-hit-slop-t: 0.5rem')
        expect(r).not.toContain('--tw-hit-slop-b:')
        expect(r).not.toContain('--tw-hit-slop-l:')
        expect(r).not.toContain('--tw-hit-slop-r:')
    })

    it('axis utilities set their two sides', async () => {
        const x = rule(await build(['hit-slop-x-1']), '.hit-slop-x-1')
        expect(x).toContain('--tw-hit-slop-l: 0.25rem')
        expect(x).toContain('--tw-hit-slop-r: 0.25rem')
        expect(x).not.toContain('--tw-hit-slop-t:')
        const y = rule(await build(['hit-slop-y-3']), '.hit-slop-y-3')
        expect(y).toContain('--tw-hit-slop-t: 0.75rem')
        expect(y).toContain('--tw-hit-slop-b: 0.75rem')
        expect(y).not.toContain('--tw-hit-slop-l:')
    })

    it('after family renders via ::after with its own private vars', async () => {
        const css = await build(['hit-slop-after-2'])
        expect(rule(css, '.hit-slop-after-2')).toContain('--tw-hit-slop-after-t: 0.5rem')
        expect(area(css, '.hit-slop-after-2', '::after')).toContain('top: calc(var(--tw-hit-slop-after-t, 0px) * -1)')
        expect(rule(css, '.hit-slop-after-2::before')).toBeNull()
    })

    it('after family coexists with the before family without var clobbering', async () => {
        const css = await build(['hit-slop-2', 'hit-slop-after-4'])
        expect(rule(css, '.hit-slop-2')).toContain('--tw-hit-slop-t: 0.5rem')
        const after = rule(css, '.hit-slop-after-4')
        expect(after).toContain('--tw-hit-slop-after-t: 1rem')
        expect(after).not.toContain('--tw-hit-slop-t:')
    })

    it('debug utilities paint the matching pseudo element', async () => {
        const before = area(await build(['hit-slop-debug']), '.hit-slop-debug', '::before')
        expect(before).toContain('outline')
        expect(before).toContain('dashed')
        const css = await build(['hit-slop-after-debug'])
        expect(area(css, '.hit-slop-after-debug', '::after')).toContain('outline')
        expect(rule(css, '.hit-slop-after-debug::before')).toBeNull()
    })

    it('emits nothing for negative candidates', async () => {
        const css = await build(['-hit-slop-2'])
        expect(css).not.toContain('-hit-slop-2 {')
    })
})
