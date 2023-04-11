import {Router} from 'express';
import {getPub,getPubId,postPub,updatePub,deletePub,postLikePub,delLikePub,getcom,postcom,updatecom,delcom} from '../controllers/pub.com.controllers.js'
const router=Router();

//devuelve todas las publicaciones
router.get('/api/posts',getPub);
//devuelve una publicación en particular
router.get('/api/posts/:id',getPubId);
//permite que un usuario cree una nueva publicación
router.post('/api/posts/:id',postPub);
//permite que un usuario actualice una publicación existente
router.put('/api/posts/:id',updatePub);
//permite que un usuario elimine una publicación existente
router.delete('/api/posts/:id',deletePub);
//permite que un usuario de "me gusta" a una publicación
router.post('/api/posts/:postId/like',postLikePub);
//permite que un usuario elimine un "me gusta" de una publicación
router.delete('/api/posts/:id/like',delLikePub);
//devuelve un comentario en particular
router.get('/api/comments/:id',getcom);
//permite que un usuario agregue un comentario a una publicación
router.post('/api/posts/:id/comments',postcom);
//permite que un usuario actualice un comentario existente
router.put('/api/comments/:id',updatecom);
//permite que un usuario elimine un comentario existente
router.delete('/api/comments/:id',delcom);
export default router;