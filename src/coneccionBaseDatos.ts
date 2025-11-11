import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import "reflect-metadata";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === "true",
  logging: process.env.DB_LOGGING === "true",
  entities: [__dirname + "/**/entities/*.{ts,js}"],
});
