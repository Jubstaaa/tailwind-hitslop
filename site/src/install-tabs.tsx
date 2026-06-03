import { useState } from 'react'

const TABS = [
    {
        id: 'bun',
        label: 'bun',
        code: "bun add tailwind-hitslop\n\n/* app.css */\n@import 'tailwindcss';\n@import 'tailwind-hitslop';",
    },
    {
        id: 'npm',
        label: 'npm',
        code: "npm install tailwind-hitslop\n\n/* app.css */\n@import 'tailwindcss';\n@import 'tailwind-hitslop';",
    },
] as const

export default function InstallTabs() {
    const [active, setActive] = useState<(typeof TABS)[number]['id']>('bun')

    const current = TABS.find(tab => tab.id === active)!

    return (
        <section className='mx-auto max-w-3xl px-6 py-16'>
            <h2 className='text-2xl font-semibold'>Install</h2>
            <div className='mt-6 flex gap-1 rounded-lg bg-zinc-900 p-1'>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`hit-slop-y-1 flex-1 rounded-md px-3 py-1.5 text-sm transition-colors ${active === tab.id ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
                        onClick={() => setActive(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <pre className='mt-3 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm leading-relaxed text-zinc-300'>
                {current.code}
            </pre>
        </section>
    )
}
