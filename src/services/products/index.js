import { Router } from "express";
import { Product, Review } from "../../db/models/index.js";
import sequelize from "sequelize";
import createError from 'http-errors'
import { uploadOnCloudinary } from '../../settings/cloudinary.js'

const { Op } = sequelize

const router = Router()

router.route('/')
    // ===============  RETRIEVES LIST OF PRODUCTS =======================
    .get( async (req, res, next) => {
        try {
            const filters = []
            const keys = Object.keys(req.query)

            keys.forEach(key => {
                let element

                if(key === 'price') {
                    const compareSymbol = Object.values(req.query)[0].slice(0,1)
                    compareSymbol === '>'
                    ?   element = { [key]: {[Op.gte]: parseInt(req.query[key].slice(1))} }
                    :  compareSymbol === '<' 
                        ? element = { [key]: {[Op.lte]: parseInt(req.query[key].slice(1))} }
                        : 
                        element = { [key]: {[Op.eq]: parseInt(req.query[key])} }
                } else {
                    element = { [key]: {[Op.substring]: req.query[key]} }
                }
                filters.push(element)
            })

            const data = await Product.findAll({
                where: filters.length > 0 
                        ? {[Op.or]: filters}
                        : {}
            })
            res.send(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    })
    // ===============  CREATES A NEW PRODUCT =======================
    .post( async (req, res, next) => {
        try {
            const data = await Product.create(req.body)
            res.send(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

router.route('/:productId')
    // ===============  RETRIEVES SINGLE PRODUCT =======================
    .get( async (req, res, next) => {
        try {
            const data = await Product.findByPk(req.params.productId)
            res.send(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    })
    // ===============  UPDATES A PRODUCT =======================
    .put( async (req, res, next) => {
        try {
            const data = await Product.update( 
                req.body, 
                {
                    where: { id: req.params.productId},
                    returning: true,
                }
            )
            res.send(data[1][0])
        } catch (error) {
            console.log(error)
            next(error)
        }
    })
    // ===============  DELETES A PRODUCT =======================
    .delete( async (req, res, next) => {
        try {
            const rowsCount = await Product.destroy({where: {id: req.params.productId}})
            if(rowsCount === 0) {
                res.status(404).send(`Product with id: ${req.params.productId} Not Found!`)
            } else {
                res.send(`Product with id: ${req.params.productId}, successfully deleted!`)
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    // ===============  UPLOADS IMAGE TO PRODUCT =======================

router.route('/:productId/uploadImage')
    .post(uploadOnCloudinary.single('imageUrl'), async (req, res,next) => {
    try {
        const data = await Product.update( 
            {imageUrl: req.file.path}, 
            {
                where: { id: req.params.productId},
                returning: true,
            }
        )
        res.send(data[1][0])
    } catch (error) {
        console.log(error)
        next(createError(500, "An Error ocurred while uploading Image to product"))
    }
})

// *****************************************************************************
//                                 REVIEWS
// *****************************************************************************


router.route('/:productId/reviews')
    // ===============  RETRIEVES LIST OF REVIEWS FROM A PRODUCT =======================
    .get( async (req, res, next) => {
        try {
            const data = await Review.findAll({
                where: { productId: req.params.productId},
            })
            res.send(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    })
    // ===============  CREATES NEW REVIEW ON A PRODUCT =======================
    .post( async (req, res, next) => {
        try {
            const data = await Review.create({...req.body, productId: req.params.productId })
            res.send(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

router.route('/:productId/reviews/:reviewId')
   // ===============  RETRIEVES SINGLE REVIEW =======================
    .get( async (req, res, next) => {
        try {
            const { productId, reviewId } = req.params
            const data = await Review.findByPk(reviewId)
            res.send(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    })
    // ===============  UPDATES A REVIEW =======================
    .put( async (req, res, next) => {
        try {
            const data = await Review.update(req.body, {
                where: { id: req.params.reviewId},
                returning: true,
            })

            res.send(data[1][0])
        } catch (error) {
            console.log(error)
            next(error)
        }
    })
    // ===============  DELETES A REVIEW =======================
    .delete( async (req, res, next) => {
        try {
            const rowsCount = await Review.destroy({ where: { id: req.params.reviewId} })

            if(rowsCount === 0) {
                res.status(404).send(`Review with id: ${req.params.reviewId} Not Found!`)
            } else {
                res.send(`Review with id: ${req.params.reviewId}, successfully deleted!`)
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    })
    export default router