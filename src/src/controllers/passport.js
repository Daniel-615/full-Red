import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import { users } from "../models/users.js";
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
// Configuración de Passport.js
passport.use('local-login',new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqtoCallback: true
}, async (username, password, done) => {
  
    // Buscar el usuario en la base de datos
     const user = await users.findOne({
      attributes: ['username', 'id', 'password'],
      where: { username: username }
    });

    if (!user) {
      // Usuario no encontrado
      return done(null, false, {message: 'User not found'});
    }
    // Comparar la contraseña ingresada con la guardada en la base de datos
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        // Contraseña incorrecta
        return done(null, false, { message: 'Incorrect password' });
    }
    // Autenticación exitosa
    if(isValidPassword){
      return done(null, user);
    }
}));
//signup
passport.use('local-signup',new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqtoCallback: true
}, async (username, password, done) => {
  
  const errors=[];
  if(password.length<4){
      errors.push({text: 'Password must have at least 4 characters..'})
  }
  if(username==''){
      errors.push({text: 'Username must not be empty'});
  }
  if(errors.length>0){
      res.render('signup',{
          errors,
          username
      });
      return done(null,false,errors);
  } else{
      const salt=await bcrypt.genSalt(8);
      password= await bcrypt.hash(password,salt);
  
      //comprobar si el usuaruo no existe
      const user = await users.findOne({
        attributes: ['username', 'id', 'password'],
        where: { username: username }
      });
      if(user){
          return done(null,false, {message: 'Username already exist'});
      } else{
            try {
              const newUsuario= await users.create({
                  username,
                  password
              })  
              return done(null,user);
            } catch (error) {
              console.log(error);
          }
      }
  }  
}));