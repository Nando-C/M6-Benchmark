import sequelize from "../config/index.js";
import s from 'sequelize'

const { DataTypes } = s

const Category = sequelize.define('categories', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

export default Category