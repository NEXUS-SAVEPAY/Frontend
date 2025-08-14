// src/services/api/token.js
export function setAccessToken(t) { localStorage.setItem('accessToken', t); }
export function getAccessToken() { return localStorage.getItem('accessToken'); }
export function clearAccessToken() { localStorage.removeItem('accessToken'); }
