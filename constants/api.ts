

const authBase = '/api/auth';
export const loginEndpoint = `${authBase}/login`;
export const signUpEndpoint = `${authBase}/sign-up`;
export const logoutEndpoint = `${authBase}/logout`;
export const refreshEndpoint = `${authBase}/refresh`;

const userBase = '/api/user';
export const meEndpoint = `${userBase}/me`;
export const myFullProfileEndpoint = `${userBase}/full-profile`;
export const editProfileEndpoint = `${userBase}/edit-profile`;
export const editAvatarEndpoint = `${userBase}/edit-avatar`;
