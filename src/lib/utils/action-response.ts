export type ActionResponse<T = void> =
  | { success: true;  data: T;      error?: never }
  | { success: false; error: string; data?: never }

export function ok<T>(data: T): ActionResponse<T> {
  return { success: true, data }
}

export function err(error: string): ActionResponse<never> {
  return { success: false, error }
}
