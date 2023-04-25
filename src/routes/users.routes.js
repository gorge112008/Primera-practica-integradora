import { Router } from "express";
import { ProductFM, CartFM, MessageFM, UserFM} from "../dao/classes/DBmanager.js";

const routerUser = Router();

routerUser.get("/users", async (req, res) => {
  try {
    let users = await UserFM.getUsers();
    const limit = req.query.limit;
    if (limit && !isNaN(Number(limit))) {
      users = users.slice(0, limit);
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerUser.get("/users/:iud", async (req, res) => {
  try {
    const iud = req.params.iud;
    let user = await UserFM.getUserId(iud);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerUser.post("/users", async (req, res) => {
  try {
    const newUser = req.body;
    let productsFind = [];
    if (newUser.products) {
      newUser.products.forEach((productItem) => {
        if (productItem._id) {
          let find = 0;
          productsFind.forEach((findItem) => {
            if (productItem._id == findItem.product) {
              findItem.quantity++;
              find = 1;
            }
          });
          if (find == 0) {
            productsFind.push({ product: productItem._id, quantity: 1 });
          }
        }
      });
      newUser.products = productsFind;
      const response = await UserFM.addUser(newUser);
      res.status(200).send(response);
    } else {
      res.status(400).send("Bad Request--> The user is not valid");
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerUser.delete("/users/:iud", async (req, res) => {
  try {
    const iud = req.params.iud;
    await UserFM.deleteUser(iud);
    res.status(200).json(iud);
  } catch (err) {
    res.status(500).json({error: err});
  }
});

export default routerUser;