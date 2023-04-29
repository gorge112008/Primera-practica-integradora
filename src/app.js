import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import routerProducts from "./routes/products.routes.js";
import routerCarts from "./routes/carts.routes.js";
import routerMessage from "./routes/chat.routes.js";
import routerUser from "./routes/users.routes.js";
import Handlebars from "handlebars";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { ProductFM } from "./dao/classes/DBmanager.js";
import { MessageFM } from "./dao/classes/DBmanager.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express(),
  port = process.env.PORT || 8080,
  DB_USER = process.env.USER_MONGO,
  DB_PASS = process.env.PASS_MONGO,
  DB_NAME = process.env.DB_MONGO;

const httpServer = app.listen(port, () => {
  console.log("Server up in port", port);
});
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routerCarts, routerMessage, routerUser, routerProducts);
app.engine(
  "handlebars",
  engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

let response;

async function initMessages() {
  try {
    let Messages = [];
    Messages = await MessageFM.getMessages();
    return Messages;
  } catch (error) {
    return error;
  }
}
async function initProducts(id) {
  try {
    let Products = [];
    id
      ? (Products = await ProductFM.getProductId(id))
      : (Products = await ProductFM.getProducts());
    return Products;
  } catch (error) {
    return error;
  }
}

app.get("/", (req, res) => {
  res.render("index", {});
});

app.get("/home", async (req, res) => {
  response = await initProducts();
  res.render("home", { response });
});

app.get("/realtimeproducts", async (req, res) => {
  response = await initProducts();
  res.render("realtimeproducts", { response });
});

app.get("/realtimeproducts/:pid", async (req, res) => {
  let pid = req.params.pid;
  response = await initProducts(pid);
  res.render("realtimeproducts", { response });
});

app.get("/chat", async (req, res) => {
  response = await initMessages();
  res.render("chat", { response });
});

const environment = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@codercluster.xq93twh.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
    console.log("Conexion a la base de datos exitosa");
  } catch (error) {
    console.log("Error en la conexion a la base de datos", error);
  }
};

const isValidStartDate = () => {
  if (DB_USER && DB_PASS) return true;
  else return false;
};

isValidStartDate() && environment();

socketServer.on("connection", async (socket) => {
  console.log("New client connected");
  socket.emit("backProducts", await response);
  socket.emit("backMessages", await response);

  socket.on("addproduct", async (newProduct) => {
    socketServer.emit("f5NewProduct", newProduct);
  });

  socket.on("deleteproduct", async (newStore) => {
    socketServer.emit("f5deleteProduct", newStore);
  });

  socket.on("updateproduct", async (updatedStore) => {
    socket.broadcast.emit("f5updateProduct", updatedStore);
  });

  socket.on("updatingProduct", async (updatingMsj) => {
    socket.broadcast.emit("updatingProduct", updatingMsj);
  });

  socket.on("exonerarStatus", async (msj) => {
    console.log("Emision de Orden de Exoneracion");
    socket.broadcast.emit("ordenExonerar", msj);
  });

  socket.on("responseExonerar", async (id) => {
    console.log("Respuesta de Orden de Exoneracion");
    socket.broadcast.emit("idExonerar", id);
  });

  socket.on("validateStatus", async (productsValid) => {
    socketServer.emit("actualizar", productsValid);
  });

  socket.on("finExo", async (msj) => {
    socketServer.emit("finValidate", msj);
  });

  socket.on("newUser", (userNew) => {
    socket.user = userNew.user;
    socket.id = userNew.id;
    socketServer.emit("newUser-connected", {
      user: socket.user,
      id: socket.id,
    });
  });

  socket.on("newMessage", async (lastMessage) => {
    socketServer.emit("messageLogs", lastMessage);
  });
});
