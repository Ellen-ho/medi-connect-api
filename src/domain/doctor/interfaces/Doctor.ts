import { User } from '../../user/User'

export interface IDoctorProps {
  id: string
  avatar: string
  firstname: string
  lastName: string
  gender: GenderType
  aboutMe: string
  basedIn: string
  languagesSpoken: string
  specialties: string
  yearsOfexperience: number
  officePracticalLocation: string
  education: string
  awards: string
  affiliations: string
  //answersProvided: number
  //agreesGiven: number
  //thankYouNotes: number
  //recommendationsCount: number
  //recommendationsContent: string // TODO:modify
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

  public get avatar(): string {
    return this.props.avatar
  }

  public get firstName(): string {
    return this.props.firstname
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

  public get basedIn(): string {
    return this.props.basedIn
  }

  public get languagesSpoken(): string {
    return this.props.languagesSpoken
  }

  public get specialties(): string {
    return this.props.specialties
  }

  public get yearsOfexperience(): number {
    return this.props.yearsOfexperience
  }

  public get officePracticalLocation(): string {
    // TODO:modify
    return this.props.officePracticalLocation
  }

  public get education(): string {
    return this.props.education
  }

  public get awards(): string {
    return this.props.awards
  }

  public get affiliations(): string {
    return this.props.affiliations
  }

  //public get answersProvided(): number {
  //return this.props.answersProvided
  //}

  //public get agreesGiven(): number {
  //return this.props.agreesGiven
  //}

  //public get thankYouNotes(): number {
  //return this.props.thankYouNotes
  //}

  //public get recommendationsCount(): number {
  //return this.props.recommendationsCount
  //}

  //public get recommendationsContent(): string {
  //return this.props.recommendationsContent
  //}

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
