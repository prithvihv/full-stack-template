CREATE DATABASE book_store ;

-- DELETE TABLE users;
DROP TABLE books;
DROP TABLE users;


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


-- CREATE

INSERT INTO
    users (
        username,
        password,
        auther_name
    )
VALUES
    (
        'prithvi.hv',
        'paper',
        'john.smith'
    );

INSERT INTO
    books (
        title,
        description,
        cover_url,
        price,
        u_id
    )
VALUES
    (
        'bobo black sheep',
        'memes',
        'https://i.picsum.photos/id/401/200/300.jpg',
        899.99,
        '4f29e4bc-3051-45e1-9b45-cb0e48813587'
    );
	
-- Queries

-- get all books from auth
SELECT
    *
FROM
    books
WHERE
    u_id = '4f29e4bc-3051-45e1-9b45-cb0e48813587';

-- serach for book
SELECT
    *
FROM
    books
WHERE
    title LIKE '%black%';   

SELECT
   *
FROM
   books;	
	
SELECT
   *
FROM
   users;
