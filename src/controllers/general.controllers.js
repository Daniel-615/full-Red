import { post} from "../models/post.js";
import {users} from '../models/users.js';
import {follower} from '../models/follower.js';
import {Op} from 'sequelize'
export const getInfoUser=async(req,res)=>{
    const {id}=req.params
    try {
        const data=await users.findOne({
            where: {id:id}
        })
        if(!data) return res.status(404).json({message: "User not found"});
        res.json(data);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};
export const UpdateInfoUser=async(req,res)=>{
    try {
        const { id}= req.params;
        const {username,email,password,bio,profilePicture} =req.body;
        const usuarios= await users.findByPk(id);
        if(!usuarios){
            return res.status(404).json({ message: "Account not found" });
        }
        await users.update(username,email,password,bio,profilePicture); 
        res.send(usuarios);    
    } catch (error) {
        return res.status(500).json({message:error.message});   
    }
}
export const DeleteAccUser=async(req,res)=>{
    try {
        const {id}=req.params;
        await users.destroy({
            where: {
                id,
            },
        })
        res.send('Deleted account');   
    } catch (error) {
        return res.status(500).json({message:error.message});
    }   
}
export const getPubUser=async(req,res)=>{
    const {id}=req.params;
    try {
        const data=await post.findAll({
            where: {id:id}
        })
        res.json(data);
    } catch (error) {
        return res.status(500).json({message:error.message});  
    }
}
export const getFollowersUser=async(req,res)=>{
  const { id } = req.params;

  try {
    // Buscar al usuario en la base de datos y sus seguidores
    const user = await users.findOne({
      where: { id },
      include: {
        model: follower,
        as: 'Followers',
        include: 'Follower'
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Devolver la lista de seguidores
    const followers = user.Followers.map(f => f.Follower);
    res.json(followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor.' });
  }

}
export const getFollowingUser=async(req,res)=>{
  const { id } = req.params;
  try {
    const user = await users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    const following = await user.getFollowing();
    res.json(following);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
}
export const postFollow = async (req, res) => {
  const { id } = req.params; // el id del usuario a seguir
  const { user } = req; // el usuario que sigue

  try {
    // buscar el usuario a seguir y el usuario que sigue en la base de datos
    const [userToFollow, userFollowing] = await Promise.all([
      users.findOne({
        where: { id: id },
      }),
      users.findOne({
        where: { id: user.id },
        include: [
          {
            model: follower,
            as: "Following",
            where: { id_user: id },
          },
        ],
      }),
    ]);

    if (!userToFollow || !userFollowing) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // asegurarse de que el usuario que sigue no esté siguiendo ya al usuario a seguir
    if (userFollowing.Following.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya estás siguiendo a este usuario." });
    }

    // actualizar el número de seguidores y seguidos
    userToFollow.Follower = (userToFollow.Follower || 0) + 1;
    userFollowing.Following = (userFollowing.Following || []).concat(userToFollow.id);

    // guardar los cambios en la base de datos
    await Promise.all([userFollowing.save(), userToFollow.save()]);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor." });
  }
};

  export const postUnfollow = async (req, res) => {
    const { id } = req.params; // el id del usuario a dejar de seguir
    const { user } = req; // el usuario que deja de seguir
  
    try {
      // buscar el usuario a dejar de seguir y el usuario que deja de seguir en la base de datos
      const userToUnfollow = await users.findOne({
        where: { id: id },
        include: [
          {
            model: users,
            as: 'Followers',
            where: { id: user.id } // filtrar solo los usuarios que están siguiendo al usuario que deja de seguir
          }
        ]
      });
  
      if (!userToUnfollow) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // actualizar el número de seguidores y seguidos
      userToUnfollow.Follower = (userToUnfollow.Follower || 0) - 1;
      user.Following = (user.Following || 0) - 1;
  
      // guardar los cambios en la base de datos
      await Promise.all([
        userToUnfollow.save(),
        user.save()
      ]);
  
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error del servidor.' });
    }
  };
  