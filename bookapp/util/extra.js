const axios = require("axios").default
const qs = require("querystring")
const fs = require("fs")
const path = require("path")
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync(path.resolve(__dirname, '../secret/jwtRS256.key'));

// current not using was plannin on making a token providing services
let getToken = async (u_id) => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const requestBody = {
        "u_id": u_id
    }
    let response = await axios.post('http://localhost:7777/auth', qs.stringify(requestBody), config)
    // console.log(response)
    const token = response.data;
    return token
}

//https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9 sha key
let createToken = async (payload) => {
    var token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    return token
}

module.exports = {
    getToken: createToken
}