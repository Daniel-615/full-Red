import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
export const users = sequelize.define('users', {
    id: { 
        type: DataTypes.UUID,
        defaultValue: ()=> uuidv4(), 
        primaryKey: true 
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    profilePicture: DataTypes.STRING
}, {
    
});
