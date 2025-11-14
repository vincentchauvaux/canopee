const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUserRole() {
  const email = process.argv[2] || 'etibaliomecus@live.be'

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    if (!user) {
      console.log(`❌ Utilisateur ${email} non trouvé`)
      process.exit(1)
    }

    console.log(`\n👤 Utilisateur trouvé:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Nom: ${user.firstName || ''} ${user.lastName || ''}`)
    console.log(`   Rôle: ${user.role}`)
    console.log(`   ID: ${user.id}`)
    
    if (user.role !== 'admin') {
      console.log(`\n⚠️  L'utilisateur n'est PAS admin`)
      console.log(`\nPour le mettre en admin, exécutez:`)
      console.log(`   node scripts/create-admin.js ${email}`)
      console.log(`\nOu via SQL:`)
      console.log(`   psql yoga_studio`)
      console.log(`   UPDATE users SET role = 'admin' WHERE email = '${email}';`)
    } else {
      console.log(`\n✅ L'utilisateur est bien admin`)
      console.log(`\n💡 Si vous avez toujours des erreurs 403:`)
      console.log(`   1. Déconnectez-vous du site`)
      console.log(`   2. Reconnectez-vous pour régénérer le token JWT`)
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserRole()

