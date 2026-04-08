import { twMerge } from 'tailwind-merge'

type ClassValue = string | undefined | null | false | Record<string, boolean>

function toClassString(value: ClassValue): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => key)
    .join(' ')
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(inputs.map(toClassString).filter(Boolean).join(' '))
}

