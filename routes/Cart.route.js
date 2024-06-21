import e from "express";
import { addToCart,fetchCartByUser,updateCart,deleteFromCart } from "../controllers/cart.controller.js";

const router = e.Router();

router.post('/', addToCart)
      .get('/', fetchCartByUser)
      .delete('/:id', deleteFromCart)
      .patch('/:id', updateCart)

export const cartRouter=router;