export const tokenBlacklist = new Set();

export function isTokenBlacklisted(token) {
    return tokenBlacklist.has(token);
}
