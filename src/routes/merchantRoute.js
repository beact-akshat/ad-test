const express = require('express');
const { APILOG } = require('../middleware/logger');
const { googleMerchant } = require('./googleMerchant');
const { log } = require('../helper/logger');
const route = express.Router()


// sync merchant products
route.get('/google/products', APILOG, async (req, res) => {
    const msg = 'Product List'
    try {
        const response = await googleMerchant()
        const product = response.data.resources
        res.status(200).send({ code: 200, success: true, message: msg, data: product })
    } catch (error) {
        res.status(400).send({ code: 400, success: false, error: error.message })
    }
})

module.exports = route