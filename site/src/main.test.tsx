// @vitest-environment node
import { queryAllByRole, queryByRole } from '@testing-library/dom'
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'
import { prerender } from './main'

// The page ships as prerendered HTML, so the markup a visitor (or a screen
// reader) gets before hydration is exactly what prerender() returns.
async function prerenderedBody() {
    const { html } = await prerender()
    return new JSDOM(`<!doctype html><body>${html}</body>`).window.document.body
}

describe('prerendered page', () => {
    it('contains the page content, not an empty root', async () => {
        const body = await prerenderedBody()
        expect(queryByRole(body, 'heading', { level: 1 })?.textContent).toBe('tailwind-hitslop')
    })

    it('gives every button an accessible name', async () => {
        const body = await prerenderedBody()
        expect(queryAllByRole(body, 'button').length).toBeGreaterThan(0)
        expect(queryAllByRole(body, 'button', { name: '' }).map(b => b.outerHTML)).toEqual([])
    })

    // Radix keeps slider thumbs display:none until it has measured them on the
    // client, and a hidden element's computed name is always empty, so the
    // label itself is what is checked here.
    it('gives every slider an accessible name', async () => {
        const body = await prerenderedBody()
        const sliders = queryAllByRole(body, 'slider', { hidden: true })
        expect(sliders).toHaveLength(4)
        expect(sliders.map(s => s.getAttribute('aria-label'))).toEqual([
            'Top slop',
            'Right slop',
            'Bottom slop',
            'Left slop',
        ])
    })

    it('keeps the footer outside main so both landmarks exist', async () => {
        const body = await prerenderedBody()
        expect(queryByRole(body, 'main')).not.toBeNull()
        expect(queryByRole(body, 'contentinfo')).not.toBeNull()
    })
})
