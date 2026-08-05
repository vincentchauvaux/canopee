import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

/**
 * Inscription publique désactivée par défaut (UI masquée).
 * Pour scripts / back-office : ALLOW_PUBLIC_REGISTER=true dans .env
 * ou en-tête x-register-secret = REGISTER_API_SECRET
 */
function isRegistrationAllowed(request: NextRequest): boolean {
  if (process.env.ALLOW_PUBLIC_REGISTER === 'true') {
    return true
  }
  const secret = process.env.REGISTER_API_SECRET
  if (secret && request.headers.get('x-register-secret') === secret) {
    return true
  }
  return false
}

export async function POST(request: NextRequest) {
  try {
    if (!isRegistrationAllowed(request)) {
      return NextResponse.json(
        {
          error:
            "L'inscription publique est désactivée. Contactez l'administrateur.",
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe (coût bcrypt 12)
    const passwordHash = await bcrypt.hash(validatedData.password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName || null,
        lastName: validatedData.lastName || null,
        authProvider: 'local',
        role: 'user',
      },
    })

    return NextResponse.json(
      {
        message: 'Compte créé avec succès',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}
