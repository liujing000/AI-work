import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { expect, it } from 'vitest'

const DIST_ROOT = fileURLToPath(new URL('../dist', import.meta.url))

it('ships install metadata with the built web application', async () => {
  const index = await readFile(join(DIST_ROOT, 'index.html'), 'utf8')
  expect(index).toContain('<link rel="manifest" href="./manifest.webmanifest" />')

  const manifest: unknown = JSON.parse(await readFile(join(DIST_ROOT, 'manifest.webmanifest'), 'utf8'))
  // No `id`: a browser resolves an explicit `id` against the start URL's origin,
  // so only an absent `id`, which defaults to the resolved `start_url`, gives
  // each mount its own identity. `public-mount.e2e.ts` reads the resolved form.
  expect(manifest).toEqual({
    name: 'DeepSeek Harness',
    short_name: 'DSH',
    start_url: './',
    scope: './',
    display: 'fullscreen',
    icons: [{
      src: 'brand-icon.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    }],
  })
})

it('ships the product favicon', async () => {
  const index = await readFile(join(DIST_ROOT, 'index.html'), 'utf8')
  expect(index).toContain('<link rel="icon" type="image/png" href="./favicon.png" />')
  expect((await readFile(join(DIST_ROOT, 'favicon.png'))).length).toBeGreaterThan(0)
})
