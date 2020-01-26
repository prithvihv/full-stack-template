var router = require('express').Router();
var { User, Book } = require('../util/db');
const passport = require('passport');

router.get('/', async (req, res, next) => {
    let dbres;
    if (req.query.search) {
        dbres = await Book.prototype.searchBybname(req.query.search);
    } else {
        dbres = await Book.prototype.getAll()
    }
    let books = dbres.rows
    return res.json({ books })
});

router.get('/:id', async (req, res, next) => {
    let book_id = req.params.id
    let dbbookres = await Book.prototype.getbyid(book_id)
    let book = dbbookres.rows[0];
    return res.json({ book: book })
});

// need to test
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    let title = req.body.title;
    let desc = req.body.description;
    let cover_url = req.body.cover_url;
    let price = req.body.price;
    let u_id = req.user.u_id;
    if (req.user.username == "Thanos") {
        return res.status(400).json({ "message": " :/ i have order to keep you out" })
    }
    let dbbookres = await Book.prototype.create(title, desc, cover_url, price, u_id);
    let book = dbbookres.rows[0];
    return res.json({ book: book })
});

router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    let u_id = req.user.u_id;
    let book_id = req.body.book_id;
    let dbbookres = await Book.prototype.getbyid(book_id)
    let book = dbbookres.rows[0];
    let resdb;
    if (book.u_id == u_id) {
        resdb = await Book.prototype.deleteBook(book_id)
        return res.json({ message: `deleated book with id ${book_id}` })
    } else {
        return res.json({ message: `Unauthozied api request` })
    }
});

module.exports = router;