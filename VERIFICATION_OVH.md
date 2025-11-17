# 🔍 Guide de Vérification - Configuration OVH

Ce guide vous aide à vérifier ce que vous avez déjà configuré dans OVH et ce qu'il vous reste à faire.

## 📋 Checklist de Vérification

### 1. 🌐 Vérifier votre espace client OVH

**Accédez à votre espace client OVH** : https://www.ovh.com/manager/

Connectez-vous avec vos identifiants OVH.

---

### 2. 📦 Vérifier le Pack Starter OVH

**Où vérifier** : Dans votre espace client OVH → **Hébergements** → **Pack Starter**

**À vérifier** :
- [ ] Le Pack Starter est-il activé ?
- [ ] Quel est le nom du Pack Starter ? (ex: `ns123456.ip-xxx-xxx-xxx.eu`)
- [ ] Le domaine `canopee.be` est-il associé au Pack Starter ?

**Note** : Le Pack Starter n'est **PAS nécessaire** pour cette application Next.js. Il est optionnel et ne sera pas utilisé.

---

### 3. 🖥️ Vérifier le VPS OVH

**Où vérifier** : Dans votre espace client OVH → **Bare Metal Cloud** → **VPS**

**À vérifier** :
- [ ] Avez-vous un VPS activé ?
- [ ] Si oui, quel est le nom du VPS ? (ex: `vps-123456.vps.ovh.net`)
- [ ] Quelle est l'**IP publique** du VPS ?
- [ ] Quel est le **système d'exploitation** installé ? (Ubuntu 22.04 recommandé)
- [ ] Avez-vous accès SSH au VPS ?

**Si vous n'avez PAS de VPS** :
- Vous devez en commander un
- Recommandation : **VPS Essentials 2 vCores / 4 Go RAM / 80 Go SSD**
- Prix : environ 4-5€/mois

**Comment commander un VPS** :
1. Dans votre espace client OVH → **Bare Metal Cloud** → **VPS**
2. Cliquez sur **Commander un VPS**
3. Choisissez **VPS Essentials** ou **VPS Starter**
4. Sélectionnez **Ubuntu 22.04** comme système d'exploitation
5. Validez la commande

---

### 4. 🌍 Vérifier le domaine canopee.be

**Où vérifier** : Dans votre espace client OVH → **Domaines** → **canopee.be**

**À vérifier** :
- [ ] Le domaine `canopee.be` est-il dans votre liste de domaines ?
- [ ] Le domaine est-il actif et renouvelé ?

**Vérifier la configuration DNS** :
1. Allez dans **Zone DNS**
2. Regardez les enregistrements **A** :
   - [ ] Y a-t-il un enregistrement A pour `@` (racine) ?
   - [ ] Y a-t-il un enregistrement A pour `www` ?
   - [ ] Vers quelle IP pointent-ils actuellement ?

**Note** : Actuellement, ils pointent probablement vers le Pack Starter. Il faudra les modifier pour pointer vers l'IP du VPS.

---

### 5. 🗄️ Vérifier la base de données Supabase

**Où vérifier** : https://kzogkberupkzpjdojvhn.supabase.co

**À vérifier** :
- [ ] Pouvez-vous vous connecter au dashboard Supabase ?
- [ ] Avez-vous le **mot de passe** de la base de données ?
- [ ] Où le trouver : **Settings** → **Database** → **Database password**

**Récupérer l'URL de connexion** :
1. Allez dans **Settings** → **Database**
2. Cherchez la section **Connection string**
3. Copiez l'URI (format : `postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres`)

---

### 6. 🔐 Vérifier l'accès SSH au VPS

**Si vous avez un VPS**, testez l'accès SSH :

```bash
# Depuis votre machine locale (Terminal)
ssh root@IP_DU_VPS
```

**Remplacez `IP_DU_VPS` par l'IP de votre VPS.**

**Si la connexion fonctionne** :
- ✅ Vous avez accès SSH
- Notez l'IP du VPS pour plus tard

**Si la connexion échoue** :
- Vérifiez que vous avez les identifiants SSH (mot de passe ou clé SSH)
- Vérifiez que le VPS est bien démarré dans l'espace client OVH

---

### 7. 📝 Résumé de ce que vous avez

Remplissez ce tableau pour savoir où vous en êtes :

| Élément | Statut | Détails |
|---------|--------|---------|
| **Pack Starter OVH** | ☐ Oui / ☐ Non | Nom : _______________ |
| **VPS OVH** | ☐ Oui / ☐ Non | IP : _______________ |
| **Domaine canopee.be** | ☐ Oui / ☐ Non | Actif : ☐ Oui / ☐ Non |
| **Accès SSH au VPS** | ☐ Oui / ☐ Non | Testé : ☐ Oui / ☐ Non |
| **Base de données Supabase** | ☐ Oui / ☐ Non | Mot de passe : ☐ Oui / ☐ Non |
| **URL Supabase** | ☐ Oui / ☐ Non | Copiée : ☐ Oui / ☐ Non |

---

## 🎯 Prochaines Étapes selon votre Situation

### Situation A : Vous avez TOUT

✅ Pack Starter (optionnel, pas nécessaire)
✅ VPS OVH avec accès SSH
✅ Domaine canopee.be
✅ Base de données Supabase configurée

**→ Vous pouvez passer directement à l'installation automatique !**

Voir : [GUIDE_INSTALLATION_VPS.md](./GUIDE_INSTALLATION_VPS.md)

---

### Situation B : Vous avez le VPS mais pas d'accès SSH

✅ VPS OVH
❌ Accès SSH

**Actions** :
1. Dans l'espace client OVH → **Bare Metal Cloud** → **VPS** → Votre VPS
2. Allez dans l'onglet **Informations**
3. Notez l'**IP publique**
4. Allez dans l'onglet **Accès** ou **SSH**
5. Récupérez le **mot de passe root** ou configurez une **clé SSH**

**Pour réinitialiser le mot de passe root** :
- Dans l'espace client OVH → Votre VPS → **Réinitialiser le mot de passe root**
- Vous recevrez le nouveau mot de passe par email

---

### Situation C : Vous n'avez PAS de VPS

❌ VPS OVH

**Actions** :
1. **Commander un VPS** :
   - Espace client OVH → **Bare Metal Cloud** → **VPS** → **Commander un VPS**
   - Choisissez **VPS Essentials 2 vCores / 4 Go RAM** (recommandé)
   - Système : **Ubuntu 22.04 LTS**
   - Validez la commande

2. **Attendre l'activation** (quelques minutes)

3. **Récupérer les informations** :
   - IP publique du VPS
   - Mot de passe root (envoyé par email)

4. **Tester l'accès SSH** :
   ```bash
   ssh root@IP_DU_VPS
   ```

5. **Puis passer à l'installation automatique**

---

### Situation D : Vous n'avez PAS le domaine canopee.be

❌ Domaine canopee.be

**Actions** :
1. **Commander le domaine** :
   - Espace client OVH → **Domaines** → **Commander un domaine**
   - Recherchez `canopee.be`
   - Validez la commande

2. **Attendre l'activation** (quelques heures)

3. **Configurer le DNS** (après avoir configuré le VPS)

---

### Situation E : Vous n'avez PAS accès à Supabase

❌ Base de données Supabase

**Actions** :
1. **Créer un compte Supabase** : https://supabase.com
2. **Créer un nouveau projet** :
   - Nom du projet : `canopee` (ou autre)
   - Mot de passe de la base de données : **Notez-le bien !**
   - Région : Choisissez la plus proche (Europe recommandé)

3. **Récupérer l'URL de connexion** :
   - Settings → Database → Connection string
   - Format : `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`

4. **Appliquer le schéma Prisma** :
   ```bash
   # Sur votre machine locale
   cd /Users/hakou/yoga
   # Mettre à jour DATABASE_URL dans .env.local
   npx prisma migrate deploy
   ```

---

## 🆘 Besoin d'Aide ?

Si vous n'êtes pas sûr de quelque chose :

1. **Prenez des captures d'écran** de votre espace client OVH
2. **Notez les informations** que vous voyez (sans les mots de passe)
3. **Dites-moi** ce que vous voyez et je vous aiderai à identifier ce qui manque

---

## 📞 Support OVH

Si vous avez des questions sur OVH :
- **Documentation OVH** : https://docs.ovh.com/
- **Support OVH** : Via votre espace client → **Support**

---

**Date de création** : $(date)


