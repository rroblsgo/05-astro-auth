import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  type AuthError,
} from 'firebase/auth';
import { firebase } from '@/firebase/config';

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, email, password, remember_me }, { cookies }) => {
    // console.log('Registering user:', { name, email, password, remember_me });
    // cookies
    if (remember_me) {
      cookies.set('email', email, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        path: '/',
      }); // 30 days
    } else {
      cookies.delete('email', { path: '/' });
    }

    // Creación de usuario
    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );

      // actualizar nombre(displayName)
      updateProfile(firebase.auth.currentUser!, {
        displayName: name,
      });

      // verificar email
      await sendEmailVerification(firebase.auth.currentUser!, {
        // url: 'http://localhost:4321/protected?emailVerified=true',
        url: `${import.meta.env.WEBSITE_URL}/protected?emailVerified=true`,
      });

      return JSON.stringify(user);
    } catch (error) {
      console.error('Error creating user:', error);
      const firebaseError = error as AuthError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('El email ya está en uso');
      }
      throw new Error('Error al crear el usuario');
    }
  },
});
