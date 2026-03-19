# Blog Article Management API (Projet L2 - INF222)

Ce projet est une petite API pour gérer des articles de blog. On utilise Node.js avec Express pour le serveur et SQLite pour stocker les données dans un fichier local.

Il y a aussi une interface web simple pour tester tout ça directement dans le navigateur.

## Installation et Lancement

1.  **Installer les dépendances** :
    Il faut avoir Node.js installé. Dans le dossier du projet, lancez :
    ```bash
    npm install
    ```

2.  **Lancer le serveur** :
    On lance le script de démarrage :
    ```bash
    npm start
    ```
    Le serveur sera disponible sur `http://localhost:3000`.

## Les endpoints d'API

Toutes les routes commencent par `/api/articles`.

| Méthode | Route | Description |
| --- | --- | --- |
| **POST** | `/api/articles` | Créer un nouvel article. |
| **GET** | `/api/articles` | Voir tous les articles (ou filtrer par `?category=...`). |
| **GET** | `/api/articles/:id` | Voir les détails d'un seul article par son ID. |
| **GET** | `/api/articles/search` | Chercher un mot dans le titre ou le contenu (`?query=...`). |
| **PUT** | `/api/articles/:id` | Modifier un article existant. |
| **DELETE** | `/api/articles/:id` | Supprimer un article. |

## Exemples d'utilisation

### 1. Endpoint Web ou Interface utilisateur
Il suffit d'ouvrir `http://localhost:3000` dans un navigateur. On peut :
- Cliquer sur **"Nouvel Article"** pour remplir le formulaire.
- Utiliser le menu déroulant pour filtrer par catégorie (Sport, Tech, etc.).
- Utiliser la barre de recherche en haut.
- Cliquer sur **"Suppr."** pour enlever un article (une confirmation s'affiche).

### 2. Documentation Swagger (OpenAPI)
L'API est documentée avec Swagger. Vous pouvez voir tous les endpoints et les tester ici :
- Accédez à `http://localhost:3000/docs` quand le serveur tourne.

### Détails sur les données
Chaque article a :
- Un **titre**, un **auteur**, un **contenu**, une **date** et une **catégorie** (obligatoires).
- Des **tags** (optionnel).

Projet réalisé par Lembou Pharel.
