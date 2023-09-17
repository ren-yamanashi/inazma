declare namespace NodeJS {
  interface ProcessEnv {
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;
    APP_ENV: 'development' | 'test';
  }
}
