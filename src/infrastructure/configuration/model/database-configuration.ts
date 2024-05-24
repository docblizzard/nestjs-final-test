export const DATABASE_NAME = 'DATABASE_NAME';
export const DATABASE_PORT = 'DATABASE_PORT';
export const DATABASE_HOST = 'DATABASE_HOST';
export const DATABASE_USER = 'DATABASE_USER';
export const DATABASE_PASSWORD = 'DATABASE_PASSWORD';

export type DatabaseConfiguration = {
    [DATABASE_NAME]: string;
    [DATABASE_PORT]: string;
    [DATABASE_HOST]: string;
    [DATABASE_USER]: string;
    [DATABASE_PASSWORD]: string;
};