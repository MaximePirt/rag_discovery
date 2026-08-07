# RAG Discovery

Projet d’exploration et d’apprentissage autour du **RAG** (*Retrieval-Augmented Generation*).

L’objectif est de comprendre et mettre en œuvre les principales étapes d’un pipeline RAG : ingestion de documents, découpage du contenu, vectorisation, recherche sémantique et génération de réponses enrichies par un contexte pertinent.

> Un système RAG permet à un modèle de langage de répondre à partir de documents fournis, plutôt que de se baser uniquement sur ses connaissances générales.


Le programme lit les documents du dossier `documents/`, les découpe en chunks, construit un index en mémoire et affiche les extraits les plus pertinents pour une requête fournie en ligne de commande.

## Prérequis

- Node.js 20 ou supérieur
- npm

## Installation

```bash
git clone https://github.com/MaximePirt/rag_discovery.git
cd rag-discovery
npm install
```

## Utilisation

Ajoutez des fichiers `.txt` ou `.md` dans le dossier `documents/`, puis lancez une recherche :

```bash
npm start -- "docker compose"
```

Les guillemets sont recommandés pour une requête de plusieurs mots.

Le programme affiche les chunks classés par similarité décroissante, avec leur référence, leur score et leur contenu.

## Commandes

```bash
# Vérifier les types du code applicatif
npm run check

# Vérifier les types du code et des tests
npm run check:test

# Exécuter les tests automatisés
npm test

# Lancer une recherche
npm start -- "votre question"
```

## Fonctionnement

L'index est reconstruit à chaque lancement. Ce choix est volontairement adapté à un petit corpus local : il simplifie le projet et prend immédiatement en compte toute modification des documents.

```txt
documents/
  -> lecture des fichiers .txt et .md
  -> découpage en chunks
  -> tokenisation
  -> calcul TF, DF et IDF
  -> création des vecteurs TF-IDF
  -> index en mémoire

requête CLI
  -> tokenisation
  -> vecteur TF-IDF
  -> similarité cosinus avec chaque chunk
  -> tri par score décroissant
  -> affichage des résultats
```

### Chunking

Les documents sont découpés en chunks d'environ 500 caractères. Le découpage privilégie les limites suivantes, dans cet ordre :

1. Fin de phrase
2. Saut de ligne
3. Espace
4. Coupe stricte à la taille maximale lorsqu'aucune limite exploitable n'est disponible

Chaque chunk conserve son texte, ses tokens et une référence vers le document source.

### Tokenisation

Le texte est normalisé en minuscules puis découpé en tokens. La ponctuation isolée est retirée, tandis que les caractères Unicode, les nombres décimaux et les termes techniques reliés par un tiret ou un point sont conservés lorsque cela est pertinent.

Exemple :

```txt
"Docker-Compose version 3.14."
-> ["docker-compose", "version", "3.14"]
```

### Recherche TF-IDF

Chaque chunk est représenté par un vecteur de poids TF-IDF.

\[
TFIDF(t, d) = TF(t, d) \times IDF(t)
\]

Le TF est la fréquence relative d'un terme dans un chunk :

\[
TF(t, d) = \frac{\text{occurrences de } t \text{ dans } d}
{\text{nombre total de tokens dans } d}
\]

L'IDF utilise la formule classique, sans lissage :

\[
IDF(t) = \ln\left(\frac{N}{DF(t)}\right)
\]

Avec :

- `N` : le nombre total de chunks
- `DF(t)` : le nombre de chunks contenant le terme `t`

Un mot présent dans tous les chunks a un IDF nul, car il ne permet pas de les différencier.

### Classement

La requête et chaque chunk sont comparés avec la similarité cosinus :

\[
\cos(\theta) =
\frac{\sum_t q_t \times c_t}
{\sqrt{\sum_t q_t^2} \times \sqrt{\sum_t c_t^2}}
\]

Les chunks sont ensuite triés du score le plus élevé au plus faible.

## Tests

Le projet utilise le test runner natif de Node (`node:test`).

Les tests couvrent notamment :

- Le découpage en chunks
- La tokenisation
- La lecture des fichiers
- Le calcul de la fréquence de terme normalisée (TF)
- Le calcul de la fréquence documentaire (DF)
- Le calcul de l'IDF classique
- La similarité cosinus

Lancer les tests :

```bash
npm test
```

## Arborescence

```txt
.
├── README.md
├── documents
│   ├── docker.txt
│   ├── rag.md
│   ├── sql.txt
│   └── test.txt
├── node_modules
│   └── ...
├── package-lock.json
├── package.json
├── src
│   ├── chunk.ts
│   ├── file_pars.ts
│   ├── index.ts
│   ├── interface.ts
│   ├── search.ts
│   └── tf-idf.ts
├── subject.md
├── tests
│   ├── chunk.test.ts
│   ├── file_pars.test.ts
│   ├── tf-idf.test.ts
│   └── tsconfig.json
├── tsconfig.json
└── tsconfig.test.json
```

## Limites

Cette implémentation effectue une recherche lexicale. Elle fonctionne donc mieux lorsque les termes de la requête sont également présents dans les documents.

Elle ne traite pas encore :

- Les synonymes et reformulations sémantiques
- Les fautes d'orthographe
- La lemmatisation ou le stemming
- Les formats de documents autres que `.txt` et `.md`
- La persistance de l'index entre deux exécutions

## Améliorations envisagées

Avec davantage de temps, j’aurais fait évoluer le projet sur les points suivants :

- [ ] **Améliorer le parsing et la tokenisation** : utiliser des règles plus sémantiques ainsi qu’un dictionnaire pour mieux normaliser les termes, gérer certaines variantes de mots et améliorer la qualité des tokens produits

- [ ] **Gérer les mots vides** 

- [ ] **Améliorer le découpage des documents** : conserver davantage le contexte entre les chunks, par exemple avec un chevauchement (*overlap*), et privilégier les frontières sémantiques telles que les titres, paragraphes et phrases

- [ ] **Ajouter une interface web légère** : créer une application React avec Vite, comprenant un champ de recherche, l’affichage des résultats classés par pertinence, leur score de similarité et la référence du document source

- [ ] **Remplacer ou compléter TF-IDF par des embeddings** : utiliser un modèle d’embeddings local avec Ollama, ou une API gratuite, afin de rechercher des contenus selon leur sens et non uniquement selon les mots exacts employés

- [ ] **Détecter le type réel des fichiers** : utiliser une bibliothèque d’identification de type MIME ou de signature de fichier pour vérifier qu’un document est bien exploitable, plutôt que de se fier uniquement à son extension `.txt` ou `.md`

- [ ] **Séparer l’indexation de la recherche** : générer et persister l’index lors de l’ajout ou de la modification des documents, puis le réutiliser lors des recherches afin d’éviter de recalculer l’ensemble du corpus à chaque lancement, cela n'a pas été fait pour s'assurer de rester dans le périmètre du projet et de ne pas complexifier inutilement le code

- [ ] **Intégrer les tests dans une pipeline CI/CD** 


## Utilisation de l'IA

Ce projet a été développé avec l'assistance de **Perplexity AI**, ainsi que de **GitHub Copilot**.

##### Perplexity AI
L'outil a été utilisé comme support d'apprentissage, de recherche et de revue technique pour :

- Comprendre et vérifier les concepts de TF, DF, IDF, TF-IDF et de similarité cosinus
- Discuter les choix de structures de données TypeScript
- Obtenir des explications sur la technologie me permettant de confronter mon expérience des autres langages à celui utilisé
- Documenter le Readme

#### GitHub Copilot
L'outil a été utilisé pour commenter mes fonctions ainsi que générer des tests unitaires.

Les choix finaux, l'implémentation, les tests et la validation du comportement ont été réalisés manuellement.
