# Configuration Google OAuth

Pour activer la connexion avec Google, vous devez configurer un projet OAuth dans Google Cloud Console.

## Étapes de configuration

### 1. Créer un projet dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API" (ou utilisez directement l'API OAuth 2.0)

### 2. Créer des identifiants OAuth 2.0

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth client ID**
3. Si c'est la première fois, configurez l'écran de consentement OAuth :
   - Choisissez **External** (pour les tests)
   - Remplissez les informations requises (nom de l'application, email de support, etc.)
   - Ajoutez votre email comme test user
4. Créez l'OAuth client ID :
   - **Application type** : Web application
   - **Name** : Canopée Yoga (ou le nom de votre choix)
   - **Authorized JavaScript origins** :
     - `http://localhost:3000` (pour le développement)
     - `https://votre-domaine.com` (pour la production)
   - **Authorized redirect URIs** :
     - `http://localhost:3000/api/auth/callback/google` (pour le développement)
     - `https://votre-domaine.com/api/auth/callback/google` (pour la production)

### 3. Récupérer les identifiants

Après la création, vous obtiendrez :

- **Client ID** : une longue chaîne de caractères
- **Client Secret** : une autre longue chaîne de caractères

### 4. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet (ou ajoutez ces lignes si le fichier existe déjà) :

```env
GOOGLE_CLIENT_ID=votre-client-id-ici
GOOGLE_CLIENT_SECRET=votre-client-secret-ici
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-nextauth-ici
```

**Important** : Pour générer un `NEXTAUTH_SECRET` sécurisé, utilisez :

```bash
openssl rand -base64 32
```

### 5. Redémarrer le serveur de développement

Après avoir ajouté les variables d'environnement, redémarrez votre serveur Next.js :

```bash
npm run dev
```

## Test

1. Allez sur `http://localhost:3000/auth/signin`
2. Cliquez sur le bouton "Google"
3. Vous devriez être redirigé vers Google pour vous connecter
4. Après autorisation, vous serez redirigé vers votre site et connecté automatiquement

## Dépannage

### Erreur "redirect_uri_mismatch"

- Vérifiez que l'URI de redirection dans Google Cloud Console correspond exactement à `http://localhost:3000/api/auth/callback/google`
- Assurez-vous qu'il n'y a pas d'espace ou de caractère supplémentaire

### Erreur "invalid_client"

- Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont correctement définis dans `.env.local`
- Redémarrez le serveur après avoir modifié `.env.local`

### L'utilisateur n'est pas créé dans la base de données

- Vérifiez les logs du serveur pour voir s'il y a des erreurs
- Assurez-vous que la base de données est accessible et que Prisma est correctement configuré
