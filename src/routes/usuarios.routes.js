import {Router} from 'express';
import {getInfoUser,UpdateInfoUser,DeleteAccUser,getPubUser,getFollowersUser,getFollowingUser,postFollow,postUnfollow,resetpassword} from '../controllers/usuarios.controllers.js';
const router=Router();
//devuelve la información de un usuario
router.get('/api/users/:id',getInfoUser);
//actualiza la información de un usuario
router.put('/api/users/:userId',UpdateInfoUser);
//ruta reset password
router.put('/api/users/resetpassword/:userId',resetpassword);
//elimina la cuenta de un usuario
router.delete('/api/users/:id',DeleteAccUser);
//devuelve las publicaciones de un usuario
router.get('/api/users/:id/posts',getPubUser);
//devuelve los seguidores de un usuario
router.get('/api/users/:id/followers',getFollowersUser);
// devuelve a quiénes sigue un usuario
router.get('/api/users/:id/following',getFollowingUser);
//permite que un usuario siga a otro usuario
router.post('/api/users/:id/follow',postFollow);
//permite que un usuario deje de seguir a otro usuario
router.post('/api/users/:id/unfollow',postUnfollow);
export default router;