export type AuthProvider = 'password' | 'google'

export interface User {
  _id?: string
  name?: string
  email: string
  photoUrl?: string
  provider?: AuthProvider
  emailVerified?: boolean
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface LoginPayload extends Record<string, string | number> {
  email: string
  password: string
}

export interface SignupPayload extends Record<string, string | number> {
  name: string
  email: string
  password: string
}

export interface GoogleAuthPayload extends Record<string, string | number> {
  idToken: string
}

export interface LoginResponseData extends AuthTokens {
  user: User
}


