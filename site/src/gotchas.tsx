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
        <section className='mx-auto max-w-4xl px-6 py-16'>
            <h2 className='text-2xl font-semibold'>Gotchas — read this</h2>
            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                {GOTCHAS.map(gotcha => (
                    <div key={gotcha.title} className='rounded-xl border border-zinc-800 bg-zinc-900/50 p-5'>
                        <h3 className='font-medium text-zinc-200'>{gotcha.title}</h3>
                        <p className='mt-2 text-sm leading-relaxed text-zinc-400'>{gotcha.body}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
