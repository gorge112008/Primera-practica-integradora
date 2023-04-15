import { Router } from "express";
import { userModel } from "../dao/models/users.model.js";

const routerUser = Router();

routerUser.get("/users", async (req, res) => {
    try {
      let users = await userModel.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

  routerUser.post("/users", async (req, res) => {
    try {
      let {first_name, last_name, email}= req.body;
      if(!first_name||!last_name||!email)
      return res.send({status:"error", error: "Incomplete Values"});
      let result= await userModel.create({
        first_name,
        last_name,
        email
      })
      res.send({status:"success", payload:result})
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

 export default routerUser;