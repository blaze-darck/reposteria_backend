import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { AppDataSource } from "./coneccionBaseDatos";
import "reflect-metadata";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Conectado a la base de datos MySQL");

    app.get("/", (req, res) => {
      res.send("Servidor conectado a la base de datos ");
    });

    app.listen(PORT, () => {
      console.log(`Servidor levantado en el puerto ${PORT}`);
    });
  })
  .catch((error) => console.error("Error al conectar a la DB:", error));
