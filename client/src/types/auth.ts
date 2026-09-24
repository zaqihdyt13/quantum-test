import { BaseRequest, BaseResponse } from './common'

export interface Auth {
  ownerUser: {
    id: string
    staffId: string
    firstName: string
    lastName: string
    email: string
    username: string
  }
  expiredIn: number
  accessToken: string
  lastLoggedInAt: string
  type: string
}

export interface AuthForm {
  username: string
  password: string
}

export type AuthResponse = BaseResponse<Auth>
export type AuthRequest = BaseRequest<AuthForm>

export interface RegisterForm {
  staffId: string
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
}

export type RegisterRequest = BaseRequest<RegisterForm>

export interface SelfUserResponse {
  data: {
    id: string
    type: string
    attributes: {
      id: string
      username: string
      type: string
    }
  }[]
}
