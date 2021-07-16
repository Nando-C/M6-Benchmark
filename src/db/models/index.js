import sequelize from "../config/index.js"
import Product from "./ProductModel.js"
import Review from "./ReviewModel.js"

Product.hasMany(Review, {foreignKey: {allowNull: false}})
Review.belongsTo(Product, {foreignKey: {allowNull: false}})

// ================================================================================



export { sequelize, Product, Review  }