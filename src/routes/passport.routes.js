import {Router} from 'express';
import {getUsuarios,inicio,login,signup} from '../controllers/users.controllers.js';
import { verificarToken,tokengenerated } from '../controllers/auth.js';
import passport from 'passport';
const router=Router();
//signup
router.get('/signup',signup);
router.post('/signup',passport.authenticate('local-signup',{
    successRedirect: '/',
    failureRedirect: '/',
    passReqToCallback: true
}));

//json-viewer
router.get('/json-viewer',getUsuarios);
router.post('/json-viewer',tokengenerated);

//ruta logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      // After logout, redirect to the homepage
      res.redirect('/login');
    });
  });
//ruta redireccionar / si no esta autenticada
router.post('/',tokengenerated);
router.get('/',verificarToken,inicio);
router.get('/login',login);
//RUTA PASSPORT AUTENTICADA
router.post('/login',passport.authenticate('local-login',{
    failureRedirect:'/login',
    successRedirect: '/',
    passReqToCallback: true
}));
export default router;