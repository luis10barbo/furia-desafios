# FuriaPrototype

Pequeno prototipo contendo ambas challenges do processo seletivo da FURIA

[Acesse Chat Aqui](https://furia.luisbrb.com.br/chat)

[Acesse Know Your Fan Aqui](https://furia.luisbrb.com.br/kyf)

## Requisitos

Python > v3.11

Node > v20

NPM

## Setup
### App no Reddit (Para funcionar Autenticação)
- Va até a [pagina de apps no reddit](https://reddit.com/prefs/apps)
- Crie um novo app WEB e salve o **client id** (fica em baixo de **web-app** após criar o app) e o **client secret**

### Frontend e Backend
Clone o projeto do github

```bash
git clone https://github.com/luis10barbo/furia-desafios.git
```

Entre na pasta do projeto
```bash
cd furia-desafios
```

### frontend
- Acesse a pasta do frontend
```bash
cd frontend
```

- Instale as dependencias do NODE
```bash
npm install
```
- Abra o arquivo .env para configurar autenticação com reddit
```bash
vim src/environments/environment.ts
```

- Defina **REDDIT_CLIENT_ID**, **REDDIT_REDIRECT_URI** de acordo com o [seu app](https://reddit.com/prefs/apps) (na primeira etapa)
- Defina também o url do backend, no meu caso é **http://localhost:8000** (não esqueca do /api no final)
```typescript
export const environment = {
    REDDIT_CLIENT_ID: 'YZ-XJOkoR7Zv6R8fTww3gQ',
    REDDIT_REDIRECT_URI:'http://localhost:4200/auth/reddit',
    BACKEND: "http://localhost:8000/api"
}
```
- Agora execute o frontend
```bash
npm run start
```
### backend
- Volte para a pasta base e depois entre na pasta de backend
```powershell
cd ../
cd backend
```
 - Ative o ambiente virtual do python
```powershell
./venv/Scripts/Activate.ps1
```
- Instale as dependências do python
```powershell
python -m pip install -r requirements.txt
```
- Crie uma copia do exemplo **.env.example** nomeada **.env**
```powershell
cp .env.example .env
```

- Configure o **.env** com **CHAVE** = **VALOR**
```python
REDDIT_CLIENT_ID= #REDDIT APP CLIENT ID PARA OAUTH2
REDDIT_CLIENT_SECRET= #REDDIT APP CLIENT SECRET PARA OAUTH2
REDDIT_REDIRECT_URI= #REDDIT APP REDIRECT URI PARA OAUTH2
OPENAI_API_KEY= #OPENAI API KEY PARA CHAMADAS CHATGPT
SERVER_PORT= #USAR PORTA CUSTOMIZADA PARA O SERVIDOR
```

- Execute o servidor
```powershell
python server.py
```

## Estrutura de pastas
### backend

```python
backend
├── controller
│   ├── auth.py # Arquivo que guarda funcoes relacionadas a autenticacao do programa
│   ├── chatgpt.py # Arquivo de inicializacao do cliente chatgpt
│   ├── reddit.py # Arquivo que guarda funcoes de request para reddit
├── routes 
│   ├── auth_route.py # Rotas relacionadas a autenticacao
│   ├── chat_route.py # Rotas relacionadas a pagina de chat
│   ├── kyf_route.py # Rotas relacionadas a  pagina de kyf (Know Your Fan)
├── model 
│   ├── providers.py # Representa os providers (redes sociais) que o programa suporta
│   ├── reddit
│   │   ├── listing.py # Representacoes de retorno do get de upvotes reddit
│   │   ├── user.py # Representacoes de retorno do get de perfil usuario reddit
├── db
│   ├── db.py # Inicializacao do banco de dados
│   ├── schema.prisma # Schema do banco de dados
├── utils
└── ├── validation.py # Funcoes utilitarias pra ajudar na validacao

```
### frontend
```python
src
├── app
│   ├── components # Componentes ou paginas do frontend
│   │   ├── alert # Componente de popup de notificacao/alerta
│   │   ├── auth # Componente de paginas de autenticacao, contem callback oauth do reddit 
│   │   ├── chat # Pagina /chat
│   │   ├── header # Header utilizado em todas paginas
│   │   ├── kyf # Pagina /kyf
│   ├── models 
│   │   ├── userModel.ts # Representa tipo usuario
│   │   ├── sessionModel.ts # Representa tipo sessao, que fica dentro de usuario
│   │   ├── purchaseModel.ts # Representa tipo compra, que fica dentro de usuario
│   │   ├── eventModel.ts # Representa tipo evento, que fica dentro de usuario
│   │   ├── notificationModel.ts # Representa tipo notificacao, utilizado em alertas no programa
│   ├── services 
│   │   ├── auth # Funcoes de autenticacao oAuth2 via Reddit
│   │   ├── chat # Funcoes de interacao com backend da pagina Chat
│   │   ├── kyf # Funcoes de interacao com o backend da pagina Kyf
│   │   ├── notification  # Funcoes de interacao com o componente de alerta/notificacao
│   ├── utils # Funcoes extras para auxiliar no programa
└── environments # Configuracoes do frontend


```
