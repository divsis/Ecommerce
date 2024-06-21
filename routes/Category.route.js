import express from "express";
import {fetchCategories,createCategory} from '../controllers/category.controller.js'

const router = express.Router();
//  /categories is already added in base path
router.get('/', fetchCategories).post('/',createCategory)

export const categoriesRouter = router;