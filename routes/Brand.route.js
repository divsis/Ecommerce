import express from "express";
import {fetchBrands,createBrand} from '../controllers/brand.controller.js'

const router = express.Router();
//  /brands is already added in base path
router.get('/', fetchBrands).post('/', createBrand);

export const brandsRouter = router;
