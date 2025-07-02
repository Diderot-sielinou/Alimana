# ALIMANA

This is a store management system web app for store to be able to keep track of all activities in there store.

Application web de gestion de boutique développée avec Next.js et TypeScript.

---

## 🚀 Technologies utilisées

- [Next.js](https://nextjs.org/) (React framework SSR/SSG)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (framework CSS utilitaire)
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) (linting & formatting)
- [Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/okonet/lint-staged) (pré-commit hooks)

---

## ⚙️ Installation

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/Diderot-sielinou/Alimana.git
   cd manage-store-app

   ```

2. Installation

Install project with npm

```bash
npm install

```

3. Configure environment variables (.env):

```bash
PORT=4000

NODE_ENV=

```

4.Run the server:

```bash
npm run dev

```

### 🛡️ Qualité du code

- Le projet utilise Husky et lint-staged pour lancer automatiquement ESLint, Prettier et la vérification TypeScript avant chaque commit.

- La présence de console.log dans le code est interdite et bloquera les commits.

### 📋 Scripts disponibles

-dev — démarre le serveur Next.js en mode développement

- start — démarre le serveur en mode production
- build — compile le projet pour la production
- lint — lance ESLint pour détecter les problèmes de code
- type-check — vérifie la conformité TypeScript sans générer de fichiers
- prepare — installe Husky pour les hooks git

## Access Swagger Documentation

[Visit](http://localhost:4000/api/api-docs)

## 📄 License

This project is licensed under the [MIT](https://snyk.io/fr/articles/what-is-mit-license/) License — see the LICENSE file for details.

## 🙌 Author

Made with ❤️ by [Sielinou Fonou Diderot]()
