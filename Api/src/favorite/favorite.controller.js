'use strict';

const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');
const FavoriteController = require('./favorite.model');
const Product = require('../product/product.model');

function saveFavorite(req, res) {
    const params = req.body;

    if (!params.productId) {
        return res.status(200).send({message: 'You should send a product'});
    }

    const favorite = new FavoriteController();
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
    const favorites = await FavoriteController.find({"userId": req.user.sub}).exec(async (err, favorite) => {
        const productId = favorite[0].productId;
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
    const productId = req.params.id;
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
