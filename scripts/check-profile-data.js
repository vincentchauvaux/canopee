const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

// Créer une nouvelle instance pour éviter les problèmes de prepared statements
const prisma = new PrismaClient({
  log: ['error'],
})

async function checkProfileData() {
  try {
    console.log('🔍 Vérification des données de profil dans Supabase...\n')

    // Vérifier la connexion
    console.log('1️⃣ Test de connexion à la base de données...')
    await prisma.$connect()
    console.log('   ✅ Connexion réussie\n')

    // Récupérer tous les utilisateurs directement (plus fiable que count)
    console.log('2️⃣ Vérification des utilisateurs...')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePic: true,
        phone: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        authProvider: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    const userCount = users.length
    console.log(`   📊 Nombre total d'utilisateurs : ${userCount}\n`)

    if (userCount === 0) {
      console.log('   ⚠️  Aucun utilisateur trouvé dans la base de données !')
      console.log('   💡 Les utilisateurs doivent être créés via :')
      console.log('      - Inscription sur le site (/auth/signin)')
      console.log('      - Connexion OAuth (Google/Facebook)')
      console.log('      - Script create-admin.js\n')
      return
    }

    // Analyse des données de profil
    console.log('3️⃣ Analyse des données de profil...\n')

    console.log('📋 Détails des utilisateurs :\n')
    console.log('─'.repeat(100))

    users.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`)
      console.log(`   ID          : ${user.id}`)
      console.log(`   Email       : ${user.email}`)
      console.log(`   Prénom      : ${user.firstName || '❌ Non renseigné'}`)
      console.log(`   Nom         : ${user.lastName || '❌ Non renseigné'}`)
      console.log(`   Téléphone   : ${user.phone || '❌ Non renseigné'}`)
      console.log(`   Date naiss. : ${user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '❌ Non renseigné'}`)
      console.log(`   Photo       : ${user.profilePic ? '✅ Présente' : '❌ Non renseignée'}`)
      console.log(`   Rôle        : ${user.role}`)
      console.log(`   Provider    : ${user.authProvider}`)
      console.log(`   Créé le     : ${user.createdAt.toISOString().split('T')[0]}`)
      console.log(`   Dernière co.: ${user.lastLogin ? user.lastLogin.toISOString().split('T')[0] : '❌ Jamais'}`)
    })

    console.log('\n' + '─'.repeat(100))

    // Statistiques
    console.log('\n📊 Statistiques :\n')
    const stats = {
      withFirstName: users.filter(u => u.firstName).length,
      withLastName: users.filter(u => u.lastName).length,
      withPhone: users.filter(u => u.phone).length,
      withDateOfBirth: users.filter(u => u.dateOfBirth).length,
      withProfilePic: users.filter(u => u.profilePic).length,
      completeProfiles: users.filter(u => 
        u.firstName && u.lastName && u.phone && u.dateOfBirth && u.profilePic
      ).length,
    }

    console.log(`   Utilisateurs avec prénom        : ${stats.withFirstName}/${userCount} (${Math.round(stats.withFirstName/userCount*100)}%)`)
    console.log(`   Utilisateurs avec nom          : ${stats.withLastName}/${userCount} (${Math.round(stats.withLastName/userCount*100)}%)`)
    console.log(`   Utilisateurs avec téléphone    : ${stats.withPhone}/${userCount} (${Math.round(stats.withPhone/userCount*100)}%)`)
    console.log(`   Utilisateurs avec date naiss.  : ${stats.withDateOfBirth}/${userCount} (${Math.round(stats.withDateOfBirth/userCount*100)}%)`)
    console.log(`   Utilisateurs avec photo        : ${stats.withProfilePic}/${userCount} (${Math.round(stats.withProfilePic/userCount*100)}%)`)
    console.log(`   Profils complets               : ${stats.completeProfiles}/${userCount} (${Math.round(stats.completeProfiles/userCount*100)}%)`)

    // Vérifier si un utilisateur spécifique existe (pour tester la page profile)
    console.log('\n\n4️⃣ Test de récupération d\'un utilisateur (simulation API /api/profile)...\n')
    
    if (users.length > 0) {
      const testUser = users[0]
      console.log(`   Test avec l'utilisateur : ${testUser.email}`)
      
      const userFromDb = await prisma.user.findUnique({
        where: { id: testUser.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profilePic: true,
          phone: true,
          dateOfBirth: true,
          role: true,
          createdAt: true,
          lastLogin: true,
          authProvider: true,
        },
      })

      if (userFromDb) {
        console.log('   ✅ Utilisateur trouvé dans la base de données')
        console.log('   📦 Données disponibles :')
        console.log(`      - id: ${userFromDb.id ? '✅' : '❌'}`)
        console.log(`      - email: ${userFromDb.email ? '✅' : '❌'}`)
        console.log(`      - firstName: ${userFromDb.firstName ? '✅' : '❌'}`)
        console.log(`      - lastName: ${userFromDb.lastName ? '✅' : '❌'}`)
        console.log(`      - profilePic: ${userFromDb.profilePic ? '✅' : '❌'}`)
        console.log(`      - phone: ${userFromDb.phone ? '✅' : '❌'}`)
        console.log(`      - dateOfBirth: ${userFromDb.dateOfBirth ? '✅' : '❌'}`)
        console.log(`      - role: ${userFromDb.role ? '✅' : '❌'}`)
        console.log(`      - createdAt: ${userFromDb.createdAt ? '✅' : '❌'}`)
        console.log(`      - lastLogin: ${userFromDb.lastLogin ? '✅' : '❌'}`)
      } else {
        console.log('   ❌ Utilisateur non trouvé (problème de requête)')
      }
    }

    // Conclusion
    console.log('\n\n' + '═'.repeat(100))
    console.log('📝 CONCLUSION\n')
    
    if (userCount === 0) {
      console.log('❌ PROBLÈME IDENTIFIÉ : Aucun utilisateur dans la base de données')
      console.log('\n💡 SOLUTIONS :')
      console.log('   1. Créer un utilisateur via l\'inscription sur le site')
      console.log('   2. Utiliser le script create-admin.js pour créer un admin')
      console.log('   3. Vérifier que la migration Prisma a été appliquée : npx prisma migrate deploy')
    } else {
      const hasIncompleteProfiles = stats.completeProfiles < userCount
      
      if (hasIncompleteProfiles) {
        console.log('⚠️  PROFILS INCOMPLETS DÉTECTÉS')
        console.log('\n💡 Les utilisateurs existent mais certains champs sont manquants.')
        console.log('   Cela peut expliquer pourquoi la page profile ne s\'affiche pas correctement.')
        console.log('\n✅ SOLUTIONS :')
        console.log('   1. Les utilisateurs peuvent compléter leur profil via la page /profile')
        console.log('   2. Les champs manquants sont optionnels et n\'empêchent pas l\'affichage')
        console.log('   3. Vérifier les logs de l\'API /api/profile pour voir les erreurs exactes')
      } else {
        console.log('✅ TOUS LES PROFILS SONT COMPLETS')
        console.log('\n💡 Si la page profile ne fonctionne pas, le problème vient probablement de :')
        console.log('   1. La session NextAuth (vérifier les cookies)')
        console.log('   2. La connexion à la base de données (vérifier DATABASE_URL)')
        console.log('   3. Les permissions RLS de Supabase (vérifier Row Level Security)')
      }
    }

    console.log('\n' + '═'.repeat(100))

  } catch (error) {
    console.error('\n❌ ERREUR lors de la vérification :\n')
    console.error(error.message)
    
    if (error.message.includes('P1001')) {
      console.error('\n💡 PROBLÈME DE CONNEXION :')
      console.error('   - Vérifiez que DATABASE_URL est correct dans .env')
      console.error('   - Vérifiez que le mot de passe Supabase est correct')
      console.error('   - Testez : psql "$DATABASE_URL" -c "SELECT version();"')
    } else if (error.message.includes('P2021') || error.message.includes('does not exist')) {
      console.error('\n💡 PROBLÈME DE SCHÉMA :')
      console.error('   - Les tables n\'existent pas dans Supabase')
      console.error('   - Exécutez : npx prisma migrate deploy')
    } else {
      console.error('\n💡 Vérifiez les logs ci-dessus pour plus de détails')
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkProfileData()
