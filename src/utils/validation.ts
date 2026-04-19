import { Company, Director, Location, NaicsReference, ValidationErrors } from '../types'

const VALID_COUNTRY_CODES = new Set([
  'AF','AL','DZ','AS','AD','AO','AG','AR','AM','AU','AT','AZ','BS','BH','BD',
  'BB','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','BN','BG','BF','BI','CV',
  'KH','CM','CA','CF','TD','CL','CN','CO','KM','CG','CD','CR','HR','CU','CY',
  'CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','FR',
  'GA','GM','GE','DE','GH','GR','GD','GT','GN','GW','GY','HT','HN','HU','IS',
  'IN','ID','IR','IQ','IE','IL','IT','JM','JP','JO','KZ','KE','KI','KP','KR',
  'KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MG','MW','MY','MV',
  'ML','MT','MH','MR','MU','MX','FM','MD','MC','MN','ME','MA','MZ','MM','NA',
  'NR','NP','NL','NZ','NI','NE','NG','MK','NO','OM','PK','PW','PA','PG','PY',
  'PE','PH','PL','PT','QA','RO','RU','RW','KN','LC','VC','WS','SM','ST','SA',
  'SN','RS','SC','SL','SG','SK','SI','SB','SO','ZA','SS','ES','LK','SD','SR',
  'SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TO','TT','TN','TR','TM','TV',
  'UG','UA','AE','GB','US','UY','UZ','VU','VE','VN','YE','ZM','ZW'
])

export function validateCompany(data: Company, naicsReference: NaicsReference[]): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.name?.trim()) errors.name = 'Company name is required'
  if (!data.legalName?.trim()) errors.legalName = 'Legal name is required'

  if (data.websiteUrl && !/^https?:\/\/.+\..+/.test(data.websiteUrl)) {
    errors.websiteUrl = 'Must be a valid URL (e.g. https://example.com)'
  }

  const validSector = naicsReference.find(n => n.vertical === data.vertical)
  if (!data.vertical) {
    errors.vertical = 'Sector is required'
  } else if (!validSector) {
    errors.vertical = 'Invalid sector selected'
  }

  if (!data.subVertical) {
    errors.subVertical = 'Sub-vertical is required'
  } else if (validSector && !validSector.subVerticals.includes(data.subVertical)) {
    errors.subVertical = 'Sub-vertical must belong to the selected sector'
  }

  if (data.fundingStage === 'public') {
    if (!data.ticker?.trim()) errors.ticker = 'Ticker is required for public companies'
    if (!data.stockExchange?.trim()) errors.stockExchange = 'Stock exchange is required for public companies'
  }

  if (!data.directors || data.directors.length < 1) {
    errors.directors = 'At least one director is required'
  } else {
    data.directors.forEach((dir, i) => {
      const dirErrors = validateDirector(dir)
      if (Object.keys(dirErrors).length > 0) {
        errors[`director_${i}`] = dirErrors
      }
    })
  }

  if (!data.locations || data.locations.length < 1) {
    errors.locations = 'At least one location is required'
  } else {
    data.locations.forEach((loc, i) => {
      const locErrors = validateLocation(loc)
      if (Object.keys(locErrors).length > 0) {
        errors[`location_${i}`] = locErrors
      }
    })
  }

  return errors
}

export function validateDirector(director: Director): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!director.name?.trim()) errors.name = 'Name is required'
  if (!director.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(director.email)) {
    errors.email = 'Invalid email address'
  }
  return errors
}

export function validateLocation(location: Location): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!location.addressLine1?.trim()) errors.addressLine1 = 'Address is required'
  if (!location.city?.trim()) errors.city = 'City is required'

  if (!location.countryCode?.trim()) {
    errors.countryCode = 'Country code is required'
  } else if (!VALID_COUNTRY_CODES.has(location.countryCode.toUpperCase())) {
    errors.countryCode = 'Must be a valid ISO 3166-1 alpha-2 code (e.g. US, GB, DE)'
  }

  return errors
}

export function formatRevenue(value: number): string {
    if (!value) return '—'
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
    return `$${value.toLocaleString()}`
  }

export function isString(value: unknown): value is string {
    return typeof value === 'string'
  }
  
export function isValidationErrors(value: unknown): value is ValidationErrors {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }