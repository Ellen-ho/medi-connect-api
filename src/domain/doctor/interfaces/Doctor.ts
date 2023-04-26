import { User } from '../../user/User'

interface IAddress {
  line1: string // Street address, P.O. Box, company name, c/o
  line2?: string // Apartment, suite, unit, building, floor, etc.
  city: string // City, town, village, etc.
  stateProvince?: string // State, province, region, etc.
  postalCode?: string // Postal code, ZIP code, etc.
  country: string // Country name or ISO country code
  countryCode: string // ISO country code (2 or 3 characters), optional if using the full country name
}

export interface IDoctorProps {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  gender: GenderType
  aboutMe: string
  languagesSpoken: string[]
  specialties: string[]
  careerStartDate: Date
  officePracticalLocation: IAddress
  education: string[]
  awards: string[] | null
  affiliations: string[] | null
  createdAt: Date
  updatedAt: Date
  user: User
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}

export class Doctor {
  constructor(private readonly props: IDoctorProps) {}

  public get id(): string {
    return this.props.id
  }

  public get avatar(): string | null {
    return this.props.avatar
  }

  public get firstName(): string {
    return this.props.firstName
  }

  public get lastName(): string {
    return this.props.lastName
  }

  public get gender(): GenderType {
    return this.props.gender
  }

  public get aboutMe(): string {
    return this.props.aboutMe
  }

  public get languagesSpoken(): string[] {
    return this.props.languagesSpoken
  }

  public get specialties(): string[] {
    return this.props.specialties
  }

  public get careerStartDate(): Date {
    return this.props.careerStartDate
  }

  public get officePracticalLocation(): IAddress {
    return this.props.officePracticalLocation
  }

  public get education(): string[] {
    return this.props.education
  }

  public get awards(): string[] | null {
    return this.props.awards
  }

  public get affiliations(): string[] | null {
    return this.props.affiliations
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get user(): User {
    return this.props.user
  }
}
