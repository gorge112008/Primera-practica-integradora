import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/users.routes.js"

const app = express();
const port = 3000;
dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server up in port", port);
});

mongoose
.connect(`mongodb+srv://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@codercluster.xq93twh.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`)
.catch(error => console.log("Error al conectar a la base de datos"));

app.use("/users", (userRouter));
``