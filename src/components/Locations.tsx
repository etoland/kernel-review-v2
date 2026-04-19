import { Location, ValidationErrors } from '../types'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { MapPin, Trash2 } from 'lucide-react'
import { isString, isValidationErrors } from '../utils/validation'

interface Props {
  locations: Location[]
  onChange: (locations: Location[]) => void
  error?: string
  locationErrors: ValidationErrors
}

export default function Locations({ locations, onChange, error, locationErrors }: Props) {
  function update(index: number, field: keyof Location, value: string) {
    const updated = locations.map((l, i) =>
      i === index ? { ...l, [field]: value } : l
    )
    onChange(updated)
  }

  function add() {
    onChange([...locations, {
      id: `LOC-NEW-${Date.now()}`,
      name: '',
      addressLine1: '',
      city: '',
      region: '',
      postalCode: '',
      countryCode: ''
    }])
  }

  function remove(index: number) {
    onChange(locations.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-0">

      {/* section header */}
      <div className="bg-amber-800 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-600 rounded-lg">
            <MapPin size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Locations</h2>
            <p className="text-xs text-amber-300 mt-0.5">
              {locations.length} location{locations.length !== 1 ? 's' : ''} on record
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={add}
          className="text-xs bg-amber-700 hover:bg-amber-600 text-white border-amber-600"
        >
          + Add location
        </Button>
      </div>

      {error && (
        <div className="px-8 py-3 bg-red-50 border-b border-red-100">
          <p className="text-xs font-medium text-red-600">{error}</p>
        </div>
      )}

      {locations.map((loc, i) => {
        const locError = locationErrors[`location_${i}`]
        const locErrs = isValidationErrors(locError) ? locError : null

        return (
          <div key={loc.id} className="border-b border-slate-100 last:border-b-0">
            <div className="grid grid-cols-2 divide-x divide-slate-100">

              {/* left — name, address, city */}
              <div className="px-8 py-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Location {i + 1}
                  </span>
                  {locations.length > 1 && (
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
                  <Label className="text-xs font-medium text-slate-500">Location name</Label>
                  <Input
                    value={loc.name ?? ''}
                    onChange={e => update(i, 'name', e.target.value)}
                    className="border-slate-200 bg-white focus:border-amber-300 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Address</Label>
                  <Input
                    value={loc.addressLine1 ?? ''}
                    onChange={e => update(i, 'addressLine1', e.target.value)}
                    className="border-slate-200 bg-white focus:border-amber-300 text-sm"
                  />
                  {isString(locErrs?.addressLine1) && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {locErrs.addressLine1}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">City</Label>
                  <Input
                    value={loc.city ?? ''}
                    onChange={e => update(i, 'city', e.target.value)}
                    className="border-slate-200 bg-white focus:border-amber-300 text-sm"
                  />
                  {isString(locErrs?.city) && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {locErrs.city}
                    </span>
                  )}
                </div>
              </div>

              {/* right — region, postal, country */}
              <div className="px-8 py-6 flex flex-col gap-4 pt-14">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Region / State</Label>
                  <Input
                    value={loc.region ?? ''}
                    onChange={e => update(i, 'region', e.target.value)}
                    className="border-slate-200 bg-white focus:border-amber-300 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Postal code</Label>
                  <Input
                    value={loc.postalCode ?? ''}
                    onChange={e => update(i, 'postalCode', e.target.value)}
                    className="border-slate-200 bg-white focus:border-amber-300 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Country code</Label>
                  <Input
                    value={loc.countryCode ?? ''}
                    onChange={e => update(i, 'countryCode', e.target.value.toUpperCase())}
                    placeholder="e.g. US, GB, DE"
                    maxLength={2}
                    className="border-slate-200 bg-white focus:border-amber-300 text-sm"
                  />
                  {isString(locErrs?.countryCode) && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {locErrs.countryCode}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )
      })}

    </div>
  )
}