import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
export const follower = sequelize.define('Follower', {
    id: {
        type: DataTypes.UUID,
        defaultValue: ()=> uuidv4(),
        primaryKey:true
    }
}, {
    
});