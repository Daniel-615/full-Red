import {post} from '../models/post.js'
import {comment} from '../models/comment.js'
import {like} from '../models/like.js'
import {sequelize} from '../database/database.js';
import { users } from '../models/users.js';


export const getPub= async(req,res)=>{
  const from=Number(req.query.from)||0;
  const registers=5;
  try {
    const posts= await post.findAll({
      attributes: ['postId','title'],
      offset: from,
      limit: registers
    })  
    const total = await post.count();
    res.status(200).json({success: true, msgs: 'getPosts', posts,total});
  } catch (error) {
    return res.status(500).json({error: error.message});  
  }
};
// export const getPub = async (req, res) => {
//   const from = Number(req.query.from) || 0;
//   const registers = 5;
//   try {
//     const posts = await post.findAll({
//       attributes: [
//         'postId',
//         'title',
//         'content',
//         'image',
//         [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.postId = post.postId)'), 'likesCount']
//       ],
//       include: [
//         {
//           model: users,
//           attributes: ['userId', 'name']
//         }
//       ],
//       offset: from,
//       limit: registers
//     });   
//       const total = await post.count();
//       res.status(200).json({success: true, msgs: 'getPosts', posts,total});
//   } catch (error) {
//       return res.status(500).json({error: error.message});
//   }
// };

export const getPubId= async(req,res)=>{
    const {id}=req.params;
    try {
        const pub=await post.findOne({
            where: {postId: id}
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
        userId: id, 
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
    await post.update({title,content,image}, {where: {id}});
    res.send(`The information from Post ${id} has been updated`);
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
          id,
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
    const post = await post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ success: false, msgs: 'Post not found' });
    }
    const like = await post.createLike({ userId });
    post.likesCount = post.likesCount + 1;
    await post.save();
    res.status(200).json({ success: true, msgs: 'Post liked', like });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const delLikePub = async (req, res) => {
  
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
        where: {postId: id},
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