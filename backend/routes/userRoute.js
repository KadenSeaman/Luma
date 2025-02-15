const express = require('express');

const router = express.Router({mergeParams:true});

module.exports = router;

const createUser = require('../apis/User/createUser.js');

module.exports = {
    createUser,
}