import { Check, Copy, Terminal } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SectionHeading from './section-heading'

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
    const [copied, setCopied] = useState(false)

    const current = TABS.find(tab => tab.id === active)!

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(current.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }, [current.code])

    return (
        <section className='mx-auto max-w-3xl px-6 py-20'>
            <SectionHeading index='01 / install' icon={Terminal} title='Install' />
            <Tabs value={active} onValueChange={value => setActive(value as (typeof TABS)[number]['id'])}>
                <TabsList className='bg-zinc-900'>
                    {TABS.map(tab => (
                        <TabsTrigger
                            key={tab.id}
                            className='hit-slop-y-1 font-mono active:scale-95'
                            value={tab.id}
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {TABS.map(tab => (
                    <TabsContent key={tab.id} value={tab.id}>
                        <div className='relative mt-4 overflow-hidden rounded-xl border border-dashed border-zinc-800 bg-zinc-900/60'>
                            <Button
                                variant='ghost'
                                size='icon-sm'
                                className='hit-slop-2 absolute top-3 right-3 text-zinc-400 transition-all hover:text-zinc-100 active:scale-90'
                                onClick={handleCopy}
                            >
                                {copied ? <Check className='text-blue-400' /> : <Copy />}
                            </Button>
                            <pre className='overflow-x-auto p-5 pr-14 font-mono text-sm leading-relaxed text-zinc-300'>
                                {tab.code}
                            </pre>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}
