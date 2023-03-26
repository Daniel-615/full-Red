import jwt from 'jsonwebtoken';
import { users} from "../models/users.js";
// // Generar un token para el usuario autenticado
export const tokengenerated = async (req,res)=>{
    const {username}=req.body;
    if(!username){
        return res.json({error: 'El campo username se encuentra vacio'});
    }
    const user=await users.findOne({
    attributes: ['username', 'id', 'password'],
    where: { username: username }
    });
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { usernames, id, password } = user;
    const payload = { usernames, id, password };
    //const token = jwt.sign(payload, 'claveSecreta');
    const token=jwt.sign({
      payload,
      exp: Date.now()+60*1000
    },'claveSecreta')
    // Enviar el token en la respuesta del servidor
    res.json({ token });
}

// Middleware para verificar el token
export function verificarToken(req, res, next) {
 try {
   // Obtener el token del encabezado de la solicitud
   const token = req.headers['authorization'];
   // Verificar si el token existe
   if (!token) {
     return res.status(401).json({ error: 'token has not been retrieved' });
   }
   // Verificar la validez del token
   const payload = jwt.verify(token.split(" ")[1], 'claveSecreta');
   //let payload=jwt.verify(token.split(" ")[1], 'claveSecreta', (err, decoded) => {
     if(Date.now()>payload.exp){
       return res.status(401).send({error: "token expired"})
     }
     next();
   
 } catch (error) {
    res.status(481).send({error: error.message});
 }
}