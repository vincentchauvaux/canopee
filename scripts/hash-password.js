const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function hashUserPassword() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('❌ Usage: node scripts/hash-password.js <email> <password>')
    console.error('   Exemple: node scripts/hash-password.js etibaliomecus@live.be Patamon1234')
    process.exit(1)
  }

  try {
    console.log(`🔍 Recherche de l'utilisateur ${email}...`)
    
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ Utilisateur ${email} non trouvé`)
      process.exit(1)
    }

    console.log(`🔐 Hashage du mot de passe...`)
    const passwordHash = await bcrypt.hash(password, 10)

    console.log(`💾 Mise à jour de l'utilisateur...`)
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
      },
    })

    console.log(`✅ Mot de passe hashé et mis à jour avec succès pour ${email}`)
    console.log(`   Vous pouvez maintenant vous connecter avec ce mot de passe`)
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

hashUserPassword()

