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

const tracksBase = '/api/tracks';
export const uploadTrackEndpoint = `${tracksBase}/upload`;
export const requestUploadThumbnailEndpoint = (trackId: number) =>
        `${tracksBase}/request-upload-image/${trackId}`;
export const removeThumbnailEndpoint = (trackId: number) =>
        `${tracksBase}/remove-image/${trackId}`;
export const notifyUploadThumbnailEndpoint = (trackId: number) =>
        `${tracksBase}/notify-upload-image/${trackId}`;
export const trackEndpoint = (trackId: number) => `${tracksBase}/${trackId}`;
export const requestUploadTrackAudioEndpoint = (trackId: number) =>
        `${tracksBase}/request-upload-audio/${trackId}`;
export const notifyUploadTrackAudioEndpoint = (trackId: number) =>
        `${tracksBase}/notify-upload-audio/${trackId}`;