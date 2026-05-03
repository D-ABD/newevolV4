# 🚀 PLAN D'EXÉCUTION SÉQUENCÉ - Semaines 1-2
## Calendrier Visuel + Notifications Push (100% PostgreSQL - Sans Firebase)

**⚠️ RÈGLE D'OR : Ne jamais casser l'app existante**
- Chaque lot est testable indépendamment
- Rollback facile si problème
- L'app reste fonctionnelle à chaque étape

---

## 📦 LOT 1: Foundation Backend (Jours 1-2)
**Objectif :** Préparer le terrain sans toucher au frontend

### Tâches :
1. **[BACKEND] Installer dépendances**
   ```bash
   pip install py-vapid pywebpush django-celery-beat redis psycopg2-binary
   ```

2. **[BACKEND] Créer modèle WebPushKey**
   - Fichier: `api/models.py`
   - Champs: public_key, private_key, created_at
   - Migration: `python manage.py makemigrations && python manage.py migrate`

3. **[BACKEND] Ajouter index de performance**
   - Fichier: `api/models.py` (CalendarEntry)
   - Index: `indexes = [models.Index(fields=['user', 'date'])]`

4. **[BACKEND] Commande pour générer clés VAPID**
   - Fichier: `api/management/commands/generate_vapid_keys.py`
   - Usage: `python manage.py generate_vapid_keys`

5. **[TEST]** Vérifier que l'app démarre toujours
   ```bash
   python manage.py runserver
   npm run dev
   ```

**✅ Critère de succès :** L'app tourne, nouvelles tables créées, aucune erreur

---

## 📦 LOT 2: Signaux Django pour Calendrier (Jours 3-4)
**Objectif :** Automatiser la mise à jour du calendrier

### Tâches :
1. **[BACKEND] Créer signals.py**
   - Fichier: `api/signals.py`
   - Signal 1: Post-save Entry → Créer/Mettre à jour CalendarEntry
   - Signal 2: Post-delete Entry → Mettre à jour CalendarEntry
   - Signal 3: Habit complétée → Mettre à jour CalendarEntry

2. **[BACKEND] Connecter les signals**
   - Fichier: `api/apps.py` (dans `ready()`)
   - Import: `from . import signals`

3. **[BACKEND] Tester manuellement**
   - Créer une entrée via admin Django
   - Vérifier dans DB que CalendarEntry est créé

4. **[BACKEND] Endpoint détail jour**
   - Fichier: `api/views.py`
   - Route: `GET /api/calendar/day/<YYYY-MM-DD>/`
   - Retourne: entries, humeur, habitudes du jour

5. **[BACKEND] URL routing**
   - Fichier: `api/urls.py` ou `backend/urls.py`
   - Ajouter: `path('calendar/day/<str:date>/', DayDetailAPIView.as_view())`

6. **[TEST]** API test avec curl ou Postman
   ```bash
   curl http://localhost:8000/api/calendar/day/2025-01-15/ -H "Authorization: Token XXX"
   ```

**✅ Critère de succès :** Quand je crée une entrée, le calendrier se met à jour auto

---

## 📦 LOT 3: Modal & Interactions Frontend (Jours 5-6)
**Objectif :** Rendre le calendrier interactif

### Tâches :
1. **[FRONTEND] Modal de détail**
   - Fichier: `src/components/VisualCalendar.tsx`
   - Ajouter: État `selectedDay` et modal
   - Au clic sur un jour → Appel API `/api/calendar/day/<date>/` → Affiche modal

2. **[FRONTEND] Tooltips**
   - Utiliser `title` HTML ou librairie légère (tippy.js)
   - Survol d'un jour → Résumé (nb entrées, humeur moyenne)

3. **[FRONTEND] Navigation clavier**
   - Écouter événements `keydown` (flèches gauche/droite)
   - Changer de mois sans cliquer

4. **[FRONTEND] Lien avec EntryForm**
   - Clic sur jour vide → Ouvrir formulaire avec date pré-remplie
   - Modifier `EntryForm.tsx` pour accepter `initialDate` en prop

5. **[TEST]** Navigation complète
   - Cliquer sur jours, naviguer au clavier, ouvrir formulaire

**✅ Critère de succès :** Je peux explorer le calendrier et voir les détails

---

## 📦 LOT 4: Service Worker & Permissions (Jours 7-8)
**Objectif :** Activer les notifications navigateur

### Tâches :
1. **[FRONTEND] Créer Service Worker**
   - Fichier: `public/sw.js`
   - Écouter: `push` et `notificationclick` events
   - Afficher notification quand message reçu

2. **[FRONTEND] Demander permission**
   - Fichier: `src/services/notificationService.ts` (nouveau)
   - Fonction: `requestPermission()` → retourne 'granted'/'denied'
   - Appeler au premier login (ou dans Settings)

3. **[FRONTEND] Générer subscription**
   - Fonction: `subscribeToPush(vapidPublicKey)`
   - Utilise: `navigator.serviceWorker.ready.pushManager.subscribe()`
   - Retourne: objet subscription (endpoint, keys)

4. **[FRONTEND] UI Settings**
   - Fichier: `src/components/Settings.tsx` (nouveau ou modifier Profile)
   - Toggle: Activer/désactiver notifications
   - Input: Heure de rappel quotidien
   - Bouton: "Tester notification"

5. **[TEST]** Permission accordée, SW enregistré

**✅ Critère de succès :** Le navigateur demande la permission, SW actif

---

## 📦 LOT 5: Backend Notifications (Jours 9-10)
**Objectif :** Recevoir et stocker les subscriptions

### Tâches :
1. **[BACKEND] Modèle NotificationToken (existe déjà ?)**
   - Si n'existe pas: user, subscription_data (JSON), created_at
   - Ou utiliser modèle existant

2. **[BACKEND] Endpoint subscribe**
   - Fichier: `api/views.py`
   - Route: `POST /api/webpush/subscribe/`
   - Body: { subscription: {...} }
   - Action: Créer/mettre à jour token utilisateur

3. **[BACKEND] Endpoint unsubscribe**
   - Route: `POST /api/webpush/unsubscribe/`
   - Action: Supprimer token

4. **[BACKEND] Service d'envoi**
   - Fichier: `api/services.py` (nouveau)
   - Fonction: `send_web_push(user, title, body, data={})`
   - Utilise: `pywebpush.webpush()`
   - Récupère: Clés VAPID depuis modèle WebPushKey

5. **[BACKEND] Endpoint pour récupérer clé publique**
   - Route: `GET /api/webpush/public-key/`
   - Retourne: public_key depuis DB

6. **[TEST]** Subscription fonctionne, clé publique récupérable

**✅ Critère de succès :** Je peux m'abonner, le token est en DB

---

## 📦 LOT 6: Notifications Automatiques (Jours 11-12)
**Objectif :** Envoyer des notifications sans action utilisateur

### Tâches :
1. **[BACKEND] Configurer Celery Beat**
   - Fichier: `backend/settings.py`
   - Ajouter: `INSTALLED_APPS += ['django_celery_beat']`
   - Configurer: `CELERY_BEAT_SCHEDULER`

2. **[BACKEND] Task quotidienne rappels**
   - Fichier: `api/tasks.py` (nouveau)
   - Fonction: `send_daily_reminders()`
   - Logique: Pour chaque user avec reminder_time → envoyer notif

3. **[BACKEND] Trigger badges/objectifs**
   - Dans signals existants (Badge débloqué, Objectif atteint)
   - Appeler: `send_web_push(user, "🎉 Badge débloqué!", ...)`

4. **[BACKEND] Résumé hebdomadaire**
   - Task: `send_weekly_summary()` (chaque dimanche 20h)
   - Calcule: Stats de la semaine → Envoie résumé

5. **[BACKEND] Gestion échecs**
   - Try/except autour de l'envoi
   - Si échec → Supprimer token invalide

6. **[TEST]** Notification manuelle puis automatique

**✅ Critère de succès :** Je reçois une notif automatiquement à l'heure dite

---

## 📦 LOT 7: Filtres & Export (Jours 13-14)
**Objectif :** Finaliser le calendrier

### Tâches :
1. **[FRONTEND] Filtres calendrier**
   - Fichier: `src/components/VisualCalendar.tsx`
   - Select: Par catégorie, par humeur
   - Filtrer les jours affichés

2. **[FRONTEND] Export PDF**
   - Librairie: `jspdf` + `html2canvas`
   - Fonction: `exportCalendarToPDF(month, year)`
   - Capture: Le composant calendrier → Génère PDF

3. **[FRONTEND] Export Image**
   - Même principe → PNG

4. **[BACKEND] Optimisations finales**
   - Vérifier requêtes N+1 avec Django Debug Toolbar
   - Ajouter `select_related` / `prefetch_related` si besoin

5. **[TEST]** Export PDF propre, filtres fonctionnels

**✅ Critère de succès :** Je peux filtrer et exporter mon calendrier

---

## 📦 LOT 8: Tests & Polish (Jour 15)
**Objectif :** Stabiliser avant déploiement

### Tâches :
1. **[GLOBAL] Tests manuels complets**
   - Créer entrée → Calendrier mis à jour
   - S'abonner notifications → Recevoir notif
   - Export PDF → Vérifier rendu
   - Navigation clavier → Flèches fonctionnelles

2. **[GLOBAL] Responsive mobile**
   - Tester sur mobile ou DevTools
   - Ajuster CSS si besoin

3. **[GLOBAL] Accessibilité**
   - Labels ARIA sur boutons
   - Navigation clavier complète

4. **[GLOBAL] Documentation**
   - README.md à jour
   - Comments dans le code

5. **[GLOBAL] Backup**
   - Export SQLite actuel
   - Prêt pour migration PostgreSQL (semaine 3)

**✅ Critère de succès :** Tout fonctionne, aucun bug critique

---

## 🔧 COMMANDES UTILES PAR LOT

### Lot 1
```bash
pip install py-vapid pywebpush django-celery-beat redis psycopg2-binary
python manage.py makemigrations
python manage.py migrate
python manage.py generate_vapid_keys
```

### Lot 2
```bash
python manage.py shell
# Tester création entry manuellement
```

### Lot 3-4
```bash
npm run dev
# Tester dans navigateur
```

### Lot 5
```bash
curl -X POST http://localhost:8000/api/webpush/subscribe/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subscription": {...}}'
```

### Lot 6
```bash
celery -A backend worker --beat --pool=solo
```

---

## 🚨 GESTION DES ERREURS

### Si un lot plante :
1. **Git rollback** : `git checkout .` pour revenir à l'état stable
2. **DB rollback** : `python manage.py migrate api <previous_migration>`
3. **Debug** : Lire logs Django + console navigateur

### Si l'app ne démarre plus :
1. Vérifier migrations : `python manage.py showmigrations`
2. Vérifier imports circulaires
3. Redémarrer serveur proprement

---

## ✅ CHECKLIST FINALE SEMAINES 1-2

- [ ] Lot 1: Foundation OK
- [ ] Lot 2: Signaux OK
- [ ] Lot 3: Modal OK
- [ ] Lot 4: Service Worker OK
- [ ] Lot 5: Endpoints OK
- [ ] Lot 6: Auto notifications OK
- [ ] Lot 7: Filtres + Export OK
- [ ] Lot 8: Tests OK

**🎯 Résultat :** Application enrichie, non cassée, prête pour PostgreSQL

---

## 📅 SEMAINE 3+: ROADMAP COMPLÈTE (Post-Semaines 1-2)

### Semaine 3: Migration PostgreSQL & Performance
- [ ] Installer `psycopg2-binary`, configurer `settings.py`
- [ ] Script de migration SQLite → PostgreSQL
- [ ] Tester en local avec Docker PostgreSQL
- [ ] Installer Redis, configurer cache Django
- [ ] Ajouter pagination sur tous les endpoints liste

### Semaine 4: Tests & Qualité
- [ ] Installer pytest-django, écrire tests unitaires
- [ ] Tests d'intégration API (endpoints critiques)
- [ ] Tests frontend avec Vitest
- [ ] Configurer ESLint, Prettier, Black
- [ ] Setup GitHub Actions pour CI/CD

### Semaines 5-6: Fonctionnalités Sociales
- [ ] Modèle `Friendship` + endpoints amis
- [ ] Fil d'activité des amis
- [ ] Commentaires/likes sur entrées publiques
- [ ] Leaderboard amical

### Semaines 7-8: Multimédia & Rapports
- [ ] Upload photos/audio (stockage local)
- [ ] Galerie média dans les entrées
- [ ] Génération PDF (WeasyPrint)
- [ ] Rapport mensuel automatique par email

### Semaines 9-10: IA & Personnalisation
- [ ] Analyse sentiment (`textblob` ou `vaderSentiment`)
- [ ] Détection tendances humeur
- [ ] Suggestions personnalisées
- [ ] Thèmes personnalisés, upload avatar

### Semaines 11-12: Mobile & Déploiement
- [ ] PWA (manifest.json, offline mode)
- [ ] Responsive complet mobile
- [ ] Dockerfile + docker-compose
- [ ] Déploiement VPS/Cloud
- [ ] Backup automatique PostgreSQL
- [ ] Monitoring (Sentry, logs)

---

## 🎯 FEATURE "KILLER" : Coach IA Personnel
*À développer après stabilisation de la base*
- Analyse tendances 30 jours
- Détection patterns (humeur basse le lundi)
- Suggestions actions concrètes
- Messages encouragement personnalisés
