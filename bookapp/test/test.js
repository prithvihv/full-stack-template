process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const { Book, User } = require("../util/db");

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
        let p1 = Book.prototype.deleteall();
        let p2 = User.prototype.deleteall();
        Promise.all([p1, p2]).then(() => { done() })
    });

    describe('/GET Users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/api/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body["users"].should.be.a('array');
                    res.body["users"].length.should.be.eql(0);
                    done();
                });
        });
        it('it should GET all infomations about single user', (done) => {
            User.prototype.create("username", "password", "author_name").then((dbres) => {
                let u_id = dbres.rows[0].u_id;
                chai.request(server)
                    .get(`/api/user/${u_id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body["user"].should.be.a('object');
                        res.body["books"].should.be.a('array');
                        res.body["books"].length.should.be.eql(0);
                        done();
                    });
            });
        });
    });

    describe('/POST user sign up', () => {
        it('it should not create user without author name', (done) => {
            let user = {
                username: "prithvihv",
                password: "bhim"
            }
            chai.request(server)
                .post('/api/user')
                .send(user)
                .end((err, res) => {

                    res.should.have.status(400);
                    done();
                });
        });
        it('it should create user and return token', (done) => {
            let user = {
                username: "prithvihv",
                password: "bhim",
                author_name: "jon son"
            }
            chai.request(server)
                .post('/api/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    res.body.user.should.have.property('u_id');
                    done();
                });
        });
        // it('Login should obtain token', (done) => {
        //     let user = {
        //         username: "prithvihv",
        //         password: "bhim",
        //         author_name: "jon son"
        //     }
        //     chai.request(server)
        //         .post('/api/user')
        //         .send(user)
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             chai.request(server)
        //                 .post('/auth/login')
        //    // completed this ! 
        //         });
        // });

    });
})

describe('Books', () => {
    beforeEach((done) => {
        let p1 = Book.prototype.deleteall();
        let p2 = User.prototype.deleteall();
        Promise.all([p1, p2]).then(() => { done() })
    });
    describe('/GET book', () => {
        it('it should GET all the books', (done) => {
            chai.request(server)
                .get('/api/book')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body["books"].should.be.a('array');
                    res.body["books"].length.should.be.eql(0);
                    done();
                });
        });
        it('it should GET single book all info', async () => {
            let dbres = await User.prototype.create("username", "password", "author_name")
            let user = dbres.rows[0]
            dbres = await Book.prototype.create("title", "desc", "cover_url", 999.9, user.u_id);
            book = dbres.rows[0]
            let res = await chai.request(server)
                .get(`/api/book/${book.book_id}`);
            res.body.should.be.a('object')
            res.should.have.status(200)
            return true
        });
    });
    describe('/POST book', async () => {
        it('it should publish a book by the same user', async () => {
            let user1 = {
                username: "prithvihv",
                password: "bhim",
                author_name: "jon son"
            }
            let res = await chai.request(server)
                .post('/api/user')
                .send(user1)
            res.should.have.status(200);
            res.body.should.have.property('token');
            res.body.user.should.have.property('u_id');
            const token1 = res.body.token;
            const u_id1 = res.body.u_id;
            let book = {
                title: "The Lord of the Rings",
                description: "one ring to rule them all",
                cover_url: "image of J.R.R. Tolkien",
                price: 999.99,
                u_id: u_id1
            }
            res = await chai.request(server)
                .post('/api/book')
                .set("Authorization", "Bearer " + token1)
                .send(book);
            res.should.have.status(200);
            res.body.should.be.a('object');
            return true
        });
        it('it not should publish a book by the different user', async () => {
            let user1 = {
                username: "prithvihv",
                password: "bhim",
                author_name: "jon son"
            }
            let user2 = {
                username: "aakansha",
                password: "ranger",
                author_name: "jon son"
            }
            let res = await chai.request(server)
                .post('/api/user')
                .send(user1)
            res.should.have.status(200);
            res.body.should.have.property('token');
            res.body.user.should.have.property('u_id');
            const token1 = res.body.token;
            const u_id1 = res.body.u_id;
            res = await chai.request(server)
                .post('/api/user')
                .send(user2)
            res.should.have.status(200);
            res.body.should.have.property('token');
            res.body.user.should.have.property('u_id');
            const token2 = res.body.token;
            const u_id2 = res.body.u_id;
            let book = {
                title: "The Lord of the Rings",
                description: "one ring to rule them all",
                cover_url: "image of J.R.R. Tolkien",
                price: 999.99,
                u_id: u_id1
            }
            res = await chai.request(server)
                .post('/api/book')
                .set("Authorization", "Bearer " + token2)
                .send(book);
            res.should.have.status(200);
            res.body.should.be.a('object');
            return true
        });
        it('The Thanos test', async () => {
            let user1 = {
                username: "Thanos",
                password: "bhim",
                author_name: "jon son"
            }
            let res = await chai.request(server)
                .post('/api/user')
                .send(user1)
            res.should.have.status(200);
            res.body.should.have.property('token');
            res.body.user.should.have.property('u_id');
            const token1 = res.body.token;
            const u_id1 = res.body.u_id;
            let book = {
                title: "The Lord of the Rings",
                description: "one ring to rule them all",
                cover_url: "image of J.R.R. Tolkien",
                price: 999.99,
                u_id: u_id1
            }
            res = await chai.request(server)
                .post('/api/book')
                .set("Authorization", "Bearer " + token1)
                .send(book);
            res.should.have.status(400);
            res.body.should.be.a('object');
            return true
        });
    });
    // describe('/PUT/:id book', () => {
    // });
    // describe('/DELETE/:id book', () => {
    // });
});
