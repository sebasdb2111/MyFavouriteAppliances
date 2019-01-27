'use strict';

let mongoosePaginate = require('mongoose-pagination');
let User = require('../models/user');
let Follow = require('../models/follow');

function saveFollow(req, res) {
    let params = req.body;
    let follow = new Follow();
    follow.user = req.user.sub;
    follow.follow = params.followed;
    follow.save((err, followStored) => {
        if (err) return res.status(500).send({message: 'Error to save follow'});
        if (!followStored) return res.status(404).send({message: 'Follow has not save'});
        return res.status(200).send({follow: followStored});
    });
}

function deleteFollow(req, res) {
    let user = req.user.sub;
    let follow = req.params.id;
    Follow.find({'user': user, 'follow': follow}).remove(err => {
        if (err) return res.status(500).send({message: 'Error al dejar de seguir'});
        return res.status(200).send({message: 'El follow se ha eliminado!!'});
    });
}

function getFollowingUsers(req, res) {
    let userId = req.user.sub;
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }
    let itemsPerPage = 4;
    Follow.find({user: userId}).populate({path: 'follow'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({message: 'Server error'});
        if (!follows) return res.status(404).send({
            message: '\n' + 'You are not following any user'
        });
        followUserIds(req.user.sub).then((value) => {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed,
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


function getFollowedUsers(req, res) {
    let userId = req.user.sub;
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    let itemsPerPage = 4;
    Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({message: 'Error en el servidor'});
        if (!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});
        followUserIds(req.user.sub).then((value) => {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed,
            });
        });
    });
}

function getMyFollows(req, res) {
    let userId = req.user.sub;
    let find = Follow.find({user: userId});
    if (req.params.followed) {
        find = Follow.find({follow: userId});
    }

    find.populate('user follow').exec((err, follows) => {
        if (err) return res.status(500).send({message: 'Error en el servidor'});
        if (!follows) return res.status(404).send({message: 'No sigues ningun usuario'});
        return res.status(200).send({follows});
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}
