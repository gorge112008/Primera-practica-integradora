import { Router } from "express";
import { ProductFM, CartFM, MessageFM} from "../dao/classes/DBmanager.js";

const routerMessage = Router();

  routerMessage.get("/messages", async (req, res) => {
    try {
      let messages = await MessageFM.getMessages();
      const limit = req.query.limit;
      if (limit && !isNaN(Number(limit))) {
        messages = messages.slice(0, limit);
      }
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
  
  routerMessage.get("/messages/:mid", async (req, res) => {
    try {
      const mid = req.params.mid;
      let message = await MessageFM.getMessageId(mid);
      res.status(200).send(message);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
  
  routerMessage.post("/messages", async (req, res) => {
    try {
      const newMessage = req.body;
      let productsFind = [];
      if (newMessage.products) {
        newMessage.products.forEach((productItem) => {
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
        newMessage.products = productsFind;
        const response = await MessageFM.addMessage(newMessage);
        res.status(200).send(response);
      } else {
        res.status(400).send("Bad Request--> The message is not valid");
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
  
  routerMessage.delete("/messages/:mid", async (req, res) => {
    try {
      const mid = req.params.mid;
      await MessageFM.deleteMessage(mid);
      res.status(200).json(mid);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

 export default routerMessage;