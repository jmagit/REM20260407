# Curso de Desarrollo REACT

## Instalaciones

- [Git](https://git-scm.com/)
- [Visual Studio Code](http://code.visualstudio.com/)
- Node.js (Alternativas)
  - [Node.js LTS](https://nodejs.org/es)
  - [NVM for Windows](https://github.com/coreybutler/nvm-windows/releases)

            nvm install lts

- [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=es)

## Extensiones Visual Studio Code

- [Spanish Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-es)
- [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [Spanish - Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-spanish)
- [IntelliSense for CSS class names](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
- [ES Lint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Servidor REST

### Local

    git submodule add https://github.com/jmagit/MOCKWebServer.git MOCKWebServer
    cd MOCKWebServer
    npm i
    npm start

### Contenedor

    docker run -d -p 4321:4321 --name mock-web-server mock-web-server:latest
