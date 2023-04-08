import {post} from '../models/post.js'
import {comment} from '../models/comment.js'
export const getPub= async(req,res)=>{
    
};
export const getPubId= async(req,res)=>{
    const {id}=req.params;
    try {
        const pub=await post.findOne({
            where: {id}
        })
        res.status(200).json(pub);  
    } catch (error) {
        return res.json({error: error.message});
    }
};
export const postPub = async (req, res) => {
    const { id } = req.params;
    try {
      // Obtener los datos de la publicación desde el cuerpo de la solicitud
      const { title, content,image } = req.body;
  
      // Validar que se hayan proporcionado los datos necesarios
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and Post Required' });
      }
  
      // Crear un nuevo objeto de publicación utilizando los datos proporcionados
      const newPost = {
        title,
        content,
        image,
        userId: id, 
        createdAt: new Date()
      };
  
      // Guardar el objeto de publicación en la base de datos o almacenamiento adecuado
      const savedPost = await post.create(newPost); 
      return res.status(201).json(savedPost);
    } catch (error) {
      console.error(error);
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
    await post.update({title,content,image}, {where: {id}});
    res.send(`The information from Post ${id} has been updated`);
    } catch (error) {
        return res.json({message: error.message});
    }
};
export const deletePub = async (req, res) => {
    try {
      const { id } = req.params;
      await post.destroy({
        where: {
          id,
        },
      });
      res.status(200).json(`Post ${id} has been deleted successfully`);
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred while trying to delete the post' });
    }
};
  
export const postLikePub= async(req,res)=>{

};
export const delLikePub= async(req,res)=>{

};
export const getcom= async(req,res)=>{
    const {id}=req.params;
    try {
        const com=await comment.findOne({
            where: {id},
            exclude: ['createdAt','updatedAt']
        })
        if(!com){
            return res.json({message: 'Comment does not exist'})
        }
        res.status(200).json(com);  
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
        where: {id},
        attributes: ['userId']
    })
    if(!pub){
        return res.json({error: 'Post does not exist'});    
    }  
    const newPubCom = await comment.create({
        content,
        PostId: id,
        userId: pub.userId
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