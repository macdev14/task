
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript.

[MongoDB](https://www.mongodb.com/) for database

[RabbitMQ](https://www.rabbitmq.com/) for notifications

[MailHog](https://github.com/mailhog/MailHog) for local smtp server

## Installation

```bash
$ npm install
```
## Environment Variables

Rename 'local.env' to '.env'
set smtp server and MongoDB server credentials
```bash
# example
MONGODB_DB=taskenv
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
SMTP_IGNORE_TLS=true
SMTP_HOST=127.0.0.1
SMTP_SECURE=false
SMTP_PORT=1025
```


## Running the app

```bash

$ npm run start

# watch mode
$ npm run start:dev

## Test

```bash
# tests
$ npm run test

```

