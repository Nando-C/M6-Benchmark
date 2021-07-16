import sequelize from "../config/index.js";
import s from 'sequelize'

const { DataTypes } = s

const Review = sequelize.define('review', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    comment:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rate:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

export default Review