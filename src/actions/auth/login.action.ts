import { firebase } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';

export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ email, password, remember_me }, { cookies }) => {
    // Cookies
    if (remember_me) {
      cookies.set('email', email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 año,
        path: '/',
      });
    } else {
      cookies.delete('email', {
        path: '/',
      });
    }

    try {
      const result = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );

      // const user = result.user;

      // ⬇️ SAVE PROFILE DATA (avatar included)
      cookies.set(
        'user',
        JSON.stringify({
          name: result.user.displayName ?? '',
          email: result.user.email ?? '',
          avatar: result.user.photoURL ?? '',
        }),
        {
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'lax',
        }
      );

      // return JSON.stringify(user);
      return { ok: true };
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('El mail ya existe');
      }

      console.log(error);
      throw new Error('No se pudo hacer login del usuario');
    }
  },
});
