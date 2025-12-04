# AlzCare - Sistema de Acompanhamento de Alzheimer

Sistema para acompanhamento de pacientes com Alzheimer, conectando médicos, cuidadores e pacientes.

## 🛠️ Tecnologias

- **Backend:** Java 17, Spring Boot 3.5, PostgreSQL
- **Frontend Web:** React 19, React Router 7, TailwindCSS 4, TypeScript
- **Mobile:** React Native, Expo 54, TypeScript
- **Infra:** Docker, Firebase Storage, Azure

---

## ☁️ Acesso Rápido (Nuvem)

Quer testar sem instalar nada? Acesse a versão de produção hospedada na Azure:

| Plataforma       | Link                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| **Frontend Web** | [https://kind-mud-06a65940f.1.azurestaticapps.net](https://kind-mud-06a65940f.1.azurestaticapps.net) |
| **Mobile (APK)** | [Download no Expo](https://expo.dev/artifacts/eas/gizRi62gcrmZ84Gujo3PqP.apk)                        |

> **Credenciais:** Use os [usuários de teste](#-usuários-de-teste) listados abaixo.

---

## 🚀 Como Rodar Localmente

Se preferir rodar o projeto na sua máquina, siga as instruções abaixo.

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados
- [Node.js 20+](https://nodejs.org/) (apenas para o mobile)
- [Expo Go](https://expo.dev/go) no celular (para testar o app mobile)

---

### 1. Clone o repositório

```bash
git clone https://github.com/TCC-Sistema-Alzhaimer/tcc_acompanhamento_alzheimer.git
cd tcc_acompanhamento_alzheimer
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

Edite o `.env` seguindo o modelo do `.env.example`.

### 3. Suba os containers (Backend + Frontend Web)

```bash
docker-compose up --build
```

### 4. Rode o Mobile (em outro terminal)

```bash
cd mobile
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seu IP local

# Inicie o Expo
npx expo start
```

> **Dica:** Use `ipconfig` (Windows) ou `ifconfig` (Linux/Mac) para descobrir seu IP local. O celular precisa estar na mesma rede Wi-Fi.

### 5. Acesse a aplicação

| Serviço      | URL / Acesso                  |
| ------------ | ----------------------------- |
| Frontend Web | http://localhost:5173         |
| Backend API  | http://localhost:8080         |
| Mobile       | Escaneie o QR code do Expo Go |
| Postgres     | localhost:5433                |

---

## 👥 Usuários de Teste

O sistema cria automaticamente usuários para testes (via `SeedRunner`):

| Tipo     | E-mail                    | Senha            |
| -------- | ------------------------- | ---------------- |
| Admin    | admin@alzcare.com         | admin@123        |
| Médico   | ana.sousa@alzcare.com     | docAna@123       |
| Médico   | bruno.azevedo@alzcare.com | docBruno@123     |
| Cuidador | amanda.dias@alzcare.com   | careAmanda@123   |
| Cuidador | rita.campos@alzcare.com   | careRita@123     |
| Paciente | maria.silva@alzcare.com   | patientMaria@123 |

---

## 🧪 Comandos Úteis

```bash
# Rebuild completo
docker-compose up --build --force-recreate

# Ver logs do backend
docker logs -f backend-alzheimer

# Parar tudo
docker-compose down

# Limpar volumes (apaga dados do banco)
docker-compose down -v
```
