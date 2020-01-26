const { Client } = require('pg')

const client = new Client({
    host: '127.0.0.1',
    database: 'book_store',
    port: 5432,
    user: 'postgres',
    password: 'pageupto123',
})

let User = function () { }

User.prototype.create = async (uname, pass, aname) => {
    const text = 'INSERT INTO users (username,password,auther_name) VALUES($1, $2,$3) RETURNING *'
    const values = [uname, pass, aname]
    let result = await client.query(text, values);
    console.log(`[DB] inserted into User : ${uname}`)
    return result
    // try {
    // } catch (e) {
    //     console.log(e.detail)
    // }
}
User.prototype.getbyid = async (id) => {
    const text = 'SELECT u_id,username,auther_name FROM users WHERE u_id=$1;'
    const values = [id]
    let result = await client.query(text, values);
    return result
}

User.prototype.getAll = async () => {
    const text = 'SELECT u_id,username,auther_name FROM users;'
    let result = await client.query(text);
    return result
}

User.prototype.getbyUnamePass = async (uname, pass) => {
    const text = 'SELECT * FROM users WHERE username=$1 and password =$2'
    const values = [uname, pass]
    let result = await client.query(text, values);
    return result;
}

let Book = function () { }

Book.prototype.create = async (t, d, curl, p, u_id) => {
    const text = 'INSERT INTO users (title,description,cover_url,price,u_id) VALUES($1, $2, $3, $4, $5) RETURNING *'
    const values = [t, d, curl, p, u_id]
    let result = await client.query(text, values);
    console.log(`[DB] inserted into Book : ${t}`)
}

Book.prototype.getbyid = async (id) => {
    const text = 'SELECT * FROM books WHERE book_id=$1;'
    const values = [id]
    let result = await client.query(text, values);
    return result
}

Book.prototype.getAll = async () => {
    let result = await client.query(`SELECT * FROM books;`);
    return result
}

Book.prototype.getUserBooks = async (id) => {
    const text = `SELECT * FROM books WHERE u_id=$1;`
    const values = [id]
    let result = await client.query(text, values);
    return result
}

Book.prototype.searchBybname = async (bname) => {
    const text = `SELECT * FROM books WHERE title LIKE $1`
    const values = [`%${bname}%`];
    let result = await client.query(text, values);
    return result
}

Book.prototype.deleteBook = async (id) => {
    const text = `Delete FROM books WHERE book_id=$1;`
    const values = [id]
    let result = await client.query(text, values);
    return result
}

(async function () {
    await client.connect()
    // let sx = await User.prototype.getbyUnamePass("prithvihv", "io")
    // console.log(sx)
    console.log("[DB] Connected")
})()


module.exports = {
    User,
    Book
}