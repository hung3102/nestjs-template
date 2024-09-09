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
$ pnpm dev

# production mode
$ pnpm build
$ pnpm start:prod
```

## Test

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## DB Migration

```bash
# create migrate file
pnpm migrate:make {file_name}

# migrate all
pnpm migrate:latest
```

## Seed data

```bash
# create seed file
pnpm seed:make {file_name}

# seed all data
pnpm seed
```