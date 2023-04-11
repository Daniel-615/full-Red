import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
export const post = sequelize.define('Post', {
    postId: { 
        type: DataTypes.UUID,
        defaultValue: ()=> uuidv4(),
        primaryKey: true 
    },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    image: DataTypes.STRING
}, {
    
});
