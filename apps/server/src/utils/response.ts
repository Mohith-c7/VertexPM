export function successResponse(message: string, data?: any) {
  return { success: true, message, data: data || {} };
}

export function errorResponse(message: string, code: string, details?: any) {
  return { success: false, message, error: { code, details } };
}
