export const isRequestError = (res: Response): boolean => {
    return res.status < 200 || res.status >= 300;
}