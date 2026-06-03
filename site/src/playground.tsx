import { Check, Copy, SlidersHorizontal } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import SectionHeading from './section-heading'

const SIDES = ['t', 'r', 'b', 'l'] as const

type Side = (typeof SIDES)[number]

type SideValues = Record<Side, number>

function toClass(prefix: string, px: number) {
    return `${prefix}-${px / 4}`
}

export default function Playground() {
    const [debug, setDebug] = useState(true)
    const [values, setValues] = useState<SideValues>({ t: 8, r: 8, b: 8, l: 8 })
    const [copied, setCopied] = useState(false)

    const classString = useMemo(() => {
        const { t, r, b, l } = values
        if (t === r && r === b && b === l) return toClass('hit-slop', t)
        if (t === b && l === r) return `${toClass('hit-slop-y', t)} ${toClass('hit-slop-x', l)}`
        return SIDES.filter(side => values[side] > 0)
            .map(side => toClass(`hit-slop-${side}`, values[side]))
            .join(' ')
    }, [values])

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(classString)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }, [classString])

    return (
        <section className='mx-auto max-w-4xl px-6 py-20'>
            <SectionHeading index='03 / playground' icon={SlidersHorizontal} title='Playground'>
                Drag a side and watch the class string build itself. Toggle the debug overlay to x-ray the tap area.
            </SectionHeading>
            <div className='grid gap-10 md:grid-cols-[1fr_auto]'>
                <div className='space-y-6'>
                    {SIDES.map(side => (
                        <div key={side} className='flex items-center gap-4 text-sm'>
                            <span className='w-6 font-mono text-zinc-400'>{side}</span>
                            <Slider
                                min={0}
                                max={24}
                                step={4}
                                value={[values[side]]}
                                className='flex-1'
                                onValueChange={([next]) =>
                                    setValues(current => ({ ...current, [side]: next }))
                                }
                            />
                            <span className='w-12 text-right font-mono text-zinc-500'>{values[side]}px</span>
                        </div>
                    ))}
                    <label className='flex cursor-pointer items-center gap-3 pt-1 text-sm text-zinc-400'>
                        <Switch checked={debug} onCheckedChange={setDebug} />
                        debug overlay
                    </label>
                </div>
                <Card className='relative grid min-h-48 min-w-56 place-items-center border-dashed border-zinc-800 bg-zinc-900/40 ring-0'>
                    <button
                        className={`rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-400 active:scale-90 active:bg-blue-600 ${classString} ${debug ? 'hit-slop-debug' : ''}`}
                    >
                        tap me
                    </button>
                </Card>
            </div>
            <div className='mt-8 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3'>
                <code className='flex-1 font-mono text-sm text-blue-300'>{classString}</code>
                <Button
                    variant='ghost'
                    size='icon-sm'
                    className='hit-slop-2 text-zinc-400 transition-all hover:text-zinc-100 active:scale-90'
                    onClick={handleCopy}
                >
                    {copied ? <Check className='text-blue-400' /> : <Copy />}
                </Button>
            </div>
        </section>
    )
}
