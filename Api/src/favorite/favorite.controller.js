'use strict';

let moment = require('moment');
let mongoosePaginate = require('mongoose-pagination');
let FavoriteController = require('./favorite.model');
let Product = require('../product/product.model');

function saveFavorite(req, res) {
    let params = req.body;
    if (!params.productId) {
        return res.status(200).send({message: 'You should send a product'});
    }
    let favorite = new FavoriteController();
    favorite.userId = req.user.sub;
    favorite.productId = params.productId;
    favorite.createdAt = moment().format('L');
    favorite.save((err, favoriteStored) => {
        if (err) {
            return res.status(500).send({message: 'Error when you save a favorite'});
        }
        if (!favoriteStored) {
            return res.status(404).send({message: 'FavoriteController has not been save'});
        }
        return res.status(200).send({favorite: favoriteStored});
    });
}

async function getFavorites(req, res) {
    let favorites = await FavoriteController.find({"userId": req.user.sub}).exec(async (err, favorite) => {
        let productId = favorite[0].productId;
        return productId;
    });
    const pArray = favorites.map(async (favorite) => {
        const product = Product.findById(favorite.productId).exec(async (err, product) => {
            product.favoriteId = favorite.productId;
            return product;
        });
        return product;
    });
    const productFavorite = await Promise.all(pArray);
    return res.status(200).send({
        favorites: productFavorite
    });
}

function deleteFavorite(req, res) {
    let productId = req.params.id;
    FavoriteController.find({'userId': req.user.sub, 'productId': productId}).remove(err => {
        if (err) {
            return res.status(500).send({message: 'Error in favorite deletion'});
        }
        return res.status(200).send({message: 'FavoriteController deleted correctly'});
    });
}

module.exports = {
    saveFavorite,
    getFavorites,
    deleteFavorite,
};