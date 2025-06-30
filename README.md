### Installation

```bash
npm install
```

### Usage

```bash
npm run dev
```

### Setup environment variables
Create a `.env` file in the root directory and add the following variables:

```bash
cp .env.example .env
```

Then, edit the `.env` file to set your environment variables.

### Migration
Run the following command to create the database and run migrations:

```bash
npx sequelize-cli db:migrate
```

Undo the last migration if needed:

```bash
npx sequelize-cli db:migrate:undo
```

Undo all migrations:

```bash
npx sequelize-cli db:migrate:undo:all
```

### Seed the database
Run the following command to seed the database with initial data:

```bash
npx sequelize-cli db:seed:all
```