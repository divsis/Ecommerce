import passport from "passport";

export const isAuth=(req, res, done) => {
    return passport.authenticate('jwt')
  };

export const sanitizeUser = (user)=>{
    return {id:user.id, role:user.role};
}

export const cookieExtractor=function(req){
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  // console.log(token)
  // //TODO : this is temporary token for testing without cookie
  console.log(token)
  //token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzQyNmZhMzBjZjY4ZWFjZWJmODEwNyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE4ODkxMDIyfQ.wDulPs507uBeifvlvT1VUS31Ie_PxtvN83zPzdSBjt0"
  return token;
}