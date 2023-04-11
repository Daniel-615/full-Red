import {sequelize} from '../../database/database.js';
import {users} from '../users.js';
import {follower} from '../follower.js';
import {like} from '../like.js';
import {comment} from '../comment.js';
import {post} from '../post.js';
import {likedposts} from '../likedposts.js';

users.hasMany(follower, { as: "Followings", foreignKey: "followerId" });
follower.belongsTo(users, { as: "Follower", foreignKey: "followerId" });
users.hasMany(follower, { as: "Followers", foreignKey: "userId" });
follower.belongsTo(users, { as: "Following", foreignKey: "userId" });

users.hasMany(post);
users.hasMany(comment);

post.belongsTo(users);
post.hasMany(comment);
post.hasMany(like);

comment.belongsTo(users);
comment.belongsTo(post);

like.belongsTo(users);
like.belongsTo(post);

users.belongsToMany(post, { as: 'LikedPosts', through: likedposts });
post.belongsToMany(users, { as: 'LikedByUsers', through: likedposts });

users.belongsToMany(like, { as: 'LikedLikes', through: likedposts });
like.belongsToMany(users, { as: 'LikedByUsers', through: likedposts });