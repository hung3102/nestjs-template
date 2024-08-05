# Summary
This template includes:
- Nestjs
- Objectionjs
- DB: docker, migrations, seeds

## Prerequisite
- Node version 20.16.0
- Docker latest version

## Run

```bash
$ pnpm install

# Start DB docker
docker-compose up -d

# development
$ pnpm run dev

# production mode
$ pnpm run build
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## DB Migration

```bash
# create migrate file
pnpm run migrate:make {file_name}

# migrate all
pnpm run migrate
```

## Seed data

```bash
# create seed file
pnpm run seed:make {file_name}

# seed all data
pnpm run seed
```