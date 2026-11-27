import { compile } from '@tailwindcss/node'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { rule } from './css-rule'

const indexCss = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const pluginPath = fileURLToPath(new URL('../dist/plugin.js', import.meta.url))

async function compileWith(layer: string, candidates: string[]) {
    const { build } = await compile(`@import 'tailwindcss';\n${layer}`, {
        base: process.cwd(),
        onDependency: () => {},
    })
    return build(candidates)
}

const fromCss = (c: string[]) => compileWith(indexCss, c)
const fromPlugin = (c: string[]) => compileWith(`@plugin '${pluginPath}';`, c)

function escapeClass(cand: string) {
    return cand.replace(/[.[\]]/g, ch => `\\${ch}`)
}

function signature(css: string, cand: string) {
    const r = rule(css, `.${escapeClass(cand)}`)
    const sides = [...r.matchAll(/--tw-hit-slop(?:-after)?-([trbl]):/g)].map(
        m => m[1]
    )
    const pseudo = r.includes('::after')
        ? '::after'
        : r.includes('::before')
          ? '::before'
          : null
    return { generated: r !== '', pseudo, sides: [...new Set(sides)].sort() }
}

const CANDIDATES = [
    'hit-slop',
    'hit-slop-2',
    'hit-slop-3.5',
    'hit-slop-[10px]',
    'hit-slop-t-2',
    'hit-slop-r-2',
    'hit-slop-b-2',
    'hit-slop-l-2',
    'hit-slop-x-2',
    'hit-slop-y-2',
    'hit-slop-after',
    'hit-slop-after-2',
    'hit-slop-after-[10px]',
    'hit-slop-after-t-2',
    'hit-slop-after-r-2',
    'hit-slop-after-b-2',
    'hit-slop-after-l-2',
    'hit-slop-after-x-2',
    'hit-slop-after-y-2',
    'hit-slop-debug',
    'hit-slop-after-debug',
]

describe('index.css and plugin.ts stay in sync', () => {
    it('emit the same utilities with the same side/pseudo structure', async () => {
        const css = await fromCss(CANDIDATES)
        const plugin = await fromPlugin(CANDIDATES)
        for (const cand of CANDIDATES) {
            const a = signature(css, cand)
            const b = signature(plugin, cand)
            expect(a.generated, `${cand}: missing from index.css`).toBe(true)
            expect(b.generated, `${cand}: missing from plugin`).toBe(true)
            expect(b, `${cand}: diverges between index.css and plugin`).toEqual(
                a
            )
        }
    })
})
