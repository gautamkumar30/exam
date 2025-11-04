import { Router } from "express";

const router: Router = Router();

router.get("/1b", async (req, res) => {
  res.send("1b");
});

export default router;
