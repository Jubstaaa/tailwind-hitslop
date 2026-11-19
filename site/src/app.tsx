import ApiReference from './api-reference'
import Gotchas from './gotchas'
import Hero from './hero'
import InstallTabs from './install-tabs'
import Playground from './playground'
import GithubIcon from './github-icon'
import TapGame from './tap-game'

export default function App() {
    return (
        <div className='min-h-dvh bg-zinc-950 text-zinc-100 antialiased'>
            <main>
                <Hero />
                <InstallTabs />
                <TapGame />
                <Playground />
                <ApiReference />
                <Gotchas />
            </main>
            <footer className='border-t border-zinc-900'>
                <div className='mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-14 text-center text-sm text-zinc-400'>
                    <a
                        className='hit-slop-2 inline-flex items-center gap-2 text-zinc-400 transition-all hover:text-zinc-100 active:scale-95'
                        href='https://github.com/Jubstaaa/tailwind-hitslop'
                    >
                        <GithubIcon size={16} />
                        GitHub
                    </a>
                    <span className='font-mono text-xs text-zinc-400'>MIT © İlker Balcılar</span>
                </div>
            </footer>
        </div>
    )
}
