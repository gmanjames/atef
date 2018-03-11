create table user (
    username varchar(100) NOT NULL,
    password varchar(32)  NOT NULL
);

create table post (
    id            integer AUTO_INCREMENT NOT NULL,
    user_username varchar(100)  NOT NULL,
    content       varchar(1000) NOT NULL,
    posted        date,
    primary key (id)
);

create table post_like (
    post_id       integer NOT NULL,
    post_username varchar(100) NOT NULL,
    like_username varchar(100) NOT NULL
);
