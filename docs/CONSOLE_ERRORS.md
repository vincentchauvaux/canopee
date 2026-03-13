# Erreurs console fréquentes (et ce qu’elles signifient)

## 1. `GET /favicon.ico 404 (Not Found)`

**Cause :** Le navigateur demande toujours un favicon à la racine. Sans fichier, le serveur renvoie 404.

**Correction dans l’app :** Un favicon (icône feuille 🌿) est défini dans `app/layout.tsx` via une URL data SVG. Le 404 ne devrait plus apparaître après déploiement.

---

## 2. `bootstrap-autofill-overlay-notifications.js … Cannot read properties of null (reading 'includes')`

**Cause :** Bug dans une **extension de navigateur** (gestionnaire de mots de passe / autofill), pas dans le code du site. Le script `bootstrap-autofill-overlay-notifications.js` est fourni par l’extension.

**Que faire :** Rien à changer dans le projet. Vous pouvez :
- ignorer l’erreur, ou
- désactiver l’extension sur ce site, ou
- mettre à jour l’extension si une nouvelle version est disponible.

---

## 3. `The resource <URL> was preloaded using link preload but not used within a few seconds`

**Cause :** Une ressource (police, script, etc.) est préchargée avec `<link rel="preload">` mais n’est pas utilisée tout de suite après le chargement. Souvent lié aux polices Google (`next/font`) ou à des chunks Next.js.

**Que faire :** En général, c’est un avertissement sans impact fonctionnel. Si ça vient de `next/font`, il peut disparaître avec les mises à jour de Next.js. Pas d’action obligatoire côté code.

---

## 4. `GET /api/profile 401 (Unauthorized)` alors que la session existe

**Cause :** Le client a bien une session (ex. `useSession()` affiche l’email), mais l’API route `/api/profile` ne reçoit pas ou ne lit pas correctement le cookie de session (nom du cookie ou domaine).

**Corrections dans l’app :**
- `lib/get-session.ts` : passage de **`cookieName: "next-auth.session-token"`** à `getToken()` pour correspondre au cookie défini dans `lib/auth.ts`.
- En production avec domaine IDN (`canopée.be`), le cookie est défini avec `domain: '.xn--canope-fva.be'` dans `lib/auth.ts`.

Après déploiement : rebuild, redémarrage PM2, puis vider les cookies du site et se reconnecter. Voir [FIX_DOMAIN_PUNYCODE.md](../FIX_DOMAIN_PUNYCODE.md).
