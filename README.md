# Medi-Connect-api

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

<div align="center">
  <img width="100%" align="center" src="./demo/Demo picture.png">
</div>

<br>
<br>
<p align="center">
  <a href="https://medi-connect-ui.vercel.app">Join Medi Connect!</a>
  <a href="https://github.com/Ellen-ho/medi-connect-api#seeder">(test account)</a>
</p>

<br>

## Table of contents

- [User Interface](#User-Interface)
- [About Medi-Connect](#About-Medi-Connect)
- [Features](#Features)
- [Local development](#local-development)

## User Interface

### Visit doctor's page, choose a time slot, and book appointment

<p align="center">
  <img width="80%" align="center" src="./demo/Book appointment.gif">
</p>

### Add patient record

<p align="center">
  <img width="80%" align="center" src="./demo/Add patient record.gif">
</p>

### Doctor views patient info after appointment notification

<p align="center">
  <img width="80%" align="center" src="./demo/Doctor views patient info after appointment notification.gif">
</p>

## About Medi-Connect

Recognizing physicians' constraints on time and presence, the platform aids in gaining a thorough understanding of patients' health and lifestyles. This tool allows doctors to make informed decisions beyond the traditional confines of clinic hours

### Packages that are used in this project

**Back End**

- Using [`bcrypt`](https://www.npmjs.com/package/bcrypt) to hash passwords with a salt.
- Using [`body-parser`](https://www.npmjs.com/package/body-parser) to extract information from incoming requests such as sign-up forms at the frontend.
- Using [`cors`](https://www.npmjs.com/package/cors) to serve third-party origins.
- Using [`express`](https://www.npmjs.com/package/express) as a web applications framework for Node.js.
- Uses [`AWS S3`](https://www.npmjs.com/package/aws-sdk) for uploading and storing user profile avatars. The image upload functionality is handled by [`Multer`](https://www.npmjs.com/package/multer) middleware in combination with AWS SDK. This approach ensures that all user images are securely uploaded to S3 buckets, and proper access control mechanisms are in place to safeguard user privacy, especially in a healthcare context.
- Using [`day.js`](https://www.npmjs.com/package/dayjs) to customize date and time format in date conversion and processing.
- Using [`node-schedule`](https://www.npmjs.com/package/node-schedule) to schedule tasks that need to be triggered periodically.
- Using [passport-jwt](http://www.passportjs.org/packages/passport-jwt/) for token-based authentication in RESTful APIs.
- Using [jest](https://www.npmjs.com/package/jest) for unit tests and integration tests.
- Using [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) to design and document RESTful APIs.
- Using [TypeORM](https://www.npmjs.com/package/typeorm) as an interface for database interactions.
- Using [class-transformer](https://www.npmjs.com/package/class-transformer) for object transformation and serialization.
- Using [express-session](https://www.npmjs.com/package/express-session) to manage user sessions.
- Using [googleapis](https://www.npmjs.com/package/googleapis) to interact with Google APIs.
- Using [joi](https://www.npmjs.com/package/joi) for data validation and schema definition.
- Using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to generate and verify JSON Web Tokens (JWT).
- Using [passport](https://www.npmjs.com/package/passport) as authentication middleware.
- Using [passport-local](https://www.npmjs.com/package/passport-local) for local authentication strategies.
- Using [pg](https://www.npmjs.com/package/pg) as the PostgreSQL database driver.
- Using [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) for handling metadata in TypeScript.
- Using [uuid](https://www.npmjs.com/package/uuid) to generate Universally Unique Identifiers (UUIDs).
- Using [eslint](https://www.npmjs.com/package/eslint) to enforce coding standards and maintain a consistent codebase in your JavaScript applications.
- Using [prettier](https://www.npmjs.com/package/prettier) to automatically format and beautify your code, ensuring a consistent code style across your JavaScript applications.

## Features

### Patient

As a patient member, you can...

1. Sign up for a Medi-Connect account to embark on your journey towards a healthier lifestyle.
2. Sign in using your registered email and password, or alternatively, you can also log in with your Facebook account.
3. Create your personal profile in order to commence the use of other services on the plant.
4. Edit your account or your personal profile.
5. Add your health records, with the platform offering seven categories of health record classifications, including blood pressure, blood sugar, glycated hemoglobin, sleep, exercise, diet, and weight.
6. Review and examine individual entries or lists of records from any category to gain insights into changes in your personal health status.
7. Pose any health inquiries and select the category attribute for your question, facilitating relevant medical professionals to respond to your queries.
8. Navigate through your own inquiries and also view questions from other patients along with the corresponding responses from medical professionals in the question forum.
9. Click the notification to view the reply that a red dot will appear on your notification bell when your question receives a response.
10. Click the heart icon to write a gratitude message and express your thanks to the doctor who provided you with a response.
11. Cancel any of your gratitude messages if you change your mind.
12. Visit the physician list to view information about any doctor.
13. View the schedule of any doctor and select an available time slot to create an appointment.
14. View your appointment history, which includes categories such as upcoming, completed, and canceled appointments.
15. Cancel your upcoming appointment no later than the day before the scheduled date.
16. Receive upcoming appointment notifications 22 hours before the scheduled appointment time.
17. Receive the Google Meet link for the respective appointment 22 hours prior to the scheduled appointment time.
18. Receive the health goal plan sent by the platform when you have maintained records for two consecutive weeks.
19. Accept the health goal plan and commence your plan accordingly.
20. Decline the health goal plan provided by the platform.
21. Click "Forgot Password" if you forget your password, and follow the link sent to your email to reset your password.

### Doctor

As a doctor member, you can...

1. Sign up for a Medi-Connect account and begin utilizing your expertise to assist others.
2. Sign in using your registered email and password.
3. Create your personal profile in order to commence the use of other services on the plant.
4. Edit your account or your personal profile.
5. View the list of questions posed by patients.
6. Respond to patients' inquiries.
7. Click the thumbs-up icon to agree with another physician's response and send feedback content to the respective doctor.
8. Withdraw your agreement if you change your mind.
9. Receive notifications when patients express gratitude for your response or when other doctors agree with your answer.
10. Create your schedule within the designated timeframes outlined by the platform guidelines.
11. Edit your schedule within the timeframes specified by the platform guidelines.
12. Receive notifications when patients schedule appointments during your available time slots or when they cancel appointments previously reserved with you.
13. View the profile, records, and goals of the patient who has scheduled an appointment with you when the appointment status is "upcoming."
14. Receive the Google Meet link for the respective appointment 22 hours prior to the scheduled appointment time.
15. View the number of agreements and expressions of gratitude received for each of your responses.
16. Click "Forgot Password" if you forget your password, and follow the link sent to your email to reset your password.

## Local development

### Setup

The following tools need to be installed on your system in advance:

- `git`: `>=2`
- `nodejs`: `>=16 <17`
- `npm`: `>=8 <9`
- `docker`: `>=18.09`
- `docker-compose`: `>=1.28.6` (service profiles is not supported until version `1.28.0`)

### Install dependency

First clone the repository, then run the following commands to install the dependencies:

```shell
npm clean-install
```

**please do not use the command npm install as it might upgrade dependencies unintentionally**

### Setup database

1. Setup environment variables by coping `.env-sample` file to `.env` and fill it proper values
2. Run the PostgreSQL using docker-compose:

```shell
docker-compose --profile dev up -d [--build]
```

If you encounter problems with docker-compose, you may run:

```
$ docker-compose down [--rmi local] [--remove-orphans] [-v]
```

- `docker-compose down` will stop & remove the containers
- `--rmi local` will remove local images
- `--remove-orphans` will remove unneeded orphan containers
- `-v` will remove volumes (**WARNING: THIS WILL WIPE ALL YOUR OLD LOCAL DATABASE DATA**)

### Running the application

```shell
npm run dev
```

### Lint and formatting

We recommend that you use [Visual Studio Code](https://code.visualstudio.com/) to work on the project. We use [ESLint](https://github.com/eslint/eslint) & [Prettier](https://github.com/prettier/prettier) to keep our code consistent in terms of style and reducing defects. We recommend installing the the [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) & [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) as well.

Reference: [Setting up ESlint with Standard and Prettier](https://medium.com/nerd-for-tech/setting-up-eslint-with-standard-and-prettier-be245cb9fc64)

### Other Extension

- [pretty-ts-errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors): make TS error message readable

### Local API testing

We use [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to test the API locally. You can find the API test scripts in `docs/scripts` folder.

### Migrations

Generate new migration file from an entity:

Automatic migration generation creates a new migration file and writes all sql queries that must be executed to update the database.
If no there were no changes generated, the command will exit with code 1.

```
$ npm run typeorm migration:generate ./migrations/{MigrationName}
```

Run migrations:

```
$ npm run typeorm migration:run
```

Reverts last executed migration:

```
$ npm run typeorm migration:revert
```

Important notes:

- When creating a PR with migrations check if your timestamp is the latest. Otherwise, when outdated migration is merged it will be ignored by `typeorm run` command.

Reference: [Why need to setup typeorm-ts-node-commonjs in typeorm script](https://typeorm.io/using-cli#if-entities-files-are-in-typescript)

### Seeder

Can run seeder to insert dummy patent and doctor.

```
$ npm run seed
```

| Role    | Email          | Password |
| ------- | -------------- | -------- |
| Patient | john@gmail.com | 12345678 |
| Doctor  | jim@gmail.com  | 12345678 |

### Integration Test

1. Setup test database

Change the following variables in .env:

- POSTGRES_DB_NAME=test_db
- POSTGRES_PORT=54320

Execute the following command to create test DB:

```shell
docker-compose --profile test up -d [--build]
```

2. Apply DB migration to test DB

```
$ npm run typeorm migration:run
```

3. Run integration test

This will run all script that has the `.integration.test.ts` suffix:

```
npm run test:integration
```

To run individual integration test, you can run `npm run test:integration -- -i <file_name>`
