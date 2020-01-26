const passport = require('passport');
const passportJWT = require("passport-jwt");
const fs = require("fs")
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const path = require("path")
var publicKey = fs.readFileSync(path.resolve(__dirname, '../secret/jwtRS256.key.pub'));
console.log("[PUBLIC-KEY] : ", publicKey.toString())
const { User } = require("./db")

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    async function (uname, pword, cb) {
        try {
            let res = await User.prototype.getbyUnamePass(uname, pword)
            let user = res.rows[0]
            if (user) {
                console.log("user local", user)
                return cb(null, user, { message: 'Logged In Successfully' })
            } else {
                return cb(null, false, { message: 'Incorrect email or password.' })
            }
        } catch (e) {
            console.log("err local", e)
            return cb(e)
        }
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    algorithms: ["RS256"]
},
    async function (jwtPayload, cb) {
        console.log("in JWT", jwtPayload)
        //find the user in db if needed
        try {
            let dbres = await User.prototype.getbyid(jwtPayload.u_id)
            let user = dbres.rows[0]
            if (user)
                return cb(null, user)
        } catch (e) {
        }
        return cb(null)
    }
));