This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

### Step 1: Install PostgreSQL
- If you haven't already, install PostgreSQL on your local machine. You can download it from [https://www.postgresql.org/download/](https://www.postgresql.org/download/).

### Step 2: Start PostgreSQL Service
- After installation, start the PostgreSQL service.
- You can use the command line to start the PostgreSQL service:
  ```sh
  pg_ctl -D /usr/local/var/postgres start
  ```

### Step 3: Create Database and User
- Access PostgreSQL using the terminal:
  ```sh
  psql postgres
  ```
- Create a new database:
  ```sql
  CREATE DATABASE betting_app;
  ```
- Create a new user with a password:
  ```sql
  CREATE USER betting_user WITH PASSWORD 'password';
  ```
- Grant privileges to the new user on the database:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE betting_app TO betting_user;
  ```

### Step 4: Set Up Tables
- Connect to the newly created database:
  ```sh
  psql -d betting_app -U betting_user
  ```

- Create `users` and `bets` tables:
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY,
    handle TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_mediator BOOLEAN DEFAULT FALSE,
    profile_picture TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
  );

  CREATE TABLE bets (
    id UUID PRIMARY KEY,
    user1 UUID REFERENCES users(id),
    user2 UUID REFERENCES users(id),
    user1Amount DECIMAL NOT NULL,
    user2Amount DECIMAL,
    totalAmount DECIMAL,
    stripe_payment_id TEXT,
    status TEXT CHECK (status IN ('pending', 'accepted', 'resolved', 'mediated')),
    mediator_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
  );
  ```

### Step 5: Configure .env.local
- In the root of your project, create a `.env.local` file and add the following configuration:
  ```env
  DATABASE_URL=postgresql://betting_user:password@localhost:5432/betting_app
  ```

### Step 6: Install Drizzle ORM
- Drizzle ORM will be used to interact with the database.
  ```sh
  npm install drizzle-orm drizzle-orm-pg pg
  ```

### Step 7: Configure Drizzle
- Create a Drizzle configuration file (`drizzle.ts`) in the `utils` folder:
  ```typescript
  import { drizzle } from 'drizzle-orm';
  import { Pool } from 'pg';

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  export const db = drizzle(pool);
  ```
