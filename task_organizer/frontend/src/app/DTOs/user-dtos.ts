export interface LoginRequestDTO {
  username: string
  password: string
}

export interface UserCreateRequestDTO {
  name: string
  username: string
  password: string
}

export interface UserResponse {
  id: number
  name: string
  username: string
}
