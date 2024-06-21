import e from "express";
import passport from "passport";
import { checkAuth,loginUser,createUser } from "../controllers/auth.controller.js";
const router = e.Router();
//  /auth is already added in base path
router.post('/signup', createUser)
.post('/signin', passport.authenticate('local'), loginUser)
.get('/check',passport.authenticate('jwt'), checkAuth);

export const authRouter=router;