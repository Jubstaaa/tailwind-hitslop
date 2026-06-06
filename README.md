# tailwind-hitslop

[![npm](https://img.shields.io/npm/v/tailwind-hitslop)](https://www.npmjs.com/package/tailwind-hitslop)
[![ci](https://github.com/Jubstaaa/tailwind-hitslop/actions/workflows/ci.yml/badge.svg)](https://github.com/Jubstaaa/tailwind-hitslop/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/tailwind-hitslop)](./LICENSE)

Hit-slop utilities for Tailwind CSS v4 (and v3 via plugin) — invisibly expand an
element's touch area while its visual size stays exactly the same. The web
equivalent of React Native's [`hitSlop`](https://reactnative.dev/docs/pressable#hitslop).

Pure CSS. Zero JavaScript. Zero config.

**[Live demo →](https://tailwind-hitslop.vercel.app)**

```html
<button class="pointer-coarse:hit-slop-2">
    <x-icon class="size-4" />
</button>
```

## Install

```bash
npm install tailwind-hitslop
# or
bun add tailwind-hitslop
```

**Tailwind v4** — import the CSS (pure CSS, zero JavaScript):

```css
@import 'tailwindcss';
@import 'tailwind-hitslop';
```

**Tailwind v3** — register the plugin:

```js
// tailwind.config.js
module.exports = {
    plugins: [require('tailwind-hitslop')],
}
```

Same package name on both — the export map resolves the CSS for `@import` and the
plugin for `require`. Every utility below works identically on either version.

## Why

Small visual targets (16px icons, dense toolbars) are miserable to tap. Making
them visually bigger isn't always an option. Hit-slop expands the *interactive*
area without touching layout — the [Fitts' Law](https://en.wikipedia.org/wiki/Fitts%27s_law)
fix designers actually approve.

## API

| Class | Effect |
| --- | --- |
| `hit-slop` | 8px on all sides (`--spacing(2)`) |
| `hit-slop-<n>` | Spacing scale: `hit-slop-2` = 8px, `hit-slop-3.5` = 14px |
| `hit-slop-[10px]` | Arbitrary length |
| `hit-slop-t-*` `-r-*` `-b-*` `-l-*` | Single side |
| `hit-slop-x-*` `hit-slop-y-*` | Axis — stack freely: `hit-slop-x-1 hit-slop-y-3` |
| `hit-slop-after`, `hit-slop-after-*` ... | Full mirror rendered via `::after` (when your `::before` is taken) |
| `hit-slop-debug`, `hit-slop-after-debug` | Visualize the expanded areas |

All utilities compose with every core variant:

```html
<button class="pointer-coarse:hit-slop-2">touch devices only</button>
<button class="any-pointer-coarse:hit-slop-2">incl. touch laptops</button>
<button class="md:hit-slop-0 hit-slop-3">smaller on desktop</button>
```

### Theme tokens (optional)

Define tokens in the `--hit-slop-*` namespace and matching classes appear:

```css
@theme {
    --hit-slop-row: 6px;
}
```

```html
<button class="hit-slop-row">…</button>
```

No tokens defined → no named classes generated. Numbers and arbitrary values
always work.

### Touch-first setup (optional)

Utilities apply on every pointer by default — a mouse user benefits from a
forgiving click area too. If you want slop only on touch devices across your
project without repeating `pointer-coarse:` everywhere, define a short custom
variant once:

```css
@custom-variant touch {
    @media (any-pointer: coarse) {
        @slot;
    }
}
```

```html
<button class="touch:hit-slop-2">only when a coarse pointer exists</button>
```

`any-pointer: coarse` also covers touchscreen laptops; use `pointer: coarse`
instead if you only care about touch-primary devices.

## How much slop, when?

- **`hit-slop-1` (4px)** — dense, adjacent targets (toolbars, list rows with
  multiple actions). Keep slops from overlapping neighbors.
- **`hit-slop-2` (8px)** — the default. Isolated buttons, icon buttons, chips.
- **`hit-slop-3` (12px)** — a lone action in a row (a single ✕ in a card
  corner, a standalone toggle).

Wrap in `pointer-coarse:` unless you want it on mouse users too.

## Gotchas (read this)

1. **Ancestor `overflow: hidden` clips the slop silently.** Cards, modals and
   scroll containers are the usual suspects. Toggle `hit-slop-debug` and look.
2. **The main family uses `::before`.** If your element already uses
   `::before` (icon fonts, rings, gradients), switch to the `hit-slop-after-*`
   family. Both families coexist on one element.
3. **Adjacent slops overlap.** DOM order decides who wins the overlap zone.
   In dense layouts use `hit-slop-1` and keep real spacing between targets.
4. **This does not make WCAG audits pass.** WCAG 2.5.8 target-size checks
   measure the rendered box — an invisible hit area doesn't change that. If
   you need audit compliance, use `min-h-11 min-w-11`; hit-slop improves
   real-world ergonomics and combines fine with it.
5. **`pointer-events-none` on the host disables the slop too** — by design,
   so disabled buttons don't keep ghost tap areas.

## Prior art

- React Native's [`hitSlop`](https://reactnative.dev/docs/pressable#hitslop) — the namesake
- Ahmad Shadeed, [Enhancing the Clickable Area Size](https://ishadeed.com/article/clickable-area/)
- Tailwind core feature request [#18091](https://github.com/tailwindlabs/tailwindcss/issues/18091) — if the core team ever wants this upstream, the CSS is right here
- Kian Bazza's [hit-area](https://bazza.dev/craft/2026/hit-area) — a parallel take on the same technique

## License

MIT © İlker Balcılar
