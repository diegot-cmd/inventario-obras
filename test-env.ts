import dotenv from 'dotenv';
dotenv.config(); // <- carga las variables del archivo .env

console.log("DATABASE_URL =", process.env.DATABASE_URL);

