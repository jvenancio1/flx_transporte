---

# Projeto Next.js com PostgreSQL e Prisma

Este projeto é desenvolvido com **Next.js** e utiliza **PostgreSQL** como banco de dados, junto com o **Prisma** para gerenciamento do esquema do banco. Abaixo estão as instruções para configurar e rodar o projeto.

## Pré-requisitos

- **Node.js**
- **Yarn** ou **npm**
- **PostgreSQL** instalado e configurado

## Instruções para subir o projeto

### 1. Clonar o repositório

Clone o repositório para sua máquina local:

```bash
git clone https://github.com/brunoandradegit/flx_transporte/
cd flx_transporte
```

### 2. Configurar as variáveis de ambiente

- Copie o arquivo `.env-example` para `.env`:

```bash
cp .env-example .env
```

- Atualize as variáveis no arquivo `.env` de acordo com a configuração do seu banco de dados PostgreSQL e outras configurações necessárias para o projeto.

Exemplo de variáveis no `.env`:

```env
DATABASE_URL=postgresql://seu-usuario:senha@localhost:5432/nome-do-banco
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Instalar as dependências

Instale as dependências do projeto usando **yarn** ou **npm**:

#### Usando Yarn:

```bash
yarn install
```

#### Usando npm:

```bash
npm install
```

### 4. Criar o banco de dados e rodar as migrações

Depois de configurar as variáveis e instalar as dependências, você precisa rodar as migrações do Prisma para criar o banco de dados:

#### Usando Yarn:

```bash
yarn prisma migrate deploy
```

#### Usando npm:

```bash
npx prisma migrate deploy
```

### 5. Rodar o projeto

Agora que tudo está configurado, você pode rodar o projeto:

#### Usando Yarn:

```bash
yarn dev
```

#### Usando npm:

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:3000`.

## Comandos úteis

- **Rodar as migrações do Prisma:**

  ```bash
  yarn prisma migrate deploy
  # ou
  npx prisma migrate deploy
  ```

- **Abrir a interface Prisma Studio para visualizar dados:**

  ```bash
  yarn prisma studio
  # ou
  npx prisma studio
  ```
