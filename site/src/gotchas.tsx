import { TriangleAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SectionHeading from './section-heading'

const GOTCHAS = [
    {
        title: 'Ancestor overflow-hidden clips the slop',
        body: 'Cards, modals and scroll containers silently cut the expanded area. Toggle hit-slop-debug and look before you trust it.',
    },
    {
        title: '::before already taken?',
        body: 'Icon fonts, rings and gradients often own ::before. Use the hit-slop-after-* family — both coexist on one element.',
    },
    {
        title: 'Adjacent slops overlap',
        body: 'DOM order decides who wins the overlap zone. In dense rows use hit-slop-1 and keep real spacing between targets.',
    },
    {
        title: 'Not a WCAG compliance fix',
        body: 'WCAG 2.5.8 measures the rendered box, not invisible hit areas. Need audits to pass? Use min-h-11 min-w-11 — and add hit-slop on top for real-world ergonomics.',
    },
] as const

export default function Gotchas() {
    return (
        <section className='mx-auto max-w-4xl px-6 py-20'>
            <SectionHeading index='05 / caveats' icon={TriangleAlert} title='Gotchas — read this' />
            <div className='grid gap-4 sm:grid-cols-2'>
                {GOTCHAS.map(gotcha => (
                    <Card
                        key={gotcha.title}
                        className='relative gap-3 border-zinc-800 bg-zinc-900/40 ring-0 transition-colors hover:border-zinc-700'
                    >
                        <span className='pointer-events-none absolute top-3 right-4 font-mono text-lg leading-none text-zinc-700 select-none'>+</span>
                        <CardHeader>
                            <CardTitle className='text-zinc-200'>{gotcha.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm leading-relaxed text-zinc-400'>{gotcha.body}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
