const ROWS = [
    ['hit-slop', '8px on all sides (--spacing(2) default)'],
    ['hit-slop-<n>', 'spacing scale — hit-slop-2 = 8px, fractionals like 3.5 work'],
    ['hit-slop-[10px]', 'arbitrary length'],
    ['hit-slop-t/r/b/l-*', 'single side'],
    ['hit-slop-x-* / hit-slop-y-*', 'axis — stacks: hit-slop-x-1 hit-slop-y-3'],
    ['hit-slop-after-*', 'full mirror via ::after, for elements whose ::before is taken'],
    ['hit-slop-debug / hit-slop-after-debug', 'visualize the expanded areas'],
    ['pointer-coarse:hit-slop-2', 'recommended: touch devices only (core variant)'],
] as const

export default function ApiReference() {
    return (
        <section className='mx-auto max-w-3xl px-6 py-16'>
            <h2 className='text-2xl font-semibold'>API</h2>
            <div className='mt-6 overflow-hidden rounded-xl border border-zinc-800'>
                {ROWS.map(([cls, description]) => (
                    <div
                        key={cls}
                        className='grid gap-1 border-b border-zinc-800/60 px-5 py-3 last:border-0 sm:grid-cols-[1fr_1.2fr] sm:gap-6'
                    >
                        <code className='font-mono text-sm text-blue-300'>{cls}</code>
                        <span className='text-sm text-zinc-400'>{description}</span>
                    </div>
                ))}
            </div>
            <p className='mt-4 text-sm text-zinc-500'>
                Optional theme tokens: define <code className='rounded bg-zinc-800 px-1 py-0.5'>--hit-slop-row: 6px</code> in <code className='rounded bg-zinc-800 px-1 py-0.5'>@theme</code> and <code className='rounded bg-zinc-800 px-1 py-0.5'>hit-slop-row</code> exists.
            </p>
        </section>
    )
}
