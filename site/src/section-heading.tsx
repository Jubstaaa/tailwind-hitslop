import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface SectionHeadingProps {
    index: string
    icon: LucideIcon
    title: string
    children?: ReactNode
}

export default function SectionHeading({ index, icon: Icon, title, children }: SectionHeadingProps) {
    return (
        <div className='mb-10'>
            <span className='inline-flex items-center gap-2 font-mono text-xs tracking-widest text-blue-500/80 uppercase'>
                <Icon size={13} strokeWidth={2.5} />
                {index}
            </span>
            <h2 className='mt-3 font-display text-3xl font-bold tracking-tight'>{title}</h2>
            {children ? <p className='mt-3 max-w-2xl text-zinc-400'>{children}</p> : null}
        </div>
    )
}
