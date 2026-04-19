import React from 'react'
import { Label } from './ui/label'

interface Props {
  label: string
  error?: string
  hint?: string
  charCount?: { current: number; max: number }
  children: React.ReactNode
}

export default function FormField({ label, error, hint, charCount, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-slate-500">{label}</Label>
        {charCount && (
          <span className={`text-xs ${charCount.current > charCount.max ? 'text-red-500' : 'text-slate-400'}`}>
            {charCount.current} / {charCount.max}
          </span>
        )}
      </div>
      {children}
      {hint && !error && (
        <span className="text-xs text-slate-400">{hint}</span>
      )}
      {error && (
        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
          {error}
        </span>
      )}
    </div>
  )
}