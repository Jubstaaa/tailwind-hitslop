import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { compile } from '@tailwindcss/node'
import { describe, expect, it } from 'vitest'

// index.css (the v4 pure-CSS path) and plugin.ts (the v3/@plugin path) are two
// implementations of the same utilities. This test locks them together so they
// can't drift — if one gains/loses a utility or wires a side differently, it fails.

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
    return cand.replace(/[.[\]]/g, (ch) => `\\${ch}`)
}

function rule(css: string, selector: string) {
    const start = css.indexOf(`${selector} {`)
    if (start === -1) return ''
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

// Structural fingerprint that ignores value representation (v4 CSS emits
// `calc(var(--spacing) * n)`, the plugin emits the resolved `n rem`) and captures
// what actually defines a utility: whether it's generated, which side vars it
// sets, and which pseudo-element renders the hit area.
function signature(css: string, cand: string) {
    const r = rule(css, `.${escapeClass(cand)}`)
    const sides = [...r.matchAll(/--tw-hit-slop(?:-after)?-([trbl]):/g)].map((m) => m[1])
    const pseudo = r.includes('::after') ? '::after' : r.includes('::before') ? '::before' : null
    return { generated: r !== '', sides: [...new Set(sides)].sort(), pseudo }
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
    'hit-slop-after-t-2',
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
            expect(b, `${cand}: diverges between index.css and plugin`).toEqual(a)
        }
    })
})
