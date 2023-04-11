import { post} from "../models/post.js";
import {users} from '../models/users.js';
import {follower} from '../models/follower.js';
import bcrypt from 'bcryptjs';


export const getInfoUser=async(req,res)=>{
    const {id}=req.params
    try {
        const data=await users.findOne({
            where: {userId:id},
            attributes: {
              exclude: ['password','createdAt','updatedAt']
            }
        })
        if(!data) return res.status(404).json({message: "User not found"});
        return res.json(data);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};

export const UpdateInfoUser=async(req,res)=>{
  const {userId}= req.params;
  const {username,email,bio,profilePicture}= req.body;
  if(!userId || !username ||!email ||!bio || !profilePicture){
    return res.json({error: 'Parameters are not valid'});
  }
  try {
    const usuarios= await users.findByPk(userId);
    if(!usuarios){
      return res.status(404).json({message: "Account not found"});
    }
    await users.update({username,email,bio,profilePicture}, {where: {userId}});
    res.status(201).json(`The info from user ${userId} has been updated`);
  } catch (error) {
    return res.json({message: error.message});
  }
}

export const resetpassword=async(req,res)=>{
  const {userId}= req.params;
  let {password}= req.body;
  try {
    const salt=await bcrypt.genSalt(8);
    password= await bcrypt.hash(password,salt);
    const usuarios= await users.findByPk(userId);
    if(!usuarios){
      return res.status(404).json({ message: "Account not found" });
    }
    await users.update({ password }, { where: {userId} });
    res.send('Password has been updated');
  } catch (error) {
     return res.json({message:error.message});  
  }
}

export const DeleteAccUser=async(req,res)=>{
    try {
        const {id}=req.params;
        await users.destroy({
            where: {
                userId: id,
            },
        })
        return res.status(200).json(`The account from the user ${id} has been deleted succesfully`);   
    } catch (error) {
      return res.json({message:error.message});   
    }   
}
export const getPubUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await post.findAll({
      where: { userUserId: id }, 
      exclude: ['createdAt','updatedAt'],
    });
    res.json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
};
// Función para obtener los seguidores de un usuario
export const getFollowersUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findOne({
      where: { userId: id },
      include: {
        model: follower,
        as: "Followers",
        attributes: ['id','followerId','userId'],
        include: {
          model: users,
          as: "Follower",
          attributes: ["userId", "username", "bio"],
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user.Followers);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const getFollowingUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findOne({
      where: { userId: id },
      include: {
        model: follower,
        as: "Followings",
        attributes: ['id','followerId','userId'],
        include: {
          model: users,
          as: "Following",
          attributes: ["userId", "username", "bio"],
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user.Followings);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const postFollow = async (req, res) => {
  const { id } = req.params; // el id del usuario a seguir, seguido
  const { followerId } = req.body; // el usuario que sigue, seguidor
  if (!id) {
    return res.status(400).json({ error: "Id parameter is required" });
  }
  if(id===followerId){
    return res.status(400).json({error: 'Is not possible to follow yourself '});
  }
  try {
    // buscar el usuario a seguir y el usuario que sigue en la base de datos
    const [userToFollow, userFollowing] = await Promise.all([
      users.findOne({
        where: { userId: id },
      }),
      users.findOne({
        where: { userId: followerId },
      }),
    ]);
    if (!userToFollow || !userFollowing) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar si ya existe un registro en la tabla follower que relacione al usuario que sigue con el usuario a seguir
    const existingFollower = await follower.findOne({
      where: { userId: id, followerId: followerId },
    });

    if (existingFollower) {
      return res.status(400).json({ error: "Already follow this user" });
    }

    // crear una nueva fila en la tabla follower para registrar el seguimiento
    const newFollower = await follower.create({
      userId: id, //seguido
      followerId: followerId, //seguidor
    });

    // actualizar el número de seguidores del usuario a seguir
    userToFollow.Followers = (userToFollow.Followers || 0) + 1;

    // actualizar los seguidos del usuario que sigue
    userFollowing.Following = (userFollowing.Following || []).concat(userToFollow.id);

    // guardar los cambios en la base de datos
    await Promise.all([userFollowing.save(), userToFollow.save()]);

    res.status(200).json({success: true});
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const postUnfollow = async (req, res) => {
  const { id } = req.params; // usuario al que hay que dejar de seguir
  const { userId } = req.body; // el usuario que deja de seguir

  if (!id || !userId) {
    return res.status(400).json({ error: "Parameters are not valid" });
  }
  if(id===userId){
    return res.status(400).json({error: 'Not possible to unfollow yourself'});
  }

  try {
    const numDeleted = await follower.destroy({
      where: { userId: id, followerId: userId },
    });
    
    if (numDeleted === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json('has been unfollowed');

  } catch (error) {
    res.json({ error: error.message });
  }
};