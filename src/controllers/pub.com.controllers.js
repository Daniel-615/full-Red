import {post} from '../models/post.js'
import {comment} from '../models/comment.js'
import {like} from '../models/like.js'
import { users } from '../models/users.js';


export const getPub = async (req, res) => {
  const from = Number(req.query.from) || 0;
  const registers = 5;
  const includeLikes = req.query.includeLikes === 'true'; // determina si se deben incluir los detalles de los likes en la respuesta
  try {
    let posts;
    if (includeLikes) {
      // si se incluyen los detalles de los likes, se incluye el modelo de Like en la consulta
      posts = await post.findAll({
        //attributes: ['postId', 'title'],
        offset: from,
        limit: registers,
        include: {
          model: like,
          attributes: ['likeId', 'PostPostId', 'userUserId']
        },
      });
    } else {
      // si no se incluyen los detalles de los likes, solo se cuenta el número total de likes
      posts= await post.findAll({
        //attributes: ['postId','title'],
        offset: from,
        limit: registers
      });
      const totalLikes = await like.count();
      const totalPosts= await post.count();
      return res.status(200).json({ success: true, msgs: 'getPosts',posts,totalPosts, totalLikes });
    }
    const total = await post.count();
    res.status(200).json({ success: true, msgs: 'getPosts', posts, total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPubId= async(req,res)=>{
    const {id}=req.params;
    try {
        const pub=await post.findOne({
            where: {postId: id},
            attributes: ['postId','title','content']
        })
        res.status(200).json(pub);  
    } catch (error) {
        return res.json({error: error.message});
    }
};
export const postPub = async (req, res) => {
    const { id } = req.params;
    try {
      const {title,content,image } = req.body;
    if ( !title ||!content || !image) {
        return res.status(400).json({ message: 'title content and image Required' });
      }
      const newPost = {
        title,
        content,
        image,
        userUserId: id, 
        createdAt: new Date()
      };
  
      // Guardar el objeto de publicación en la base de datos o almacenamiento adecuado
      const savedPost = await post.create(newPost); 
      return res.status(201).json({sucess: true});
    } catch (error) {
      return res.status(500).json({ message: 'Ocurrió un error al intentar crear la publicación' });
    }
  };
  
export const updatePub= async(req,res)=>{
    const {id}=req.params;
    const {title,content,image}= req.body;
    if(!id){
        return res.json({error: 'Required Id'});
    }
    if(!title||!content || !image){
        return res.json({error: 'Parameters are not valid'});
    }
    try {
        const pub= await post.findByPk(id);
    if(!pub){
      return res.status(404).json({message: "Post not found"});
    }
    await post.update({title,content,image}, {where: {postId: id}});
    res.status(201).json(`The information from Post ${id} has been updated`);
    } catch (error) {
        return res.json({message: error.message});
    }
};
export const deletePub = async (req, res) => {
  const { id } = req.params;
  if(!id){
    return res.json({message: 'ID REQUIRED'});
  }  
  try {
      await post.destroy({
        where: {
          postId: id,
        },
      });
      res.status(200).json(`Post ${id} has been deleted successfully`);
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred while trying to delete the post' });
    }
};
  
export const postLikePub = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    // Buscamos el post y comprobamos que exista
    const foundPost = await post.findByPk(postId);
    if (!foundPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Creamos el like asociado al usuario y al post
    const createdLike = await like.create({ userUserId:userId, PostPostId:postId });
    res.status(201).json({sucess: true});
  } catch (error) {

    res.status(500).json({ message: 'Error creating like' });
  }
};


export const delLikePub = async (req, res) => {
  const {postId} =req.params;
  const {userId} =req.body;

  try {
    // Buscamos el usuario y el post
    const user = await users.findByPk(userId);
    const Post = await post.findByPk(postId);

    // Verificamos que ambos existan
    if (!user || !Post) {
      return res.status(404).json({ message: "User or post not found" });
    }

    // Verificamos que el usuario haya dado like al post
    const Like = await like.findOne({
      where: { userUserId:userId, PostPostId: postId },
    });

    if (!Like) {
      return res
        .status(404)
        .json({ message: "User has not liked the post" });
    }

    // Eliminamos el like
    await like.destroy({
      where: {likeId: Like.likeId}
    });

    return res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getcom= async(req,res)=>{
    const {id}=req.params;
    try {
        const com=await comment.findOne({
            where: {id},
            attributes: ['id','content']
        })
        if(!com){
            return res.json({message: 'Comment does not exist'})
        }
        res.status(200).json({suces: true, msg: 'getComments', com});  
    } catch (error) {
        return res.json({error: error.message});
    }
};
export const postcom = async (req, res) => {
    const { id } = req.params;
    const { content} = req.body;
    if(!id){
        return res.json({error: 'Required Id'});
    }
    if(!content){
        return res.json({error: 'Content not valid'});
    }
    try {
    const pub=await post.findOne({
        where: {postId: id},
        attributes: ['userUserId']
    })
    if(!pub){
        return res.json({error: 'Post does not exist'});    
    }  
    const newPubCom = await comment.create({
        content,
        PostPostId: id,
        userUserId: pub.userUserId
    });
    res.json(newPubCom);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } 
};  
export const updatecom= async(req,res)=>{
    const {id}= req.params;
    const {content}= req.body;
    if(!id){
        return res.json({error: 'Required Id'});
    }
    if(!content){
        return res.json({error: 'Required Content'});   
    }
    try {
        const com= await comment.findByPk(id);
    if(!com){
      return res.status(404).json({message: "Comment not found"});
    }
    await comment.update({content}, {where: {id}});
    res.send(`The information from Comment ${id} has been updated`);
    } catch (error) {
        return res.json({message: error.message});
    }
};
export const delcom= async(req,res)=>{
    const {id}=req.params;
    if(!id){
        return res.json({error: 'Required Id'});
    }
    try {
        await comment.destroy({
          where: {
            id,
          },
        });
        res.status(200).json(`Comment ${id} has been deleted successfully`);
      } catch (error) {
        return res.json({message: error.message});
    }
};