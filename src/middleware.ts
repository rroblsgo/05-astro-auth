import type { MiddlewareNext } from 'astro';
import { defineMiddleware } from 'astro:middleware';
import { firebase } from './firebase/config';

const privateRoutes = ['/protected'];
const notAuthenticatedRoutes = ['/login', '/register'];

export const onRequest = defineMiddleware(
  async ({ url, request, locals, redirect, cookies }, next) => {
    const userCookie = cookies.get('user')?.value;
    if (userCookie) {
      try {
        locals.user = JSON.parse(userCookie);
        locals.isLoggedIn = true;
        console.log('User loaded from cookie:', locals.user);
      } catch (err) {
        locals.user = null;
        locals.isLoggedIn = false;
      }
    } else {
      locals.user = null;
      locals.isLoggedIn = false;
    }
    const isLoggedIn = !!firebase.auth.currentUser;
    // const user = firebase.auth.currentUser;

    locals.isLoggedIn = isLoggedIn;
    // if (user) {
    //   locals.user = {
    //     avatar: user.photoURL ?? '',
    //     email: user.email!,
    //     name: user.displayName!,
    //     emailVerified: user.emailVerified,
    //   };
    // }

    // console.log({ isLoggedIn, user });
    if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
