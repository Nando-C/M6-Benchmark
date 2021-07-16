import sequelize from "../config/index.js"
import Product from "./ProductModel.js"
import Review from "./ReviewModel.js"
import Category from "./CategoryModel.js"

Product.hasMany(Review, {foreignKey: {allowNull: false}})
Review.belongsTo(Product, {foreignKey: {allowNull: false}})

// ================================================================================

Product.beforeValidate((user) => {
    if(!user.imageUrl) {
        user.imageUrl = `https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png`
    }
})

export { sequelize, Product, Review, Category  }