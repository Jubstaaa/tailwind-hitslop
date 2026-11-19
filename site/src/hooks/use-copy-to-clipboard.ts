import { useCallback, useEffect, useRef, useState } from 'react'

const FEEDBACK_MS = 1500

export function useCopyToClipboard() {
    const [copied, setCopied] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

    useEffect(() => () => clearTimeout(timer.current), [])

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (error) {
            // Denied permission or an insecure context: no "copied" feedback,
            // and the text stays on screen to select by hand.
            console.error('Copying to the clipboard failed', error)
            return
        }
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), FEEDBACK_MS)
    }, [])

    return { copied, copy }
}
