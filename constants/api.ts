const authBase = '/api/auth';
export const loginEndpoint = `${authBase}/login`;
export const signUpEndpoint = `${authBase}/sign-up`;
export const logoutEndpoint = `${authBase}/logout`;
export const refreshEndpoint = `${authBase}/refresh`;

const userBase = '/api/user';
export const meEndpoint = `${userBase}/me`;
export const myFullProfileEndpoint = `${userBase}/full-profile`;
export const editProfileEndpoint = `${userBase}/update-profile`;
export const requestUploadAvatarEndpoint = `${userBase}/request-upload-image`;
export const removeAvatarEndpoint = `${userBase}/remove-image?imageType=avatar`;
export const notifyUploadAvatarEndpoint = `${userBase}/notify-upload-image?imageType=avatar`;
export const requestUploadBannerEndpoint = `${userBase}/request-upload-image`;
export const removeBannerEndpoint = `${userBase}/remove-image?imageType=banner`;
export const notifyUploadBannerEndpoint = `${userBase}/notify-upload-image?imageType=banner`

const categoriesBase = '/api/categories';
export const searchCategoriesEndpoint = `${categoriesBase}`;

const musicBase = '/api/music';
export const uploadMusicEndpoint = `${musicBase}/upload`;
export const requestUploadThumbnailEndpoint = (musicId: number) =>
        `${musicBase}/request-upload-image/${musicId}`;
export const removeThumbnailEndpoint = (musicId: number) =>
        `${musicBase}/remove-image/${musicId}`;
export const notifyUploadThumbnailEndpoint = (musicId: number) =>
        `${musicBase}/notify-upload-image/${musicId}`;
export const musicEndpoint = (musicId: number) => `${musicBase}/${musicId}`;
export const requestUploadMusicAudioEndpoint = (musicId: number) =>
        `${musicBase}/request-upload-audio/${musicId}`;
export const notifyUploadMusicAudioEndpoint = (musicId: number) =>
        `${musicBase}/notify-upload-audio/${musicId}`;