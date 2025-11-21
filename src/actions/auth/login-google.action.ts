import { firebase } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export const loginWithGoogle = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async (credentials, { cookies }) => {
    const credential = GoogleAuthProvider.credentialFromResult(credentials);

    if (!credential) {
      throw new Error('Google SignIn falló');
    }

    const result = await signInWithCredential(firebase.auth, credential);
    const user = result.user;

    // ⬇️ SAVE PROFILE DATA (avatar included)
    cookies.set(
      'user',
      JSON.stringify({
        name: user.displayName ?? '',
        email: user.email ?? '',
        avatar: user.photoURL ?? '',
      }),
      {
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
      }
    );

    return { ok: true };
  },
});
