import { Router } from "express";
import { userModel } from "../models/users.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
      let users = await userModel.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({error: err});
    }
  });

  export default router;