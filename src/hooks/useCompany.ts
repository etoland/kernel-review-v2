import { useState } from 'react'
import { Company, ValidationErrors } from '../types'
import { validateCompany } from '../utils/validation'
import { downloadJson } from '../utils/export'
import { toast } from 'sonner'

interface NaicsReference {
  vertical: string
  subVerticals: string[]
}

export function useCompany(initial: Company, naicsReference: NaicsReference[]) {
  const [company, setCompany] = useState<Company>(initial)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  function updateCompany(updated: Company) {
    if (updated.fundingStage !== 'public') {
      updated.ticker = null
      updated.stockExchange = null
    }
    setCompany(updated)
    setHasChanges(true)
    if (submitted) {
      setErrors(validateCompany(updated, naicsReference))
    }
  }

  function handleExport() {
    const errs = validateCompany(company, naicsReference)
    setErrors(errs)
    setSubmitted(true)
    if (Object.keys(errs).length === 0) {
      downloadJson(company)
      toast.success('Export successful', {
        description: `${company.name.toLowerCase().replace(/\s+/g, '-')}.json downloaded`
      })
    } else {
      toast.error('Fix errors before exporting', {
        description: `${Object.keys(errs).length} field${Object.keys(errs).length > 1 ? 's' : ''} need attention`
      })
    }
  }

  function selectCompany(newCompany: Company) {
    setCompany(newCompany)
    setErrors({})
    setSubmitted(false)
    setHasChanges(false)
  }

  return {
    company,
    errors,
    hasChanges,
    updateCompany,
    handleExport,
    selectCompany
  }
}