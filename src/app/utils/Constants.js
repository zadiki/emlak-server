import nconf from "nconf";

// for development
// export const MONGODB_URL ="mongodb://localhost:27017/emlak";
export const WORKERS = require("os").cpus().length;
//for live heroku
//git
// export const MONGODB_URL = process.env.MONGODB_URI;
// export const WORKERS = process.env.WEB_CONCURRENCY || 1;


nconf.argv().env().file('keys.json');

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPassword');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');
const db_name = nconf.get('mongoDatabase');


export const MONGODB_URL = `mongodb://${user}:${pass}@${host}:${port}/${db_name}`;
export const DATA_BACKEND = nconf.get('DATA_BACKEND');
export const GCLOUD_BUCKET = nconf.get('GCLOUD_BUCKET');
export const GCLOUD_PROJECT = nconf.get('GCLOUD_PROJECT');


export const USER_STATUS_PENDING = 0;
export const USER_STATUS_ACTIVE = 1;
export const USER_STATUS_VOIDED = 2;

//user levels
export const USER_LEVEL_VIEWER = 2;
export const USER_LEVEL_POSTER = 3
export const USER_LEVEL_MANAGER = 4
export const USER_LEVEL_ADMIN = 5;

//property type
export const PROPERTY_TYPE_RENTAL = 1;
export const PROPERTY_TYPE_SALE = 2;

//PROPERTY PAYMENT MODE
export const PROPERTY_PAYMENT_MODE_DAYLY = 1;
export const PROPERTY_PAYMENT_MODE_MONTHLY = 2;
export const PROPERTY_PAYMENT_MODE_QUARTERLY = 3;
