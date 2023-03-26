//modelados
import {sequelize} from '../../database/database.js';
import {users} from '../users.js';
import {follower} from '../follower.js';
import {like} from '../like.js';
import {comment} from '../comment.js';
import {post} from '../post.js';


users.hasMany(post);
users.hasMany(follower, { as: 'Followers' });
users.hasMany(follower, { as: 'Following' });
users.belongsToMany(post, { through: 'LikedPosts' });
users.hasMany(comment);

post.belongsTo(users);
post.belongsToMany(users, { through: 'Likes' });
post.hasMany(comment);

follower.belongsTo(users, { as: 'Follower' });
follower.belongsTo(users, { as: 'Following' });

like.belongsTo(users);
like.belongsTo(post);

comment.belongsTo(users);
comment.belongsTo(post);
