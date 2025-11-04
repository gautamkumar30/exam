import { Router } from "express";
import { Trade } from "../models/Trade";
import { Types } from "mongoose";

const router: Router = Router();

router.get("/optimize/:userId", async (req, res) => {
  return null;
});

export default router;
