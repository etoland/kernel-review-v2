export interface Director {
    id: string
    name: string
    email: string
    phone: string
    title?: string
  }
  
  export interface Location {
    id: string
    name: string
    addressLine1: string
    city: string
    region: string
    postalCode: string
    countryCode: string
  }
  
  export interface Company {
    id: string
    name: string
    legalName: string
    description: string
    websiteUrl: string
    companyStatus: string
    entityType: string
    vertical: string
    subVertical: string
    annualRevenueUsd: number
    fundingStage: string
    ticker: string | null
    stockExchange: string | null
    directors: Director[]
    locations: Location[]
  }
  
  export interface NaicsReference {
    vertical: string
    subVerticals: string[]
  }
  
  export interface ValidationErrors {
    [key: string]: string | ValidationErrors
  }