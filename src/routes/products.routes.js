import { Router } from "express";
import {productsModel} from "../dao/models/products.model.js";

const routerProducts = Router();

routerProducts.get("/products", async (req, res) => {
    try {
      let products = await productsModel.find({}).lean();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

routerProducts.get("/products/:id", async (req, res) => {
    try {
      const id=req.params.id;
      let products = await productsModel.find({_id: id}).lean();
      res.status(200).send(products);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

routerProducts.post("/products", async (req, res) => {
    try {
      const newProduct =req.body;
      let response= await productsModel.create(newProduct);
      res.status(200).send(response)
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

  routerProducts.put("/products/:pid", async (req, res) => {
    try {
      const pid = req.params.pid;
      const body = req.body;
      await productsModel.findOneAndReplace({_id: pid}, body);
      let response =  await productsModel.find({_id: pid});
      res.status(200).send(response);
    } catch (err) {
      res.status(500).json({error: err});
    } 
  });
  
  routerProducts.delete("/products/:pid", async (req, res) => {
    try {
      const pid = req.params.pid;
      await productsModel.findByIdAndDelete(pid);
      res.status(200).json(pid);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

  routerProducts.get("*", function (req, res) {
    res.status(404).send("The route is incorrect");
  });

 export default routerProducts;