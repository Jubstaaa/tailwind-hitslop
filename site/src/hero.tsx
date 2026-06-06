import { Ellipsis, Heart, RotateCw, Star, X } from 'lucide-react'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'

const ICONS = [X, Ellipsis, Star, RotateCw, Heart]

export default function Hero() {
    const [debug, setDebug] = useState(false)

    return (
        <section className='relative overflow-hidden border-b border-zinc-900'>
            <div className='blueprint-grid pointer-events-none absolute inset-0 opacity-60' />
            <div className='blueprint-glow pointer-events-none absolute inset-x-0 top-0 h-80' />
            <div className='relative mx-auto max-w-4xl px-6 pt-28 pb-20 text-center'>
                <span className='animate-rise inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 font-mono text-xs text-zinc-400 [animation-delay:0ms]'>
                    <span className='size-1.5 rounded-full bg-blue-500' />
                    Tailwind v3 &amp; v4 · pure CSS
                </span>
                <h1 className='animate-rise mt-7 font-display text-5xl font-extrabold tracking-tight text-balance sm:text-6xl [animation-delay:80ms]'>
                    tailwind-<span className='text-blue-500'>hitslop</span>
                </h1>
                <p className='animate-rise mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-400 text-balance [animation-delay:160ms]'>
                    Invisible expanded touch targets for Tailwind CSS v3 &amp; v4. Visual size stays the same — the tap area grows. Like React Native's{' '}
                    <code className='rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-sm text-blue-300'>hitSlop</code>.
                </p>
                <div className='animate-rise relative mx-auto mt-12 flex max-w-md items-center justify-center gap-7 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-8 py-12 [animation-delay:240ms]'>
                    <CornerMarks />
                    {ICONS.map((Icon, index) => (
                        <button
                            key={index}
                            className={`hit-slop-3 grid size-6 place-items-center rounded-md bg-zinc-800 text-zinc-300 transition-all duration-150 hover:bg-blue-500 hover:text-white active:scale-90 active:bg-blue-400 ${debug ? 'hit-slop-debug' : ''}`}
                        >
                            <Icon size={15} strokeWidth={2.25} />
                        </button>
                    ))}
                </div>
                <label className='animate-rise mt-6 inline-flex cursor-pointer items-center gap-3 text-sm text-zinc-400 [animation-delay:320ms]'>
                    <Switch checked={debug} onCheckedChange={setDebug} />
                    <span>
                        reveal hit areas{' '}
                        <code className='font-mono text-xs text-zinc-500'>(hit-slop-debug)</code>
                    </span>
                </label>
            </div>
        </section>
    )
}

function CornerMarks() {
    return (
        <>
            <span className='pointer-events-none absolute -top-px -left-px size-3 border-t border-l border-blue-500/40' />
            <span className='pointer-events-none absolute -top-px -right-px size-3 border-t border-r border-blue-500/40' />
            <span className='pointer-events-none absolute -bottom-px -left-px size-3 border-b border-l border-blue-500/40' />
            <span className='pointer-events-none absolute -right-px -bottom-px size-3 border-r border-b border-blue-500/40' />
        </>
    )
}
