/** Workbench navigation and display preferences; project content stays in real files. */
import { ljZh } from './lj-locales.ts'
/** View invalidation event. */
export const LJ_CHANGE_EVENT = 'aipm-lj-change'
/** Project opening delegated to the workspace owner. */
export const LJ_OPEN_PROJECT_EVENT = 'aipm-open-project'
/** Workspace adoption failure. */
export const LJ_WORKSPACE_ERROR_EVENT = 'aipm-workspace-error'
/** Available workbench pages. */
export type LjPage = 'home' | 'project' | 'documents' | 'templates' | 'trash' | 'settings'
/** Persisted navigation. */
export interface LjView { project: string | null; file: string | null; page?: LjPage; tab?: 'overview' | 'chat' | 'document' }
/** Display preferences independent of document content. */
export interface LjPreferences { remember: boolean; autoOpen: boolean; reduced: boolean; sendMode: 'enter' | 'modEnter' }
const STORAGE_KEY = 'aipm.lj.v1'
const PREF_KEY = 'aipm.lj.preferences.v1'
/**
 * Create first-use navigation.
 * @returns first-use navigation.
 */
export function emptyLjView(): LjView { return { project: null, file: null, page: 'home', tab: 'chat' } }
/**
 * Read locally stored display and input preferences.
 * @returns preferences with defaults for a fresh profile.
 */
export function loadLjPreferences(): LjPreferences {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PREF_KEY) ?? '{}')
    const data = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
    return { remember: data.remember !== false, autoOpen: data.autoOpen !== false, reduced: data.reduced === true, sendMode: data.sendMode === 'modEnter' ? 'modEnter' : 'enter' }
  } catch (error: unknown) { void error; return { remember: true, autoOpen: true, reduced: false, sendMode: 'enter' } }
}
/**
 * Persist and broadcast the selected preferences.
 * @param next - selected preferences.
 */
export function saveLjPreferences(next: LjPreferences): void {
  localStorage.setItem(PREF_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('aipm-preferences-change', { detail: next }))
}
/**
 * Restore valid navigation, including the earlier project-only format.
 * @returns last valid navigation, including the earlier project/file-only format.
 */
export function loadLjView(): LjView {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    if (typeof parsed !== 'object' || parsed === null) return emptyLjView()
    const data = parsed as Record<string, unknown>
    const project = typeof data.project === 'string' && data.project ? data.project : null
    const file = project !== null && typeof data.file === 'string' ? data.file : null
    const page = ['home', 'project', 'documents', 'templates', 'trash', 'settings'].find(item => item === data.page)
    return { project, file, page: page as LjPage | undefined ?? (project === null ? 'home' : 'project'), tab: data.tab === 'overview' || data.tab === 'document' ? data.tab : 'chat' }
  } catch (error: unknown) { void error; return emptyLjView() }
}
/**
 * Persist and broadcast the current navigation.
 * @param next - navigation to remember and broadcast.
 */
export function saveLjView(next: LjView): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(LJ_CHANGE_EVENT))
}
/**
 * Select the approved greeting from the local clock.
 * @param now - local clock.
 * @returns the two approved Chinese greeting variants.
 */
export function ljGreeting(now = new Date()): string { return now.getHours() < 12 ? ljZh.morning : ljZh.afternoon }
