# Railway Deployment Guide

## Prerequisites

- Railway account with a MySQL database provisioned
- The MySQL service must be linked to this application in Railway

## Environment Variables

Configure the following variables in Railway (Service > Variables):

| Variable                 | Required | Default (dev)      | Description                          |
| ------------------------ | -------- | ------------------ | ------------------------------------ |
| `NODE_ENV`               | Yes      | `production`       | Environment mode                     |
| `PORT`                   | No       | `3000`             | HTTP port (Railway injects its own)  |
| `FRONTEND_URL`           | No       | —                  | CORS allowed origin                  |
| `DB_HOST`                | Yes      | —                  | MySQL host (from Railway MySQL)      |
| `DB_PORT`                | Yes      | —                  | MySQL port (usually `3306`)          |
| `DB_USERNAME`            | Yes      | —                  | MySQL username                       |
| `DB_PASSWORD`            | Yes      | —                  | MySQL password                       |
| `DB_DATABASE`            | Yes      | —                  | MySQL database name                  |
| `DB_LOGGING`             | No       | `false`            | Enable TypeORM query logging         |
| `DB_SSL`                 | No       | `false`            | Enable SSL for MySQL (Railway: true) |
| `JWT_ACCESS_SECRET`      | Yes      | —                  | Secret for signing access tokens     |
| `JWT_ACCESS_EXPIRES_IN`  | No       | `15m`              | Access token expiry                  |
| `JWT_REFRESH_SECRET`     | Yes      | —                  | Secret for signing refresh tokens    |
| `JWT_REFRESH_EXPIRES_IN` | No       | `7d`               | Refresh token expiry                 |
| `REFRESH_TOKEN_EXPIRES_DAYS` | No  | `30`               | Refresh token DB expiry in days      |
| `DEFAULT_APP_NAME`       | No       | `Identity Web`     | Default application name for seed    |
| `DEFAULT_APP_CODE`       | No       | `identity`         | Default application code for seed    |
| `DEFAULT_APP_CLIENT_ID`  | No       | `identity-web`     | Default application client ID        |
| `DEFAULT_APP_CLIENT_SECRET` | No    | —                  | Default application client secret    |

## Recommended Railway Variables

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.railway.app
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_SSL=true
JWT_ACCESS_SECRET=<generate-a-strong-random-secret>
JWT_REFRESH_SECRET=<generate-a-strong-random-secret>
```

> **Note:** If you link a Railway MySQL service, Railway automatically provides `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` as shared variables. Reference them as shown above.

## Start Command

Set the start command in Railway service settings:

```
npm run start:prod
```

This runs the compiled output in `dist/main.js`.

## Database Migrations

Migrations must be run manually after the first deploy or when schema changes.

### Run from local machine targeting Railway MySQL

1. Set the Railway MySQL variables in your local `.env` file
2. Run:

```bash
npm run migration:run
```

### Run via Railway CLI

```bash
railway run npm run migration:run
```

## Seed Default Application

After migrations, seed the default application:

```bash
npm run seed:default-app
```

## Verification

1. Deploy the app on Railway
2. Check logs for successful database connection
3. Access `https://your-service.railway.app/api` for Swagger documentation
4. Test the health endpoint: `GET https://your-service.railway.app/`
