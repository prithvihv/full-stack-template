var router = require('express').Router();
var { User, Book } = require('../util/db');
const { getToken } = require("../util/extra")
const passport = require('passport');


router.get('/', async (req, res, next) => {
    let dbres = await User.prototype.getAll()
    return res.json({ users: dbres.rows })
});
// passport.authenticate('jwt', { session: false }),
router.get('/:id', async (req, res, next) => {
    let u_id = req.params.id
    // console.log(u_id)
    let dbbookres = await Book.prototype.getUserBooks(u_id)
    let books = dbbookres.rows;
    let dbbookuser = await User.prototype.getbyid(u_id)
    let user = dbbookuser.rows[0];
    return res.json({ user: user, books: books })
});

router.post('/', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        // console.log(err, user, info)
        req.login(user, { session: false }, async (err) => {
            if (user) {
                // user already exists correct user name and pass()
                return res.status(400).json({ "message": "account already exists" })
            }
            if (err) {
                // internal err
                return res.status(500).json({ err });
            }
            if (!req.body.author_name) {
                return res.status(400).json({ message: "author name is not specified" })
            }
            // console.log(user, res)
            // console.log("sending req")

            try {
                let dbres = await User.prototype.create(req.body.username, req.body.password, req.body.author_name);
                let newUser = dbres.rows[0];
                let token = await getToken(newUser.u_id)
                // console.log("[AUTH] created new user", newUser)
                return res.status(200).json({ user: newUser, token: token });
            } catch (e) {
                if (e && e.detail && e.detail.includes("already exists")) {
                    return res.status(400).json({ message: "username already taken" });
                }
                console.log("internal err", e)
                return res.status(500).json({ error: e })
            }
        });
    })
        (req, res);

});

module.exports = router;