const api_url = process.env.NEXT_PUBLIC_API_URL;

export const auth_endpoints = `${api_url}/auth`;
export const login_endpoint = `${auth_endpoints}/login`;
export const sign_up_endpoint = `${auth_endpoints}/sign-up`;
export const logout_endpoint = `${auth_endpoints}/logout`;
export const refresh_endpoint = `${auth_endpoints}/refresh`;
