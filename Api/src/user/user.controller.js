'use strict';

let bcrypt = require('bcrypt-nodejs');
let mongoosePaginate = require('mongoose-pagination');
let jwt = require('../../services/jwt');
let UserController = require('./user.model');
let Follow = require('../follow/follow.model');
let Favorite = require('../favorite/favorite.model');
let Product = require('../product/product.model');

function saveUser(req, res) {
    let params = req.body;
    let user = new UserController();
    if (params.name && params.surname &&
        params.username && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.username = params.username;
        user.email = params.email;
        user.role = 'ROLE_USER';
        UserController.find({
            $or: [
                {email: user.email.toLowerCase()},
                {username: user.username.toLowerCase()}
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({message: 'UserController request error'});
            if (users && users.length >= 1) {
                return res.status(200).send({message: 'UserController exist'});
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        if (err) return res.status(500).send({message: 'Error when you save a user'});
                        if (userStored) {
                            res.status(200).send({user: userStored});
                        } else {
                            res.status(404).send({message: 'UserController not save'});
                        }
                    });
                });
            }
        });
    } else {
        res.status(200).send({
            message: 'Send all the necessary fields'
        });
    }
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    delete update.password;
    if (userId != req.user.sub) {
        return res.status(500).send({message: 'You have not got permission for update this user'});
    }
    UserController.find({
        $or: [
            {email: update.email.toLowerCase()},
            {username: update.username.toLowerCase()}
        ]
    }).exec((err, users) => {
        var user_isset = false;
        users.forEach((user) => {
            if (user && user._id != userId) user_isset = true;
        });
        if (user_isset) return res.status(404).send({message: 'Los datos ya están en uso'});
        UserController.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
            if (err) return res.status(500).send({message: 'Error en la petición'});
            if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            return res.status(200).send({user: userUpdated});
        });
    });
}

function loginUser(req, res) {
    let params = req.body;
    let email = params.email;
    let password = params.password;

    UserController.findOne({email: email}, (err, user) => {
        if (err) return res.status(500).send({message: 'Request error'});
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                } else {
                    return res.status(404).send({message: 'UserController can not identify 1'});
                }
            });
        } else {
            return res.status(404).send({message: 'UserController can not identify 2'});
        }
    });
}

async function getUser(req, res) {
    let userId = req.params.id;
    UserController.findById(userId, async (err, user) => {
        if (err) return res.status(500).send({message: 'Request error'});
        if (!user) return res.status(404).send({message: 'UserController not exist'});
        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed,
                favorites: value.favorites
            });
        });
    });
}

async function followThisUser(identity_user_id, user_id) {
    let following = await Follow.findOne({"user": identity_user_id, "follow": user_id}).exec((err, follow) => {
        if (err) return handleError(err);
        return follow;
    });
    let followed = await Follow.findOne({"user": user_id, "follow": identity_user_id}).exec((err, follow) => {
        if (err) return handleError(err);
        return follow;
    });
    let favorites = await Favorite.find({"userId": user_id}).exec(async (err, favorite) => {
        let productId = favorite[0].productId;
        return productId;
    });
    const pArray = favorites.map(async (favorite) => {
        const dataProduct = Product.findById(favorite.productId).exec(async (err, product) => {
            return product;
        });
        return dataProduct;
    });
    const productFavorite = await Promise.all(pArray);
    return {
        following: following,
        followed: followed,
        favorites: productFavorite
    }
}

function getUsers(req, res) {
    let identity_user_id = req.user.sub;
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    let itemsPerPage = 5;
    UserController.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({message: 'Request error'});
        if (!users) return res.status(404).send({message: 'Not exist users'});
        followUserIds(identity_user_id).then((value) => {
            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                favorites: value.favorites,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });
}

async function followUserIds(user_id) {
    let following = await Follow.find({"user": user_id}).select({
        '_id': 0,
        '__v': 0,
        'user': 0
    }).exec((err, follows) => {
        return follows;
    });
    let followed = await Follow.find({"follow": user_id}).select({
        '_id': 0,
        '__v': 0,
        'follow': 0
    }).exec((err, follows) => {
        return follows;
    });

    let following_clean = [];
    following.forEach((follow) => {
        following_clean.push(follow.follow);
    });

    let followed_clean = [];
    followed.forEach((follow) => {
        followed_clean.push(follow.user);
    });
    return {
        following: following_clean,
        followed: followed_clean
    }
}


module.exports = {
    saveUser,
    updateUser,
    loginUser,
    getUser,
    getUsers
}
