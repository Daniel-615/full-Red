import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { post } from './post.js';
import { like } from './like.js';

// Define el modelo de unión
export const likedposts = sequelize.define('likedposts', {
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: post,
      key: 'postId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  },
  likeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: like,
      key: 'likeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }
});
