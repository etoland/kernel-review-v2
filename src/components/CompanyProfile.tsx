import { Company, NaicsReference, ValidationErrors } from '../types'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Building2 } from 'lucide-react'
import { formatRevenue } from '../utils/validation'

interface Props {
  company: Company
  onChange: (updated: Company) => void
  errors: ValidationErrors
  naicsReference: NaicsReference[]
}

export default function CompanyProfile({ company, onChange, errors, naicsReference }: Props) {
  const selectedSector = naicsReference.find(n => n.vertical === company.vertical)
  const subVerticals = selectedSector?.subVerticals ?? []

  function set(field: keyof Company, value: string | number | null) {
    onChange({ ...company, [field]: value })
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* section header */}
      <div className="bg-slate-800 px-8 py-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <Building2 size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Company Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">Review and edit core company information</p>
        </div>
      </div>

      {/* row 1 — key information + industry classification */}
      <div className="grid grid-cols-2 divide-x divide-slate-100">

        {/* key information */}
        <div className="flex flex-col gap-5 px-8 py-7">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-slate-800">Key information</h3>
            <p className="text-xs text-slate-400">Core identifiers for this record</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-500">Name</Label>
                <Input
                  value={company.name ?? ''}
                  onChange={e => set('name', e.target.value)}
                  className="border-slate-200 focus:border-indigo-300 text-sm font-medium"
                />
                {errors.name && (
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    {errors.name as string}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-500">Legal name</Label>
                <Input
                  value={company.legalName ?? ''}
                  onChange={e => set('legalName', e.target.value)}
                  className="border-slate-200 focus:border-indigo-300 text-sm font-medium"
                />
                {errors.legalName && (
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    {errors.legalName as string}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-slate-500">Description</Label>
                <span className={`text-xs ${(company.description?.length ?? 0) > 500 ? 'text-red-500' : 'text-slate-400'}`}>
                  {company.description?.length ?? 0} / 500
                </span>
              </div>
              <Textarea
                value={company.description ?? ''}
                onChange={e => set('description', e.target.value)}
                className="border-slate-200 focus:border-indigo-300 text-sm resize-none"
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-500">Website</Label>
              <Input
                value={company.websiteUrl ?? ''}
                onChange={e => set('websiteUrl', e.target.value)}
                placeholder="https://example.com"
                className="border-slate-200 focus:border-indigo-300 text-sm"
              />
              {errors.websiteUrl && (
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  {errors.websiteUrl as string}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* industry classification */}
        <div className="flex flex-col gap-5 px-8 py-7">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-slate-800">Industry classification</h3>
            <p className="text-xs text-slate-400">NAICS sector and sub-sector assignment</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-500">Vertical</Label>
              <Select
                value={company.vertical}
                onValueChange={val => onChange({ ...company, vertical: val, subVertical: '' })}
              >
                <SelectTrigger className="border-slate-200 text-sm">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {naicsReference.map(n => (
                    <SelectItem key={n.vertical} value={n.vertical}>{n.vertical}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vertical && (
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  {errors.vertical as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-500">Sub-vertical</Label>
              <Select
                value={company.subVertical}
                onValueChange={val => set('subVertical', val)}
                disabled={!company.vertical}
              >
                <SelectTrigger className="border-slate-200 text-sm">
                  <SelectValue placeholder="Select sub-vertical" />
                </SelectTrigger>
                <SelectContent>
                  {subVerticals.map(sv => (
                    <SelectItem key={sv} value={sv}>{sv}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subVertical && (
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  {errors.subVertical as string}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* row 2 — company details + public fields */}
      <div className="grid grid-cols-2 divide-x divide-slate-100">

        {/* company details */}
        <div className="flex flex-col gap-5 px-8 py-7">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold text-slate-800">Company details</h3>
            <p className="text-xs text-slate-400">Status, structure and financials</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-500">Status</Label>
                <Select value={company.companyStatus} onValueChange={val => set('companyStatus', val)}>
                  <SelectTrigger className="border-slate-200 text-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="acquired">Acquired</SelectItem>
                    <SelectItem value="dissolved">Dissolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-500">Entity type</Label>
                <Input
                  value={company.entityType ?? ''}
                  onChange={e => set('entityType', e.target.value)}
                  className="border-slate-200 focus:border-indigo-300 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-500">Funding stage</Label>
              <Select value={company.fundingStage} onValueChange={val => set('fundingStage', val)}>
                <SelectTrigger className="border-slate-200 text-sm">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-seed">Pre-seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c">Series C</SelectItem>
                  <SelectItem value="series-d">Series D</SelectItem>
                  <SelectItem value="series-e">Series E</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-500">Annual revenue (USD)</Label>
              <Input
                type="number"
                value={company.annualRevenueUsd ?? ''}
                onChange={e => set('annualRevenueUsd', Number(e.target.value))}
                className="border-slate-200 focus:border-indigo-300 text-sm"
              />
              {company.annualRevenueUsd > 0 && (
                <span className="text-xs text-slate-400">
                  {formatRevenue(company.annualRevenueUsd)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* public fields or empty state */}
        <div className="flex flex-col gap-5 px-8 py-7">
          {company.fundingStage === 'public' ? (
            <>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold text-indigo-700">Public company fields</h3>
                <p className="text-xs text-slate-400">Required for publicly listed companies</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Ticker</Label>
                  <Input
                    value={company.ticker ?? ''}
                    onChange={e => set('ticker', e.target.value)}
                    className="border-slate-200 focus:border-indigo-300 text-sm font-mono"
                  />
                  {errors.ticker && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {errors.ticker as string}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-slate-500">Stock exchange</Label>
                  <Input
                    value={company.stockExchange ?? ''}
                    onChange={e => set('stockExchange', e.target.value)}
                    className="border-slate-200 focus:border-indigo-300 text-sm"
                  />
                  {errors.stockExchange && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {errors.stockExchange as string}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Building2 size={16} className="text-slate-300" />
              </div>
              <p className="text-xs text-slate-400 text-center max-w-[180px]">
                Public company fields appear here when funding stage is set to public
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}