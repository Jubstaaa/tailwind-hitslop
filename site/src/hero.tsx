import { useState } from 'react'

const ICONS = ['✕', '⋯', '★', '↻', '♥']

export default function Hero() {
    const [debug, setDebug] = useState(false)

    return (
        <section className='mx-auto max-w-3xl px-6 pt-24 pb-16 text-center'>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
                tailwind-<span className='text-blue-400'>hitslop</span>
            </h1>
            <p className='mx-auto mt-4 max-w-xl text-lg text-zinc-400'>
                Invisible expanded touch targets for Tailwind CSS v4. Visual size stays the same — the tap area grows. Like React Native's <code className='rounded bg-zinc-800 px-1.5 py-0.5 text-sm'>hitSlop</code>, zero JavaScript.
            </p>
            <div className='mt-10 flex items-center justify-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10'>
                {ICONS.map(icon => (
                    <button
                        key={icon}
                        className={`hit-slop-3 grid size-5 place-items-center rounded-md bg-zinc-700 text-xs text-zinc-200 transition-colors hover:bg-blue-500 ${debug ? 'hit-slop-debug' : ''}`}
                    >
                        {icon}
                    </button>
                ))}
            </div>
            <label className='mt-6 inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-400'>
                <input
                    type='checkbox'
                    checked={debug}
                    onChange={event => setDebug(event.target.checked)}
                />
                show hit areas (hit-slop-debug)
            </label>
        </section>
    )
}
