import { useState } from 'react'
import mockData from './data/mock-data.json'
import { Company, Director, Location } from './types'
import { useCompany } from './hooks/useCompany'
import { isString } from './utils/validation'
import CompanyProfile from './components/CompanyProfile'
import Directors from './components/Directors'
import Locations from './components/Locations'
import CompanyList from './components/CompanyList'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Download, AlertCircle, Building2 } from 'lucide-react'
import { Toaster } from 'sonner'

const companies = mockData.companies as Company[]

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0])
  const [showDirectors, setShowDirectors] = useState(false)
  const [showLocations, setShowLocations] = useState(false)

  const {
    company,
    errors,
    hasChanges,
    updateCompany,
    handleExport,
    selectCompany
  } = useCompany(selectedCompany, mockData.naicsReference)

  function handleSelectCompany(c: Company) {
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Switch company without exporting?'
      )
      if (!confirmed) return
    }
    setSelectedCompany(c)
    selectCompany(c)
    setShowDirectors(false)
    setShowLocations(false)
  }

  const errorCount = Object.keys(errors).length
  const submitted = errorCount > 0

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="top-right" richColors />

      {/* top nav */}
      <nav className="bg-indigo-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-800 p-1.5 rounded-md">
            <Building2 className="text-indigo-200" size={16} />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">kernel.ai</span>
          <span className="text-indigo-600 text-sm">/</span>
          <span className="text-sm text-indigo-300">Company Review Portal</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-900 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
          Record ID: {company.id}
        </div>
      </nav>

      {/* two column layout */}
      <div className="flex min-h-[calc(100vh-52px)]">

        {/* left sidebar — dark */}
        <div className="w-72 shrink-0 bg-indigo-950 border-r border-indigo-900 p-5 flex flex-col gap-3">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest px-2 mb-1">
            Companies
          </p>
          <CompanyList
            companies={companies}
            selectedId={company.id}
            onSelect={handleSelectCompany}
          />
        </div>

        {/* right — main content with fade on company switch */}
        <div key={company.id} className="flex-1 overflow-auto company-detail">

          {/* company hero banner */}
          <div className="bg-white border-b border-slate-200 px-10 py-8">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2.5 rounded-xl">
                    <Building2 size={20} className="text-indigo-700" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                      {company.name}
                    </h1>
                    <p className="text-sm text-slate-400 mt-0.5">{company.legalName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                    {company.companyStatus}
                  </Badge>
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50">
                    {company.fundingStage}
                  </Badge>
                  {company.fundingStage === 'public' && company.ticker && (
                    <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 font-mono">
                      {company.ticker} · {company.stockExchange}
                    </Badge>
                  )}
                  <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">
                    {company.vertical}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <Button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-indigo-900 hover:bg-indigo-800 text-white px-5"
                >
                  <Download size={14} />
                  Save & Export
                </Button>
                <span className="text-xs text-slate-400">
                  Validates and downloads as JSON
                </span>
              </div>
            </div>
          </div>

          {/* main content area */}
          <div className="px-10 py-8 flex flex-col gap-5">

            {/* error banner */}
            {submitted && errorCount > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>
                  Fix <strong>{errorCount}</strong> error{errorCount > 1 ? 's' : ''} before exporting
                </span>
              </div>
            )}

            {/* company profile */}
            <CompanyProfile
              company={company}
              onChange={updateCompany}
              errors={errors}
              naicsReference={mockData.naicsReference}
            />

            {/* directors — collapsible */}
            <div className="rounded-xl border border-teal-100 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setShowDirectors(v => !v)}
                aria-expanded={showDirectors}
                aria-controls="directors-panel"
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-teal-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                  <span className="text-sm font-semibold text-slate-700">Directors</span>
                  <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">
                    {company.directors.length}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {showDirectors ? '▲ collapse' : '▼ expand'}
                </span>
              </button>
              {showDirectors && (
                <div id="directors-panel" className="border-t border-teal-100">
                  <Directors
                    directors={company.directors}
                    onChange={(dirs: Director[]) => updateCompany({ ...company, directors: dirs })}
                    error={isString(errors.directors) ? errors.directors : undefined}
                    directorErrors={errors}
                  />
                </div>
              )}
            </div>

            {/* locations — collapsible */}
            <div className="rounded-xl border border-amber-100 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setShowLocations(v => !v)}
                aria-expanded={showLocations}
                aria-controls="locations-panel"
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span className="text-sm font-semibold text-slate-700">Locations</span>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                    {company.locations.length}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {showLocations ? '▲ collapse' : '▼ expand'}
                </span>
              </button>
              {showLocations && (
                <div id="locations-panel" className="border-t border-amber-100">
                  <Locations
                    locations={company.locations}
                    onChange={(locs: Location[]) => updateCompany({ ...company, locations: locs })}
                    error={isString(errors.locations) ? errors.locations : undefined}
                    locationErrors={errors}
                  />
                </div>
              )}
            </div>

            {/* footer */}
            <div className="mt-4 text-center text-xs text-slate-400">
              Changes are applied client-side · Export to save your updates
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}