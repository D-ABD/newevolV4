# Application de Suivi Personnel - Full Stack

Cette application est un système complet de suivi personnel avec frontend React/TypeScript et backend Django REST API.

## Technologies utilisées

### Backend
- **Django 5.x** - Framework web Python
- **Django REST Framework** - API REST
- **django-cors-headers** - Support CORS pour le frontend
- **SQLite** - Base de données (par défaut)

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Axios** - Client HTTP
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **Sonner** - Notifications toast

## Installation

### Backend (Django)

1. **Installer les dépendances Python :**
   ```bash
   pip install -r requirements.txt
   ```

2. **Appliquer les migrations :**
   ```bash
   python manage.py migrate
   ```

3. **Créer un superutilisateur (optionnel) :**
   ```bash
   python manage.py createsuperuser
   ```

4. **Lancer le serveur Django :**
   ```bash
   python manage.py runserver
   ```

Le backend sera disponible à : http://localhost:8000

### Frontend (React)

1. **Installer les dépendances Node.js :**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

Le frontend sera disponible à : http://localhost:5173

## Connexion Frontend-Backend

Le frontend est configuré pour se connecter automatiquement au backend Django via l'API REST.

### Configuration API

- **URL de base :** `http://localhost:8000/api`
- **Authentification :** Token-based (via localStorage)
- **CORS :** Configuré pour accepter les requêtes depuis localhost:5173

### Fonctionnalités connectées

Toutes les fonctionnalités de l'application sont maintenant connectées à l'API :

| Fonctionnalité | Endpoint API | Méthode |
|---------------|--------------|---------|
| Entrées de journal | `/api/entries/` | GET, POST, PATCH, DELETE |
| Catégories | `/api/categories/` | GET, POST |
| Profil utilisateur | `/api/profile/me/` | GET, PATCH |
| Badges | `/api/badges/` | GET |
| Objectifs hebdo | `/api/weekly-goals/` | GET, PATCH |
| Succès | `/api/achievements/` | GET |
| Défis | `/api/challenges/` | GET, POST (join) |
| Habitudes | `/api/habits/` | GET, POST, PATCH |
| Analytics | `/api/analytics/` | GET |
| Feed communautaire | `/api/entries/public/` | GET |
| Citations | `/api/quotes/daily/` | GET |

### Gestion d'erreur

Si le backend n'est pas disponible, le frontend utilise des données mockées par défaut pour assurer une expérience utilisateur fluide.

## API Endpoints

L'API complète est documentée à : http://localhost:8000/api/

### Principaux endpoints :

| Endpoint | Méthodes | Description |
|----------|----------|-------------|
| `/api/users/` | GET, POST | Gestion des utilisateurs |
| `/api/categories/` | GET, POST, PUT, DELETE | Catégories d'entrées |
| `/api/entries/` | GET, POST, PUT, DELETE | Entrées de journal |
| `/api/entries/{id}/like/` | POST | Liker une entrée |
| `/api/comments/` | GET, POST, PUT, DELETE | Commentaires |
| `/api/badges/` | GET, POST, PUT, DELETE | Badges utilisateur |
| `/api/achievements/` | GET, POST, PUT, DELETE | Succès/Achievements |
| `/api/weekly-goals/` | GET, POST, PUT, DELETE | Objectifs hebdomadaires |
| `/api/profile/` | GET, POST, PUT, DELETE | Profil utilisateur |
| `/api/challenges/` | GET, POST, PUT, DELETE | Défis |
| `/api/habits/` | GET, POST, PUT, DELETE | Habitudes à suivre |
| `/api/reminders/` | GET, POST, PUT, DELETE | Rappels |
| `/api/quotes/` | GET | Citations (lecture seule) |
| `/api/quotes/random/` | GET | Citation aléatoire |
| `/api/analytics/dashboard/` | GET | Tableau de bord analytique |

## Interface d'administration

L'interface d'administration Django est accessible à : http://localhost:8000/admin/

Utilisez les identifiants du superutilisateur créé pour y accéder.

## Structure du projet

```
/workspace/
├── backend/              # Configuration Django
│   ├── settings.py       # Paramètres du projet
│   ├── urls.py           # URLs principales
│   └── wsgi.py          # WSGI config
├── api/                  # Application API
│   ├── models.py         # Modèles de données
│   ├── serializers.py    # Sérialiseurs DRF
│   ├── views.py          # ViewSets API
│   └── admin.py          # Configuration admin
├── src/                  # Code source React
│   ├── components/       # Composants React
│   ├── services/         # Services API
│   │   └── api.ts        # Client API Axios
│   ├── types.ts          # Types TypeScript
│   └── App.tsx           # Composant principal
├── manage.py             # Script de gestion Django
├── package.json          # Dépendances Node.js
└── requirements.txt      # Dépendances Python
```

## Développement

### Lancer les deux serveurs simultanément

Dans un terminal :
```bash
python manage.py runserver
```

Dans un autre terminal :
```bash
npm run dev
```

### Build de production

```bash
npm run build
```

Les fichiers statiques seront générés dans le dossier `dist/`.

## Authentification

Le système utilise l'authentification par token de Django REST Framework.

- Le token est stocké dans le `localStorage`
- Il est automatiquement inclus dans les en-têtes de requêtes
- Utilisez `/api/auth/login/` pour vous connecter
- Utilisez `/api/auth/register/` pour créer un compte

## Notes

- Les données sont sauvegardées dans la base de données SQLite du backend
- Le localStorage est utilisé comme cache secondaire
- En cas d'indisponibilité du backend, l'application utilise des données mockées
- **Entry** : Entrées de journal avec contenu, humeur, tags
- **Comment** : Commentaires sur les entrées
- **Badge** : Badges gagnés par l'utilisateur
- **Achievement** : Succès et accomplissements
- **WeeklyGoal** : Objectifs hebdomadaires
- **Challenge** : Défis à relever
- **Habit** : Habitudes à suivre quotidiennement/hebdomadairement
- **Reminder** : Rappels et notifications
- **Quote** : Citations inspirantes

## Développement

### Lancer les tests
```bash
python manage.py test
```

### Créer de nouvelles migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

## Licence

MIT
