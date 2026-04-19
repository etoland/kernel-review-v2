import { useState, useRef } from 'react'
import { Company, NaicsReference, ValidationErrors } from '../types'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Building2, ChevronDown, ChevronUp } from 'lucide-react'
import { formatRevenue, isString } from '../utils/validation'
import SectionPanel from './SectionPanel'
import FormField from './FormField'

const FUNDING_STAGES = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c', label: 'Series C' },
  { value: 'series-d', label: 'Series D' },
  { value: 'series-e', label: 'Series E' },
  { value: 'public', label: 'Public' },
]

const COMPANY_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'acquired', label: 'Acquired' },
  { value: 'dissolved', label: 'Dissolved' },
]

interface Props {
  company: Company
  onChange: (updated: Company) => void
  errors: ValidationErrors
  naicsReference: NaicsReference[]
}

export default function CompanyProfile({ company, onChange, errors, naicsReference }: Props) {
  const [showMore, setShowMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedSector = naicsReference.find(n => n.vertical === company.vertical)
  const subVerticals = selectedSector?.subVerticals ?? []

  function set(field: keyof Company, value: string | number | null) {
    onChange({ ...company, [field]: value })
  }

  return (
    <div ref={containerRef} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

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

      {/* row 1 — key information + reference data */}
      <div className="grid grid-cols-2 divide-x divide-slate-100">

        <SectionPanel title="Key information" description="Core identifiers for this record">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Name" error={isString(errors.name) ? errors.name : undefined}>
                <Input
                  value={company.name ?? ''}
                  onChange={e => set('name', e.target.value)}
                  className="border-slate-200 focus:border-indigo-300 text-sm font-medium"
                />
              </FormField>

              <FormField label="Legal name" error={isString(errors.legalName) ? errors.legalName : undefined}>
                <Input
                  value={company.legalName ?? ''}
                  onChange={e => set('legalName', e.target.value)}
                  className="border-slate-200 focus:border-indigo-300 text-sm font-medium"
                />
              </FormField>
            </div>

            <FormField
              label="Description"
              charCount={{ current: company.description?.length ?? 0, max: 500 }}
            >
              <Textarea
                value={company.description ?? ''}
                onChange={e => set('description', e.target.value)}
                className="border-slate-200 focus:border-indigo-300 text-sm resize-none"
                rows={4}
              />
            </FormField>
          </div>
        </SectionPanel>

        <SectionPanel title="Reference data" description="Industry classification and company web presence">
          <div className="flex flex-col gap-4">

            <FormField label="Vertical" error={isString(errors.vertical) ? errors.vertical : undefined}>
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
            </FormField>

            <FormField label="Sub-vertical" error={isString(errors.subVertical) ? errors.subVertical : undefined}>
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
            </FormField>

            <FormField label="Website" error={isString(errors.websiteUrl) ? errors.websiteUrl : undefined}>
              <Input
                value={company.websiteUrl ?? ''}
                onChange={e => set('websiteUrl', e.target.value)}
                placeholder="https://example.com"
                className="border-slate-200 focus:border-indigo-300 text-sm"
              />
            </FormField>

          </div>
        </SectionPanel>

      </div>

      {/* show more button — only visible when collapsed */}
      {!showMore && (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="w-full flex items-center justify-center gap-2 px-8 py-3 border-t border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <span className="text-xs font-medium text-indigo-600">Show more details</span>
          <ChevronDown size={14} className="text-indigo-600" />
        </button>
      )}

      {/* expandable — company details + public fields */}
      {showMore && (
        <>
          <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">

            <SectionPanel title="Company details" description="Status, structure and financials">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Status">
                    <Select value={company.companyStatus} onValueChange={val => set('companyStatus', val)}>
                      <SelectTrigger className="border-slate-200 text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Entity type">
                    <Input
                      value={company.entityType ?? ''}
                      onChange={e => set('entityType', e.target.value)}
                      className="border-slate-200 focus:border-indigo-300 text-sm"
                    />
                  </FormField>
                </div>

                <FormField label="Funding stage">
                  <Select value={company.fundingStage} onValueChange={val => set('fundingStage', val)}>
                    <SelectTrigger className="border-slate-200 text-sm">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNDING_STAGES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Annual revenue (USD)"
                  hint={company.annualRevenueUsd > 0 ? formatRevenue(company.annualRevenueUsd) : undefined}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                    <Input
                      type="text"
                      value={company.annualRevenueUsd ? Number(company.annualRevenueUsd).toLocaleString('en-US') : ''}
                      onChange={e => {
                        const raw = e.target.value.replace(/[^0-9]/g, '')
                        set('annualRevenueUsd', raw ? Number(raw) : 0)
                      }}
                      className="border-slate-200 focus:border-indigo-300 text-sm pl-7"
                      placeholder="0"
                    />
                  </div>
                </FormField>
              </div>
            </SectionPanel>

            {company.fundingStage === 'public' ? (
              <SectionPanel title="Public company fields" description="Required for publicly listed companies">
                <div className="flex flex-col gap-4">
                  <FormField label="Ticker" error={isString(errors.ticker) ? errors.ticker : undefined}>
                    <Input
                      value={company.ticker ?? ''}
                      onChange={e => set('ticker', e.target.value)}
                      className="border-slate-200 focus:border-indigo-300 text-sm font-mono"
                    />
                  </FormField>

                  <FormField label="Stock exchange" error={isString(errors.stockExchange) ? errors.stockExchange : undefined}>
                    <Input
                      value={company.stockExchange ?? ''}
                      onChange={e => set('stockExchange', e.target.value)}
                      className="border-slate-200 focus:border-indigo-300 text-sm"
                    />
                  </FormField>
                </div>
              </SectionPanel>
            ) : (
              <div className="flex flex-col items-center justify-center px-8 py-7 gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Building2 size={16} className="text-slate-300" />
                </div>
                <p className="text-xs text-slate-400 text-center max-w-[180px]">
                  Public company fields appear here when funding stage is set to public
                </p>
              </div>
            )}

          </div>

          {/* show less button — sits at bottom of expanded content */}
          <button
            type="button"
            onClick={() => {
              containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setShowMore(false)
            }}
            className="w-full flex items-center justify-center gap-2 px-8 py-3 border-t border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <span className="text-xs font-medium text-indigo-600">Show less</span>
            <ChevronUp size={14} className="text-indigo-600" />
          </button>
        </>
      )}

    </div>
  )
}