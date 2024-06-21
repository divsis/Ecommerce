import express from "express";

import { createProduct, fetchAllProducts, fetchProductById, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();
//  /products is already added in base path
router.post('/', createProduct)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductById)
      .patch('/:id', updateProduct)

export const productRouter = router;