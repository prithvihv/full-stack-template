const express = require('express')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
const fs = require("fs")

var user = require('./routes/user');
var auth = require('./routes/auth');
var book = require('./routes/book');

require('./util/passport');

const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9 sha key

app.use('/auth', auth);
app.use('/api/user', user);
app.use('/api/book', book);
//  passport.authenticate('jwt', { session: false }), 
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(port, () => console.log(`Book app listening on port ${port}!`))