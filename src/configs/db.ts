/*

  Notice! You must create '_db_account.ts' file in this directory to operate server

  example) 
  : _db_account.ts

  export const DB_ADMIN_USERNAME = OUR_MONGODB_USERNAME;
  export const DB_ADMIN_PASSWORD = OUR_PASSWORD;
  export const DB_URL = OUR_DB_URL;

  --------
  
  If you forget OUR_MONGODB_USERNAME, OUR_PASSWORD or OUR_DB_URL, 
  please send email to nayunhwan.dev@gmail.com or contact Yunhwan Na.

  Because '_db_account.ts' file includes sensitive data related with Database. 
  After creating '_db_account.ts' file, Never upload '_db_account.ts' file to 
  any Github repository including Druwa-SERVER. 

  Basically '_db_account.ts' is registered in .gitignore.

*/

import { DB_ADMIN_USERNAME, DB_ADMIN_PASSWORD, DB_URL } from "./_db_account";
export const DB_END_POINT = `mongodb://${DB_ADMIN_USERNAME}:${DB_ADMIN_PASSWORD}@${DB_URL}`;
