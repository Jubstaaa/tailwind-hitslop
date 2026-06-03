import { useCallback, useMemo, useState } from 'react'

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
        <section className='mx-auto max-w-4xl px-6 py-16'>
            <h2 className='text-2xl font-semibold'>Playground</h2>
            <div className='mt-8 grid gap-10 md:grid-cols-[1fr_auto]'>
                <div className='space-y-5'>
                    {SIDES.map(side => (
                        <label key={side} className='flex items-center gap-4 text-sm'>
                            <span className='w-16 font-mono text-zinc-400'>{side}</span>
                            <input
                                type='range'
                                min={0}
                                max={24}
                                step={4}
                                value={values[side]}
                                className='flex-1 accent-blue-500'
                                onChange={event =>
                                    setValues(current => ({ ...current, [side]: Number(event.target.value) }))
                                }
                            />
                            <span className='w-12 text-right font-mono text-zinc-500'>{values[side]}px</span>
                        </label>
                    ))}
                    <label className='flex cursor-pointer items-center gap-2 text-sm text-zinc-400'>
                        <input
                            type='checkbox'
                            checked={debug}
                            onChange={event => setDebug(event.target.checked)}
                        />
                        debug overlay
                    </label>
                </div>
                <div className='grid min-h-48 min-w-56 place-items-center rounded-2xl border border-zinc-800 bg-zinc-900/50'>
                    <button
                        className={`rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white ${classString} ${debug ? 'hit-slop-debug' : ''}`}
                    >
                        tap me
                    </button>
                </div>
            </div>
            <div className='mt-8 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm'>
                <code className='flex-1 text-blue-300'>{classString}</code>
                <button className='hit-slop-2 text-zinc-400 hover:text-zinc-100' onClick={handleCopy}>
                    {copied ? 'copied!' : 'copy'}
                </button>
            </div>
        </section>
    )
}
