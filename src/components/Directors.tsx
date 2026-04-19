import { Director, ValidationErrors } from '../types'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Users, Trash2 } from 'lucide-react'
import { isString, isValidationErrors } from '../utils/validation'

interface Props {
  directors: Director[]
  onChange: (directors: Director[]) => void
  error?: string
  directorErrors: ValidationErrors
}

export default function Directors({ directors, onChange, error, directorErrors }: Props) {
  function update(index: number, field: keyof Director, value: string) {
    const updated = directors.map((d, i) =>
      i === index ? { ...d, [field]: value } : d
    )
    onChange(updated)
  }

  function add() {
    onChange([...directors, {
      id: `DIR-NEW-${Date.now()}`,
      name: '',
      email: '',
      phone: '',
      title: ''
    }])
  }

  function remove(index: number) {
    onChange(directors.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-0">

      {/* section header */}
      <div className="bg-teal-800 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-600 rounded-lg">
            <Users size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Directors</h2>
            <p className="text-xs text-teal-300 mt-0.5">
              {directors.length} director{directors.length !== 1 ? 's' : ''} on record
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={add}
          className="text-xs bg-teal-700 hover:bg-teal-600 text-white border-teal-600"
        >
          + Add director
        </Button>
      </div>

      {error && (
        <div className="px-8 py-3 bg-red-50 border-b border-red-100">
          <p className="text-xs font-medium text-red-600">{error}</p>
        </div>
      )}

      {directors.map((dir, i) => {
        const dirError = directorErrors[`director_${i}`]
        const dirErrs = isValidationErrors(dirError) ? dirError : null

        return (
          <div key={dir.id} className="border-b border-slate-100 last:border-b-0">
            <div className="grid grid-cols-2 divide-x divide-slate-100">

              {/* left — name and email */}
              <div className="px-8 py-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Director {i + 1}
                  </span>
                  {directors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Name</Label>
                  <Input
                    value={dir.name ?? ''}
                    onChange={e => update(i, 'name', e.target.value)}
                    className="border-slate-200 bg-white focus:border-teal-300 text-sm"
                  />
                  {isString(dirErrs?.name) && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {dirErrs.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Email</Label>
                  <Input
                    value={dir.email ?? ''}
                    onChange={e => update(i, 'email', e.target.value)}
                    className="border-slate-200 bg-white focus:border-teal-300 text-sm"
                  />
                  {isString(dirErrs?.email) && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {dirErrs.email}
                    </span>
                  )}
                </div>
              </div>

              {/* right — title and phone */}
              <div className="px-8 py-6 flex flex-col gap-4 pt-14">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Job title</Label>
                  <Input
                    value={dir.title ?? ''}
                    onChange={e => update(i, 'title', e.target.value)}
                    className="border-slate-200 bg-white focus:border-teal-300 text-sm"
                    placeholder="e.g. CEO, Board Member"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Phone</Label>
                  <Input
                    value={dir.phone ?? ''}
                    onChange={e => update(i, 'phone', e.target.value)}
                    className="border-slate-200 bg-white focus:border-teal-300 text-sm"
                  />
                </div>
              </div>

            </div>
          </div>
        )
      })}

    </div>
  )
}