import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
export const LikedPosts = sequelize.define('LikedPosts', {
    id: { type: DataTypes.UUID,
        defaultValue: ()=> uuidv4(), 
        primaryKey: true 
    },
  });