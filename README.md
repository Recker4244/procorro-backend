# OneBoard BE

## Pre-requisites

- Install [Node v19.5+](https://nodejs.org/en/download/)

## How to run the backend server locally -

In the project directory, perform the following steps:

### Install packages

```shell script
npm install
```

### Environment Variable configuration

Add the following envs:

```bash
GITHUB_APP_INSTALLATION_ID
GITHUB_APP_IDENTIFIER
PRIVATE_KEY
CLIENT_ID
GITHUB_CLIENT_SECRET
ORG_NAME
jwtPrivateKey
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
```

### Setup Database

1. Install PostgresSQL server locally by following the instructions [here](https://www.postgresql.org/docs/13/tutorial-install.html).
2. Start the local PostgreSQL server using the following command
   ```
     pg_ctl -D /usr/local/var/postgres start
   ```
3. Create the database using the following command
   ```
     createdb <DATABASE_NAME>
   ```
4. As mentioned in the [Environment Variable configuration section](#environment-variable-configuration), update the environment variables values with relevant database user, password, and username.
5. Run the migrations using the following command
   ```bash
   $ npm migrate:up
   ```

### Start the backend server

```bash
# development
$ npm start

# watch mode
$ npm start:dev
```

## Additional Commands

### Migration Commands

1. Create a new migration

   ```bash
   $ npm --name <migration_name>
   ```

2. Run the migrations

   ```bash
   $ npm migrate:up
   ```

3. Revert the last executed migration

   ```bash
   $ npm migrate:down
   ```

### Seeding Commands

1. Create a new seeder

   ```bash
   $ npm seed:create --name <migration_name>
   ```

2. Seed the data

   ```bash
   $ npm seed:up
   ```

3. Revert the most recent seed

   ```bash
   $ npm seed:down
   ```

### Test

```bash
# unit tests
$ npm test

# test coverage
$ npm test:coverage
```

## Modules

| Feature         | Package            |
| --------------- | ------------------ |
| Package Manager | npm               |
| NodeJs          | 19.5.x             |
| PostgreSQL      | 13                 |
| Linting         | Eslint-Recommended |
| Unit Test       | Jest               |
| Code Analysis   | SonarQube          |
| ORM             | Sequelize          |

## Coding conventions

1. Singular form for naming tables and columns.
2. snake_case for table names.
3. Lowercase for database table and column names and camelCase for model/entity name.
4. camelCase for naming keys in response.
5. joi schema for requests with payloads.
6. API/Swagger specification and description for every route.
7. `./.env.sample` to be updated when adding new environment variables.
8. fk*`table_name`\_\_`<key1>*<key2>` template to create foreign keys
9. pk*`table_name`\_\_`<key1>*<key2>` template to create compound primary keys


## Technologies used

1. [**NodeJS**](https://nodejs.org/en/) (v19.5.x)
2. [**PostgresSQL**](https://www.postgresql.org/) (v13.x), a open-source relational database management system.
3. [**Sequelize**](https://sequelize.org/docs/v6/getting-started/)
