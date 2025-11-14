import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { prisma } from './prisma'
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
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.firstName || user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.profilePic,
          role: user.role,
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
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                firstName: user.name?.split(' ')[0] || null,
                lastName: user.name?.split(' ').slice(1).join(' ') || null,
                profilePic: user.image || null,
                authProvider: account.provider === 'google' ? 'google' : 'facebook',
                role: 'user',
              },
            })
          } else {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                lastLogin: new Date(),
                profilePic: user.image || existingUser.profilePic,
              },
            })
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
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email! },
              select: { id: true, role: true },
            })
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
      
      // Toujours récupérer le rôle depuis la DB pour s'assurer qu'il est à jour
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          })
          if (dbUser) {
            token.role = dbUser.role
          }
        } catch (error) {
          console.error('Error fetching user role in JWT callback:', error)
        }
      }
      
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
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

