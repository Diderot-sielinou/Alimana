# manage-store-app

Application web de gestion de boutique développée avec Next.js et TypeScript.

---

## ⚙️ Stack technique

| Outil                                                                                            | Usage                                   |
| ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| [Next.js](https://nextjs.org/)                                                                   | Framework React avec SSR & SSG          |
| [TypeScript](https://www.typescriptlang.org/)                                                    | Typage statique pour JavaScript         |
| [Tailwind CSS](https://tailwindcss.com/)                                                         | Styling rapide basé sur les utilitaires |
| [ESLint](https://eslint.org/)                                                                    | Analyse statique du code                |
| [Prettier](https://prettier.io/)                                                                 | Formatage de code                       |
| [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/okonet/lint-staged) | Prévention des erreurs avant commit     |

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

## 📄 License

This project is licensed under the [MIT](https://snyk.io/fr/articles/what-is-mit-license/) License — see the LICENSE file for details.

## 🙌 Author

Made with ❤️ by [Sielinou Fonou Diderot]()
