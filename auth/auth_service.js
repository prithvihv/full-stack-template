const express = require('express')
const app = express()
const port = 7777
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require("fs")
const path = require("path")

var privateKey = fs.readFileSync(path.resolve(__dirname, './jwtRS256.key'));
var publicKey = fs.readFileSync(path.resolve(__dirname, "jwtRS256.key.pub"));
/*
curl -X POST http://localhost:7777/auth -H 'content-type: application/x-www-form-urlencoded' -d 'id=78&user_name=prithvi&password=prithvi'
  */


// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/auth', (req, res) => {
  console.log(req.body)
  let payload = {
    u_id: req.body.u_id,
    // user_name: req.body.user_name,
    // password: req.body.password
  }
  console.log(payload)
  var token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  console.log(token)
  log(token)
  res.send(token)
})

function log(token) {
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function (err, decoded) {
    if (err) {
      console.log(err)
    } else {
      console.log("Message is :", decoded) // bar
    }
  });
}

module.exports = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9 sha key