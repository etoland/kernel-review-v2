import { Company } from '../types'

export function downloadJson(company: Company): void {
  let data: Partial<Company> = { ...company }

  if (data.fundingStage !== 'public') {
    const { ticker, stockExchange, ...rest } = data
    data = rest
  }

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.name?.replace(/\s+/g, '-').toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
}