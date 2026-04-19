import { Company } from '../types'
import { Badge } from './ui/badge'
import { Building2 } from 'lucide-react'
import { formatRevenue } from '../utils/validation'

interface Props {
  companies: Company[]
  selectedId: string
  onSelect: (company: Company) => void
}

export default function CompanyList({ companies, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {companies.map(company => {
        const isSelected = company.id === selectedId
        return (
          <button
            key={company.id}
            type="button"
            onClick={() => onSelect(company)}
            className={`
              w-full text-left px-4 py-4 rounded-xl border transition-all
              ${isSelected
                ? 'bg-indigo-800 border-indigo-700'
                : 'bg-transparent border-indigo-900 hover:bg-indigo-900 hover:border-indigo-800'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                p-1.5 rounded-lg mt-0.5 shrink-0
                ${isSelected ? 'bg-indigo-600' : 'bg-indigo-900'}
              `}>
                <Building2
                  size={12}
                  className={isSelected ? 'text-white' : 'text-indigo-400'}
                />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <span className={`
                  text-sm font-semibold truncate
                  ${isSelected ? 'text-white' : 'text-indigo-200'}
                `}>
                  {company.name}
                </span>
                <span className="text-xs text-indigo-400 truncate">
                  {company.vertical}
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <Badge
                    className={`
                      text-xs px-1.5 py-0 border
                      ${company.companyStatus === 'active'
                        ? 'bg-green-900 text-green-300 border-green-700 hover:bg-green-900'
                        : 'bg-indigo-900 text-indigo-400 border-indigo-700 hover:bg-indigo-900'
                      }
                    `}
                  >
                    {company.companyStatus}
                  </Badge>
                  <span className={`text-xs font-medium ${isSelected ? 'text-indigo-200' : 'text-indigo-400'}`}>
                    {formatRevenue(company.annualRevenueUsd)}
                  </span>
                </div>
                {company.ticker && (
                  <span className="text-xs text-indigo-400 font-mono">
                    {company.ticker} · {company.stockExchange}
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}