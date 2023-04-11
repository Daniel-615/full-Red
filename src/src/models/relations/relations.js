//modelados
import {sequelize} from '../../database/database.js';
import {users} from '../users.js';
import {follower} from '../follower.js';
import {like} from '../like.js';
import {comment} from '../comment.js';
import {post} from '../post.js';

users.hasMany(follower, { as: "Followings", foreignKey: "followerId" });  //seguidor
follower.belongsTo(users, { as: "Follower", foreignKey: "followerId" });
users.hasMany(follower, { as: "Followers", foreignKey: "userId" }); //seguido
follower.belongsTo(users, { as: "Following", foreignKey: "userId" });

users.hasMany(post);
users.hasMany(comment);

post.belongsTo(users);
post.hasMany(comment);
post.hasMany(like);

  

comment.belongsTo(users);
comment.belongsTo(post);
//table like
like.belongsTo(users);
like.belongsTo(post);


//esta parte es lo que no entiendo
post.belongsToMany(users, { 
    through: 'likedPosts',
    foreignKey: 'postId',
    otherKey: 'userId'
});
  
users.belongsToMany(post, { 
    through: 'likedPosts',
    foreignKey: 'userId',
    otherKey: 'postId'
});
  
post.belongsToMany(like, {
    through: 'likedPosts',
    foreignKey: 'postId',
    otherKey: 'likeId'
});
  
like.belongsToMany(post, {
    through: 'likedPosts',
    foreignKey: 'likeId',
    otherKey: 'postId'
});