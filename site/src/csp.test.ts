// @vitest-environment node
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const policy =
    new JSDOM(html).window.document
        .querySelector('meta[http-equiv="Content-Security-Policy"]')
        ?.getAttribute('content') ?? ''
const directives = new Map(
    policy
        .split(';')
        .map(d => d.trim().split(/\s+/))
        .filter(([name]) => name)
        .map(([name, ...sources]) => [name, sources])
)

describe('Content-Security-Policy', () => {
    it('keeps scripts first-party apart from the Cloudflare Web Analytics beacon', () => {
        expect(directives.get('script-src')).toEqual(["'self'", 'https://static.cloudflareinsights.com'])
    })

    it('lets the beacon report back', () => {
        expect(directives.get('connect-src')).toContain('https://cloudflareinsights.com')
    })

    it('blocks plugins and base-uri hijacking', () => {
        expect(directives.get('object-src')).toEqual(["'none'"])
        expect(directives.get('base-uri')).toEqual(["'self'"])
    })
})
