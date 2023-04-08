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
users.belongsToMany(post, { through: 'LikedPosts' });
users.hasMany(comment);

post.belongsTo(users);
post.belongsToMany(users, { through: 'Likes' });
post.hasMany(comment);



//table like
like.belongsTo(users);
like.belongsTo(post);

comment.belongsTo(users);
comment.belongsTo(post);
