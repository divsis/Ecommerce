import e from "express";
import passport from "passport";
import { checkAuth,loginUser,createUser ,resetPassword,resetPasswordRequest,logout} from "../controllers/auth.controller.js";
const router = e.Router();
//  /auth is already added in base path
router.post('/signup', createUser)
.post('/signin', passport.authenticate('local'), loginUser)
.get('/check',passport.authenticate('jwt'), checkAuth)
.post('/reset-password-request', resetPasswordRequest)
.post('/reset-password', resetPassword)
.get('/logout', logout)

export const authRouter=router;