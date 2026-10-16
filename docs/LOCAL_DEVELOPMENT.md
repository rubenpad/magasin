# Local development

This guide runs Magasin with Docker Compose, PostgreSQL/PostGIS, the database migrations, and the API. The commands assume a Unix-like shell such as Bash, Zsh, or Git Bash.

## Prerequisites

Install and start Docker with Docker Compose by following the official documentation for your operating system:

- Docker Desktop: <https://docs.docker.com/desktop/>
- Docker Engine: <https://docs.docker.com/engine/install/>
- Docker Compose: <https://docs.docker.com/compose/install/>

Verify the installation:

```bash
docker --version
docker compose version
docker run --rm hello-world
```

Docker commands can provide root-level access to the host. Only use the Docker group on a machine you trust.

## Configure the project

From the repository root, create the environment file required by Compose:

```bash
cp .env.example .env
```

The defaults start the API on port `3000`, connect PostgreSQL on port `5432`, use a 10 km search radius, and configure a maximum application database pool of 20 connections.

You can edit `.env` before starting the project. Common overrides are:

```dotenv
PORT=3000
POSTGRES_DB=magasin
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
DB_POOL_MAX=20
MAX_STORE_SEARCH_RADIUS_KM=10
```

Do not commit `.env`; it may contain credentials or Observe secrets.

## Optional: configure NestJS Observe

NestJS Observe is optional for local development. Configure it if you want request telemetry, runtime metrics, traces, errors, and the custom business metrics emitted by the service in the Observe dashboard.

Follow the official NestJS Observe documentation to create the account and project:

- Observe overview: <https://docs.nestjs.com/observability/overview>
- SDK configuration: <https://docs.nestjs.com/observability/sdk>

In the Observe dashboard:

1. Create or sign in to your account.
2. Create a project for Magasin.
3. Add an application to the project, for example `magasin-local`.
4. Open the project's API Keys page and create a key for local development.
5. Copy the generated `appKey` and `appSecret` when they are shown. Treat them as credentials; the secret may only be shown once.

Put the credentials in the local `.env` file:

```dotenv
OBSERVE_APP_KEY=your-app-key
OBSERVE_APP_SECRET=your-app-secret
```

The application is already configured with `serviceId: "magasin"` and passes these values to `ObserveModule`. Start or restart the API after changing the credentials:

```bash
docker compose up --build -d
```

After the API receives traffic, open the Observe dashboard to view the emitted telemetry and custom metrics. Never commit the key or secret to source control; use a secrets manager for shared or production environments.

## Start the database and API

Build the images and start all services in the background:

```bash
docker compose up --build -d
```

This starts:

- `db`: PostgreSQL 16 with PostGIS;
- `migrate`: the TypeORM migration job;
- `api`: the NestJS HTTP service.

The API waits for the database health check and for the migration job to complete successfully.

Check the service status:

```bash
docker compose ps
```

Follow API logs:

```bash
docker compose logs -f api
```

Check the API and database health:

```bash
curl http://localhost:3000/health
```

The health response should report a successful database check. If the API is not ready yet, wait a few seconds and retry.

## Populate the database

The migration creates the schema but does not insert store data. Load the deterministic sample data after the services are running:

```bash
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < docker/seed.sql
```

The seed contains stores and schedules for the cities represented in the dataset, including Bogotá, Medellín, Cali, and Bucaramanga.

Verify the inserted data:

```bash
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT count(*) AS stores FROM stores; SELECT count(*) AS schedules FROM store_schedules;"'
```

The seed is not idempotent. Running it a second time against the same database will fail because the store IDs already exist.

## Call the API

Search near Bogotá:

```bash
curl "http://localhost:3000/v1/stores/closest?latitude=4.7110&longitude=-74.0721"
```

Search near Medellín:

```bash
curl "http://localhost:3000/v1/stores/closest?latitude=6.2442&longitude=-75.5812"
```

A successful search returns `200`. If no open store is available within the configured radius, the expected response is `404`.

## Run migrations manually

The normal `docker compose up --build -d` flow runs the migration service. To run the migration job explicitly:

```bash
docker compose run --rm migrate
```

To build the application image without starting it:

```bash
docker compose build
```

## Run tests and checks

The application requires Node.js 24 or newer for host-side development commands. Refer to the official Node.js documentation for installation and version management:

<https://nodejs.org/>

Install dependencies and run the test suite from the repository root:

```bash
npm ci
npm test
npm run build
npm run format
```

The k6 load-test instructions are in [../performance/README.md](../performance/README.md).

## Stop the project

Stop the containers while preserving the database volume:

```bash
docker compose down
```

Stop the containers and remove the database volume to return to an empty database:

```bash
docker compose down -v
```

The `-v` option permanently removes the local PostgreSQL data volume. After removing it, start the project again and run the seed command to recreate the local data.

## Troubleshooting

View logs for all services:

```bash
docker compose logs -f
```

Check only the database logs:

```bash
docker compose logs -f db
```

If port `3000` or `5432` is already in use, change `PORT` or `POSTGRES_PORT` in `.env`, then restart the Compose stack:

```bash
docker compose down
docker compose up --build -d
```

If migrations fail after changing the database configuration, inspect the migration logs first:

```bash
docker compose logs migrate
```

For a clean local database, use `docker compose down -v`, start the stack again, and rerun the seed command.
