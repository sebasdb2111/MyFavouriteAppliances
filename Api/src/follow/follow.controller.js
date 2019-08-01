'use strict';

const mongoosePaginate = require('mongoose-pagination');
const User = require('../user/user.model');
const FollowController = require('./follow.model');

function saveFollow(req, res) {
    const params = req.body;
    const follow = new FollowController();

    follow.user = req.user.sub;
    follow.follow = params.followed;
    follow.save((err, followStored) => {
        if (err) return res.status(500).send({message: 'Error to save follow'});
        if (!followStored) return res.status(404).send({message: 'FollowController has not save'});
        return res.status(200).send({follow: followStored});
    });
}

function deleteFollow(req, res) {
    const user = req.user.sub;
    const follow = req.params.id;

    FollowController.find({'user': user, 'follow': follow}).remove(err => {
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
    if (!req.params.page) {
        page = req.params.id;
    } else {
        page = req.params.page;
    }

    const itemsPerPage = 4;
    FollowController.find({user: userId}).populate({path: 'follow'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) {
            return res.status(500).send({message: 'Server error'});
        }

        if (!follows) {
            return res.status(404).send({
                message: '\n' + 'You are not following any user'
            });
        }

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
    const following = await FollowController.find({"user": user_id}).select({
        '_id': 0,
        '__v': 0,
        'user': 0
    }).exec((err, follows) => {
        return follows;
    });

    const followed = await FollowController.find({"follow": user_id}).select({
        '_id': 0,
        '__v': 0,
        'follow': 0
    }).exec((err, follows) => {
        return follows;
    });

    const following_clean = [];
    following.forEach((follow) => {
        following_clean.push(follow.follow);
    });

    const followed_clean = [];
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

    const itemsPerPage = 4;
    FollowController.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
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
    const userId = req.user.sub;
    let find = FollowController.find({user: userId});
    if (req.params.followed) {
        find = FollowController.find({follow: userId});
    }

    find.populate('user follow').exec((err, follows) => {
        if (err) {
            return res.status(500).send({message: 'Error en el servidor'});
        }

        if (!follows) {
            return res.status(404).send({message: 'No sigues ningun usuario'});
        }

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
