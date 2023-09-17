export const decodeJWT = token => {
    const base64 = token.split('.')[1].replace('-', '+').replace('_', '/');
    const decodedJWT = JSON.parse(window.atob(base64));
    return decodedJWT;
}

export const isJwtExpired = payload => {
    console.log("jwtExpiry", Date.now() / 1000 > payload.exp);
    return Date.now() / 1000 > payload.exp
};