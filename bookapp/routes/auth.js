const express = require('express');
const router = express.Router();
const axios = require("axios").default;
const jwt = require('jsonwebtoken');
const passport = require('passport');
const qs = require('querystring')
const { User } = require("../util/db");
const { getToken } = require("../util/extra")

router.post('/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        console.log("int auth", info)
        if (user) {
            try {
                let token = await getToken(user.u_id)
                return res.status(200).json({
                    message: info.message,
                    token: token,
                    user: user
                });
            } catch (e) {
                console.log(e)
            }
        }
        return res.status(400).json({
            message: info ? info.message : 'Login failed',
            user: user
        });
    })(req, res);
});


module.exports = router;