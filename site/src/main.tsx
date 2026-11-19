import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './app'
import './index.css'

const app = (
    <StrictMode>
        <App />
    </StrictMode>
)

// The build runs this module in Node to prerender the page (see prerender()
// below and vite-prerender-plugin), where there is no document to mount into.
if (typeof window !== 'undefined') {
    const root = document.getElementById('root')
    if (!root) throw new Error('#root is missing from index.html')
    if (import.meta.env.DEV) createRoot(root).render(app)
    else hydrateRoot(root, app)
}

export async function prerender() {
    const { renderToString } = await import('react-dom/server.edge')
    return { html: renderToString(app) }
}
