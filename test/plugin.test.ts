import { compile } from '@tailwindcss/node'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import tailwind3 from 'tailwindcss-v3'
import { describe, expect, it } from 'vitest'

import hitslop from '../plugin'
import { rule } from './css-rule'

const pluginPath = fileURLToPath(new URL('../dist/plugin.js', import.meta.url))

async function compileV3(candidates: string[]) {
    const result = await postcss([
        tailwind3({
            content: [
                {
                    raw: candidates
                        .map(c => `<div class="${c}"></div>`)
                        .join(''),
                },
            ],
            corePlugins: { preflight: false },
            plugins: [hitslop],
        }),
    ]).process('@tailwind utilities;', { from: undefined })
    return result.css
}

async function compileV4(candidates: string[]) {
    const { build } = await compile(
        `@import 'tailwindcss';\n@plugin '${pluginPath}';`,
        {
            base: process.cwd(),
            onDependency: () => {},
        }
    )
    return build(candidates)
}

const engines: [string, (c: string[]) => Promise<string>][] = [
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
        const a = rule(await build(['hit-slop']), '.hit-slop')
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
        expect(rule(css, '.hit-slop-after-2')).toContain(
            '--tw-hit-slop-after-t: 0.5rem'
        )
        expect(rule(css, '.hit-slop-after-2')).toContain(
            'top: calc(var(--tw-hit-slop-after-t, 0px) * -1)'
        )
        expect(rule(css, '.hit-slop-after-2')).not.toContain('::before')
    })

    it('after family coexists with the before family without var clobbering', async () => {
        const css = await build(['hit-slop-2', 'hit-slop-after-4'])
        expect(rule(css, '.hit-slop-2')).toContain('--tw-hit-slop-t: 0.5rem')
        const after = rule(css, '.hit-slop-after-4')
        expect(after).toContain('--tw-hit-slop-after-t: 1rem')
        expect(after).not.toContain('--tw-hit-slop-t:')
    })

    it('debug utilities paint the matching pseudo element', async () => {
        const before = rule(await build(['hit-slop-debug']), '.hit-slop-debug')
        expect(before).toContain('outline')
        expect(before).toContain('dashed')
        const css = await build(['hit-slop-after-debug'])
        expect(rule(css, '.hit-slop-after-debug')).toContain('outline')
        expect(rule(css, '.hit-slop-after-debug')).not.toContain('::before')
    })

    it('emits nothing for negative candidates', async () => {
        const css = await build(['-hit-slop-2'])
        expect(css).not.toContain('-hit-slop-2 {')
    })
})
