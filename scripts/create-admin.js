require('dotenv').config({ path: '.env' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  // Usage: node scripts/create-admin.js [email] [password] [firstName] [lastName]
  // Exemple admin/admin : node scripts/create-admin.js admin@canopee.be admin Admin Admin
  const email = process.argv[2] || 'admin@canopee.be'
  const password = process.argv[3] || 'admin'
  const firstName = process.argv[4] || 'Admin'
  const lastName = process.argv[5] || 'Admin'

  try {
    console.log(`🔍 Recherche de l'utilisateur ${email}...`)
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Mettre à jour le rôle ET le mot de passe (pour pouvoir se connecter en email/mot de passe)
      const passwordHash = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { email },
        data: {
          role: 'admin',
          passwordHash,
          authProvider: 'local',
        },
      })
      console.log(`✅ Utilisateur ${email} mis à jour en admin (mot de passe défini)`)
      console.log(`   Tu peux te connecter avec : ${email} / ${password}`)
    } else {
      // Créer un nouvel utilisateur admin
      const passwordHash = await bcrypt.hash(password, 10)
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: 'admin',
          authProvider: 'local',
        },
      })
      console.log(`✅ Admin créé avec succès !`)
      console.log(`   Email : ${email}`)
      console.log(`   Mot de passe : ${password}`)
      console.log(`   ⚠️  Changez ce mot de passe après la première connexion !`)
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message || error.toString())
    const full = error?.meta?.message || error?.message || (error + '')
    if (full && full !== (error.message || '')) console.error('   Détail:', full)
    if (!process.env.DATABASE_URL) {
      console.error('   💡 DATABASE_URL manquante. Lance le script depuis /var/www/canopee (cd /var/www/canopee) et vérifie le fichier .env')
    } else {
      console.error('   💡 Vérifie que les migrations sont appliquées : npx prisma migrate deploy')
      console.error('   💡 Vérifie que PostgreSQL tourne et que la base existe.')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

