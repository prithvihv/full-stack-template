CREATE DATABASE book_store ;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    u_id uuid DEFAULT uuid_generate_v4 (),
    username varchar(200) UNIQUE,
    password varchar(200),
    auther_name varchar(200),
    primary key (u_id)
);

CREATE TABLE books (
    book_id SERIAL,
    title varchar(200),
    description varchar(200),
    cover_url varchar(200),
    price real,
    u_id uuid REFERENCES users(u_id) ON DELETE CASCADE,
    primary key (book_id)
);


