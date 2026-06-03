import { useCallback, useState } from 'react'
import type { MouseEvent } from 'react'

interface TapPanelProps {
    slopClassName?: string
    title: string
}

function TapPanel({ slopClassName = '', title }: TapPanelProps) {
    const [hits, setHits] = useState(0)
    const [misses, setMisses] = useState(0)

    const handleMiss = useCallback(() => setMisses(value => value + 1), [])

    const handleHit = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        setHits(value => value + 1)
    }, [])

    const handleReset = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        setHits(0)
        setMisses(0)
    }, [])

    const total = hits + misses

    return (
        <div
            className='cursor-crosshair rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 select-none'
            onClick={handleMiss}
        >
            <div className='flex items-center justify-between'>
                <h3 className='font-mono text-sm text-zinc-400'>{title}</h3>
                <button
                    className='hit-slop-2 text-xs text-zinc-500 hover:text-zinc-300'
                    onClick={handleReset}
                >
                    reset
                </button>
            </div>
            <div className='mt-6 flex flex-wrap gap-4'>
                {Array.from({ length: 14 }, (_, index) => (
                    <button
                        key={index}
                        className={`size-3 rounded-full bg-zinc-600 transition-colors hover:bg-blue-400 active:bg-blue-300 ${slopClassName}`}
                        onClick={handleHit}
                    />
                ))}
            </div>
            <p className='mt-6 text-sm text-zinc-500'>
                {total === 0
                    ? 'tap the dots as fast as you can'
                    : `${hits} hits · ${misses} misses · ${Math.round((hits / total) * 100)}% accuracy`}
            </p>
        </div>
    )
}

export default function TapGame() {
    return (
        <section className='mx-auto max-w-4xl px-6 py-16'>
            <h2 className='text-2xl font-semibold'>Feel the difference</h2>
            <p className='mt-2 text-zinc-400'>
                Same 12px dots. The right panel adds <code className='rounded bg-zinc-800 px-1.5 py-0.5 text-sm'>hit-slop-2</code>. Clicks outside a dot count as misses.
            </p>
            <div className='mt-8 grid gap-6 md:grid-cols-2'>
                <TapPanel title='without hit-slop' />
                <TapPanel title='with hit-slop-2' slopClassName='hit-slop-2' />
            </div>
        </section>
    )
}
