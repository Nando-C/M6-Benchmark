import { Router } from "express";
import { Product, Review } from "../../db/models/index.js";
import sequelize from "sequelize";

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

    export default router