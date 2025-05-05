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
./env/Scripts/Activate.ps1
```
- Instale as dependências do python
```powershell
python -m pip install -r requirements.txt
```

- Gere um banco de dados
```powershell
cd db
python -m pip install prisma
python -m prisma generate
cd ../
```

- Execute o servidor
```powershell
python server.py
```