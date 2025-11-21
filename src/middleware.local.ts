// No funciona por el nombre del archivo
// Demostración de autenticación básica en Astro Middleware

import type { MiddlewareNext } from 'astro';
import { defineMiddleware } from 'astro:middleware';

const privateRoutes = ['/protected'];

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  const authHeaders = request.headers.get('authorization') ?? '';
  console.log('Auth Headers:', authHeaders);

  if (privateRoutes.includes(url.pathname)) {
    return checkLocalAuth(authHeaders, next);
  }

  // In your middleware.ts, add this check:
  if (url.pathname === '/logout') {
    return new Response('Logged out', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  return next();
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (!authHeaders) {
  }
  const authValue = authHeaders.split(' ').at(-1) ?? 'user:pass';
  // const decodedValue = atob(authValue).split(':');
  const decodedValue = Buffer.from(authValue, 'base64')
    .toString('utf-8')
    .split(':');
  const [user, password] = decodedValue;
  console.log('Decoded Auth Value:', decodedValue);

  // Add your authentication logic here
  if (user === 'admin' && password === 'admin') {
    return next();
  }

  return new Response('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  });
};
