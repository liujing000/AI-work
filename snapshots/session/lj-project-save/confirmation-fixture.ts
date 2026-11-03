/** Deterministic user confirmation for a recorded lj tool proposal. */
import type { Context } from '@deepseek-ai/cordis'
import { basename, dirname } from 'node:path'
import { ljFiles } from '../../../packages/bundle/web-app/src/lj-files.ts'
import { ljProposals, installljProposals } from '../../../packages/bundle/web-app/src/lj-proposals.ts'

/**
 * Install deterministic user confirmation for this snapshot fixture.
 * @param ctx - shipped profile context; the fixture alone supplies the user's affirmative decision.
 */
export function apply(ctx: Context): void {
  const cwd = process.cwd()
  const proposals = new ljProposals(new ljFiles(dirname(cwd)))
  installljProposals(ctx, proposals)
  ctx.effect(() => {
    let running = false
    const timer = setInterval(() => {
      if (running) return
      running = true
      void proposals.list().then(async items => {
        const pending = items.find(item => item.project === basename(cwd) && item.status === 'pending')
        if (pending !== undefined) await proposals.decide(pending.id, true)
      }).catch((error: unknown) => { console.warn('lj fixture confirmation:', error) }).finally(() => { running = false })
    }, 100)
    return () => { clearInterval(timer) }
  }, 'lj fixture: deterministic confirmation')
}
