import { errMessages } from '../errors/err-msgs';

export const Env = {
  db: {
    connectionString: process.env.DB_CONNECTIONSTRING,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiration: Number(process.env.JWT_ACCESS_EXPIRESIN),
    refreshExpiration: Number(process.env.JWT_REFRESH_EXPIRESIN),
  },
  environment: process.env.NODE_ENV,

  firebase: {
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  redis: {
    url: process.env.REDIS_URL,
  },
};

export const checkEnv = () => {
  const envs = Object.keys(Env);
  envs.forEach((env) => {
    if (!Env[env]) {
      throw new Error(`${errMessages.ENV_VAR_NOT_SET} ${env}`);
    }
  });
};
