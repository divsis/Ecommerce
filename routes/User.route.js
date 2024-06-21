import e from "express";
import { fetchUserById,updateUser } from "../controllers/user.controller.js";

const router = e.Router();

router.get('/own', fetchUserById)
      .patch('/:id', updateUser)

export const userRouter=router;