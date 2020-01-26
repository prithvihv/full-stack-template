const axios = require("axios").default
const qs = require("querystring")

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

module.exports = {
    getToken: getToken
}