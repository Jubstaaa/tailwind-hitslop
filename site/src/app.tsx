import ApiReference from './api-reference'
import Gotchas from './gotchas'
import Hero from './hero'
import InstallTabs from './install-tabs'
import Playground from './playground'
import TapGame from './tap-game'

export default function App() {
    return (
        <main className='min-h-dvh bg-zinc-950 text-zinc-100 antialiased'>
            <Hero />
            <TapGame />
            <Playground />
            <InstallTabs />
            <ApiReference />
            <Gotchas />
            <footer className='mx-auto max-w-4xl px-6 py-12 text-center text-sm text-zinc-600'>
                <a
                    className='hit-slop-2 hover:text-zinc-400'
                    href='https://github.com/ilkerbalcilar/tailwindcss-hitslop'
                >
                    GitHub
                </a>
                <span className='mx-3'>·</span>
                MIT © İlker Balcılar
            </footer>
        </main>
    )
}
