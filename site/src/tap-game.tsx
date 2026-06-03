import { RotateCcw, Target } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SectionHeading from './section-heading'

interface TapPanelProps {
    accent?: boolean
    slopClassName?: string
    title: string
}

function TapPanel({ accent = false, slopClassName = '', title }: TapPanelProps) {
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
        <Card
            className={`relative cursor-crosshair gap-0 border-zinc-800 bg-zinc-900/40 p-8 ring-0 select-none ${accent ? 'border-dashed border-blue-500/40' : ''}`}
            onClick={handleMiss}
        >
            <div className='flex items-center justify-between'>
                <h3 className='font-mono text-sm text-zinc-400'>{title}</h3>
                <Button
                    variant='ghost'
                    size='xs'
                    className='hit-slop-2 gap-1.5 font-mono text-zinc-500 transition-all hover:text-zinc-200 active:scale-90'
                    onClick={handleReset}
                >
                    <RotateCcw size={12} />
                    reset
                </Button>
            </div>
            <div className='mt-7 flex flex-wrap gap-4'>
                {Array.from({ length: 14 }, (_, index) => (
                    <button
                        key={index}
                        className={`size-3 rounded-full bg-zinc-600 transition-all duration-100 hover:scale-125 hover:bg-blue-400 active:scale-150 active:bg-blue-300 active:ring-4 active:ring-blue-400/30 ${slopClassName}`}
                        onClick={handleHit}
                    />
                ))}
            </div>
            <p className='mt-7 font-mono text-sm text-zinc-500'>
                {total === 0
                    ? 'tap the dots as fast as you can'
                    : `${hits} hits · ${misses} misses · ${Math.round((hits / total) * 100)}% accuracy`}
            </p>
        </Card>
    )
}

export default function TapGame() {
    return (
        <section className='mx-auto max-w-4xl px-6 py-20'>
            <SectionHeading index='02 / demo' icon={Target} title='Feel the difference'>
                Same 12px dots. The right panel adds{' '}
                <code className='rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-sm text-blue-300'>hit-slop-2</code>. Clicks outside a dot count as misses.
            </SectionHeading>
            <div className='grid gap-6 md:grid-cols-2'>
                <TapPanel title='without hit-slop' />
                <TapPanel accent title='with hit-slop-2' slopClassName='hit-slop-2' />
            </div>
        </section>
    )
}
