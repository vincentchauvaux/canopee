import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { prisma, withRetry } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('[AUTH] Credentials manquants:', {
              hasEmail: !!credentials?.email,
              hasPassword: !!credentials?.password,
            })
            return null
          }

          const user = await withRetry(() =>
            prisma.user.findUnique({
              where: { email: credentials!.email },
            })
          )

          if (!user) {
            console.error('[AUTH] Utilisateur non trouvé:', credentials.email)
            return null
          }

          if (!user.passwordHash) {
            console.error('[AUTH] Utilisateur sans passwordHash:', {
              email: user.email,
              authProvider: user.authProvider,
            })
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

          if (!isValid) {
            console.error('[AUTH] Mot de passe incorrect pour:', credentials.email)
            return null
          }

          console.log('[AUTH] Connexion réussie pour:', credentials.email)
          return {
            id: user.id,
            email: user.email,
            name: user.firstName || user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.profilePic,
            role: user.role,
          }
        } catch (error) {
          console.error('[AUTH] Erreur lors de l\'autorisation:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          const existingUser = await withRetry(() =>
            prisma.user.findUnique({
              where: { email: user.email! },
            })
          )

          if (!existingUser) {
            await withRetry(() => prisma.user.create({
              data: {
                email: user.email!,
                firstName: user.name?.split(' ')[0] || null,
                lastName: user.name?.split(' ').slice(1).join(' ') || null,
                profilePic: user.image || null,
                authProvider: account.provider === 'google' ? 'google' : 'facebook',
                role: 'user',
              },
            }))
          } else {
            await withRetry(() => prisma.user.update({
              where: { id: existingUser.id },
              data: {
                lastLogin: new Date(),
                profilePic: user.image || existingUser.profilePic,
              },
            }))
          }
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      // Si c'est une nouvelle connexion (user est défini)
      if (user) {
        // Pour OAuth (Google/Facebook), récupérer l'utilisateur depuis la DB
        if (account?.provider === 'google' || account?.provider === 'facebook') {
          try {
            const dbUser = await withRetry(() =>
              prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true, role: true },
              })
            )
            if (dbUser) {
              token.id = dbUser.id
              token.role = dbUser.role
            }
          } catch (error) {
            console.error('Error fetching user in JWT callback (OAuth):', error)
          }
        } else {
          // Pour credentials, utiliser directement l'ID de l'utilisateur
          token.id = user.id
          token.role = (user as any).role
        }
      }
      // Ne pas appeler la DB à chaque requête : évite l'erreur Prisma 42P05
      // ("prepared statement already exists") avec le pooler Supabase et permet
      // à la déconnexion de fonctionner correctement. Le rôle est mis à jour à la prochaine connexion.
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Ne pas définir domain : le cookie est lié au host actuel (canopee.be ou xn--...),
        // ce qui permet à la déconnexion de supprimer correctement le cookie.
      },
    },
  },
  events: {
    async signOut() {
      // Déconnexion explicite : le cookie est supprimé par NextAuth
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

