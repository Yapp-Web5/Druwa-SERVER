# Druwa-SERVERzzzzzzzzzzzz

Druwa SERVER

## How to install

### 1. Clone this repository to local and install

```$
$ git clone https://github.com/Yapp-Web5/Druwa-SERVER
$ cd Druwa-SERVER
$ npm install
```

### 2. Create DB Constant file `_db_account.ts`

You must create `_db_account.ts` file in `src/configs` directory according to this guide to operate server.

```ts
/* 
  src/configs/_db_account.ts 
*/

export const DB_ADMIN_USERNAME = OUR_MONGODB_USERNAME;
export const DB_ADMIN_PASSWORD = OUR_PASSWORD;
export const DB_URL = OUR_DB_URL;
```

If you forget `OUR_MONGODB_USERNAME`, `OUR_PASSWORD` or `OUR_DB_URL`, please send email to nayunhwan.dev@gmail.com or contact Yunhwan Na.

Because `_db_account.ts` file includes sensitive data related with Database. After creating `_db_account.ts` file, Never upload the file to any Github repository including Druwa-SERVER.

Basically `_db_account.ts` is already registered in `.gitignore`.

## Skill Stacks

- Node.js
- Express
- TypeScript
- Socket.io
- MongoDB & Mongoose
