# 🚀 WeLe Migration Guide: MongoDB → Neon PostgreSQL

I have successfully refactored the entire backend to use **Prisma ORM** and **PostgreSQL**. Follow these steps to complete the migration and go live on Neon.

## 1. Setup Neon Project
1. Go to [Neon.tech](https://neon.tech/) and create a new project.
2. Create a database (e.g., `weledb`).
3. Copy the **Connection String** (it starts with `postgresql://...`).
4. In your Neon Dashboard, ensure **Connection Pooling** is enabled if you plan to use it (optional for dev, helpful for prod).

## 2. Update Environment Variables
Open the `.env` file in `chat-server/` and update the following keys with your Neon string:

```env
# Replace the placeholder with your actual connection string
DATABASE_URL="postgresql://user:password@ep-shiny-pond-a1b2c3d4.us-east-2.aws.neon.tech/weledb?sslmode=require"

# (Optional) Direct URL for migrations if using connection pooler
DIRECT_URL="postgresql://user:password@ep-shiny-pond-a1b2c3d4.us-east-2.aws.neon.tech/weledb?sslmode=require"
```

## 3. Initialize the Database
Run these commands in the `chat-server/` directory:

```powershell
# Install dependencies (including Prisma)
npm install

# Push the schema to Neon (Creating tables)
npx prisma db push

# Generate the Prisma Client
npx prisma generate
```

## 4. Start the Server
```powershell
npm run dev
```

### What has changed?
- **Schema**: Your data structure remains the same but is now relational and hosted on Neon.
- **Admin**: The server will automatically create your admin account (`vrtkaarthik6@gmail.com`) and default boundary rules on the first run.
- **Performance**: PostgreSQL provides robust ACID compliance and better secondary indexing for your chat history.

> [!IMPORTANT]
> Your old MongoDB data is NOT automatically migrated. This migration sets up a **clean, fresh database** on Neon as per your request to "clear all values but keep schema".
