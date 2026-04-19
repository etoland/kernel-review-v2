import { describe, it, expect } from 'vitest'
import {
  validateCompany,
  validateDirector,
  validateLocation,
  formatRevenue,
  isString,
  isValidationErrors
} from './validation'
import { Company, Director, Location } from '../types'

const mockNaics = [
  {
    vertical: 'Finance and Insurance',
    subVerticals: [
      'Direct Property and Casualty Insurance Carriers',
      'Insurance Agencies and Brokerages'
    ]
  },
  {
    vertical: 'Manufacturing',
    subVerticals: ['Battery Manufacturing', 'Paint and Coating Manufacturing']
  }
]

const validCompany: Company = {
  id: 'C001',
  name: 'Berkshire Hathaway',
  legalName: 'Berkshire Hathaway Inc.',
  description: 'A holding company.',
  websiteUrl: 'https://www.berkshirehathaway.com',
  companyStatus: 'active',
  entityType: 'Corporation',
  vertical: 'Finance and Insurance',
  subVertical: 'Insurance Agencies and Brokerages',
  annualRevenueUsd: 364482000000,
  fundingStage: 'public',
  ticker: 'BRK.A',
  stockExchange: 'NYSE',
  directors: [
    { id: 'DIR-001', name: 'Warren Buffett', email: 'w@berkshire.com', phone: '555-0001' }
  ],
  locations: [
    { id: 'LOC-001', name: 'HQ', addressLine1: '3555 Farnam St', city: 'Omaha', region: 'NE', postalCode: '68131', countryCode: 'US' }
  ]
}

// ─── validateCompany ────────────────────────────────────────────────

describe('validateCompany', () => {
  it('returns no errors for a valid company', () => {
    const errors = validateCompany(validCompany, mockNaics)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires name', () => {
    const errors = validateCompany({ ...validCompany, name: '' }, mockNaics)
    expect(errors.name).toBeDefined()
  })

  it('requires legalName', () => {
    const errors = validateCompany({ ...validCompany, legalName: '' }, mockNaics)
    expect(errors.legalName).toBeDefined()
  })

  it('validates websiteUrl format if present', () => {
    const errors = validateCompany({ ...validCompany, websiteUrl: 'not-a-url' }, mockNaics)
    expect(errors.websiteUrl).toBeDefined()
  })

  it('allows empty websiteUrl', () => {
    const errors = validateCompany({ ...validCompany, websiteUrl: '' }, mockNaics)
    expect(errors.websiteUrl).toBeUndefined()
  })

  it('requires vertical to match a valid NAICS sector', () => {
    const errors = validateCompany({ ...validCompany, vertical: 'Fake Sector' }, mockNaics)
    expect(errors.vertical).toBeDefined()
  })

  it('requires subVertical to belong to selected vertical', () => {
    const errors = validateCompany({ ...validCompany, subVertical: 'Battery Manufacturing' }, mockNaics)
    expect(errors.subVertical).toBeDefined()
  })

  it('requires ticker when fundingStage is public', () => {
    const errors = validateCompany({ ...validCompany, ticker: '' }, mockNaics)
    expect(errors.ticker).toBeDefined()
  })

  it('requires stockExchange when fundingStage is public', () => {
    const errors = validateCompany({ ...validCompany, stockExchange: '' }, mockNaics)
    expect(errors.stockExchange).toBeDefined()
  })

  it('does not require ticker when fundingStage is not public', () => {
    const errors = validateCompany({
      ...validCompany,
      fundingStage: 'series-a',
      ticker: null,
      stockExchange: null
    }, mockNaics)
    expect(errors.ticker).toBeUndefined()
    expect(errors.stockExchange).toBeUndefined()
  })

  it('requires at least one director', () => {
    const errors = validateCompany({ ...validCompany, directors: [] }, mockNaics)
    expect(errors.directors).toBeDefined()
  })

  it('requires at least one location', () => {
    const errors = validateCompany({ ...validCompany, locations: [] }, mockNaics)
    expect(errors.locations).toBeDefined()
  })

  it('validates nested director errors', () => {
    const errors = validateCompany({
      ...validCompany,
      directors: [{ id: 'DIR-001', name: '', email: '', phone: '' }]
    }, mockNaics)
    expect(errors['director_0']).toBeDefined()
  })

  it('validates nested location errors', () => {
    const errors = validateCompany({
      ...validCompany,
      locations: [{ id: 'LOC-001', name: '', addressLine1: '', city: '', region: '', postalCode: '', countryCode: 'XX' }]
    }, mockNaics)
    expect(errors['location_0']).toBeDefined()
  })
})

// ─── validateDirector ───────────────────────────────────────────────

describe('validateDirector', () => {
  const validDirector: Director = {
    id: 'DIR-001',
    name: 'Warren Buffett',
    email: 'w@berkshire.com',
    phone: '555-0001'
  }

  it('returns no errors for a valid director', () => {
    const errors = validateDirector(validDirector)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires name', () => {
    const errors = validateDirector({ ...validDirector, name: '' })
    expect(errors.name).toBeDefined()
  })

  it('requires email', () => {
    const errors = validateDirector({ ...validDirector, email: '' })
    expect(errors.email).toBeDefined()
  })

  it('validates email format', () => {
    const errors = validateDirector({ ...validDirector, email: 'notanemail' })
    expect(errors.email).toBeDefined()
  })

  it('accepts valid email format', () => {
    const errors = validateDirector({ ...validDirector, email: 'test@example.com' })
    expect(errors.email).toBeUndefined()
  })
})

// ─── validateLocation ───────────────────────────────────────────────

describe('validateLocation', () => {
  const validLocation: Location = {
    id: 'LOC-001',
    name: 'HQ',
    addressLine1: '3555 Farnam St',
    city: 'Omaha',
    region: 'NE',
    postalCode: '68131',
    countryCode: 'US'
  }

  it('returns no errors for a valid location', () => {
    const errors = validateLocation(validLocation)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires addressLine1', () => {
    const errors = validateLocation({ ...validLocation, addressLine1: '' })
    expect(errors.addressLine1).toBeDefined()
  })

  it('requires city', () => {
    const errors = validateLocation({ ...validLocation, city: '' })
    expect(errors.city).toBeDefined()
  })

  it('requires countryCode', () => {
    const errors = validateLocation({ ...validLocation, countryCode: '' })
    expect(errors.countryCode).toBeDefined()
  })

  it('rejects invalid country code', () => {
    const errors = validateLocation({ ...validLocation, countryCode: 'XX' })
    expect(errors.countryCode).toBeDefined()
  })

  it('accepts valid ISO 3166-1 alpha-2 country codes', () => {
    const codes = ['US', 'GB', 'DE', 'FR', 'JP', 'SE']
    codes.forEach(code => {
      const errors = validateLocation({ ...validLocation, countryCode: code })
      expect(errors.countryCode).toBeUndefined()
    })
  })
})

// ─── formatRevenue ──────────────────────────────────────────────────

describe('formatRevenue', () => {
  it('formats billions correctly', () => {
    expect(formatRevenue(364482000000)).toBe('$364.48B')
  })

  it('formats millions correctly', () => {
    expect(formatRevenue(5000000)).toBe('$5.00M')
  })

  it('formats thousands correctly', () => {
    expect(formatRevenue(50000)).toBe('$50.00K')
  })

  it('returns — for zero', () => {
    expect(formatRevenue(0)).toBe('—')
  })
})

// ─── type guards ────────────────────────────────────────────────────

describe('isString', () => {
  it('returns true for strings', () => {
    expect(isString('hello')).toBe(true)
  })

  it('returns false for non-strings', () => {
    expect(isString(123)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString({})).toBe(false)
  })
})

describe('isValidationErrors', () => {
  it('returns true for plain objects', () => {
    expect(isValidationErrors({ name: 'required' })).toBe(true)
  })

  it('returns false for strings', () => {
    expect(isValidationErrors('error')).toBe(false)
  })

  it('returns false for null', () => {
    expect(isValidationErrors(null)).toBe(false)
  })

  it('returns false for arrays', () => {
    expect(isValidationErrors([])).toBe(false)
  })
})