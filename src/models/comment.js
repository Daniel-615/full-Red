import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
export const comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: ()=> uuidv4(),
        primaryKey:true
    },
  content: DataTypes.STRING
}, {
    
});