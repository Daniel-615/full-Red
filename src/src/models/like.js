import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
export const like = sequelize.define('Like', {
    likeId: {
        type: DataTypes.UUID,
        defaultValue: ()=> uuidv4(),
        primaryKey:true,
        allowNull: false
    }
}, {
    
});