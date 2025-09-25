export interface ApiSuccess<T> {
  success: true
  message?: string
  data: T
}

export interface ApiError {
  success: false
  error: string
  details?: unknown
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError


