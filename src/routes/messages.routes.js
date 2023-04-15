import { Router } from "express";
import { messagesModel } from "../dao/models/messages.model.js";

const routerMessage = Router();

routerMessage.get("/", async (req, res) => {
    try {
      let users = await messagesModel.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

 export default routerMessage;