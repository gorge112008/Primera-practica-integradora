import express from 'express';
import { engine } from 'express-handlebars';
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import routerProducts from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import routerMessages from './routes/messages.routes.js';
import routerUser from './routes/users.routes.js';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import {ProductFileManager} from './dao/classes/DBmanager.js';
const ProductFM = new ProductFileManager();

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const port = process.env.PORT||8080;
const DB_USER = process.env.USER_MONGO;
const DB_PASS = process.env.PASS_MONGO;
const DB_NAME = process.env.DB_MONGO;

const httpServer = app.listen(port, () => {
  console.log("Server up in port", port);
});
const socketServer = new Server(httpServer);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routerCarts, routerProducts, routerMessages,routerUser);

app.engine('handlebars', engine({
  handlebars:allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.render("index", {});
});

async function initProducts(id){
  if (id) {
    let res = await ProductFM.getProductId(id);
    return res;
  } else {
    let res = await ProductFM.getProducts();
    return res;
  }
}

let response;

app.get("/home",  async (req, res) => {
  response = await initProducts();
  res.render("home", { response });
});

app.get("/realtimeproducts",  async (req, res) => {
  response = await initProducts();
  res.render("realtimeproducts", { response });
});

app.get("/realtimeproducts/:pid",  async (req, res) => {
  let pid=req.params.pid;
  response = await initProducts(pid);
  res.render("realtimeproducts", { response });
});

const environment = async()=>{
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@codercluster.xq93twh.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
    console.log("Conexion a la base de datos exitosa");
  } catch (error) {
    console.log("Error en la conexion a la base de datos",error);
  }
}

const isValidStartDate =()=>{
 if  (DB_USER && DB_PASS) return true;
 else return false;
}

isValidStartDate() && environment();

socketServer.on("connection", async (socket) => {

  console.log("New client connected");

  socket.emit("products", await response);

  socket.on("addproduct", async (newProduct) => {
    socket.broadcast.emit("f5NewProduct", newProduct);
  });

  socket.on("deleteproduct", async (idproduct) => {
    socket.broadcast.emit("f5deleteProduct", idproduct);
  });

  socket.on("updateproduct", async (product) => {
    socket.broadcast.emit("f5updateProduct", product);
  });

  socket.on("updatingProduct", async (msj) => {
    socket.broadcast.emit("update", msj);
  });

  socket.on("inicializar", async ()=> {
    socket.emit("products", await response);
  });
});