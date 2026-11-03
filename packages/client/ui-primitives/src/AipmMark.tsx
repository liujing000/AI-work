import type { IconProps } from './icons/props.ts'

/**
 * Render the lj application icon.
 * @param props - Icon size and optional layout class.
 * @returns The aria-hidden product mark; adjacent copy supplies the name.
 */
export function AipmMark({ size = 24, className }: IconProps) {
  return <img width={size} height={size} className={className} src="/brand-icon.png" alt="" aria-hidden="true" />
}
