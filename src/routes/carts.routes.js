import { Router } from "express";
import { cartsModel } from "../dao/models/carts.model.js";

const routerCarts = Router();

routerCarts.get("/", async (req, res) => {
    try {
      let users = await cartsModel.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

  export default routerCarts;