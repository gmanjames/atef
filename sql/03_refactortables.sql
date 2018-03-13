drop table if exists user;

create table user (
    id           integer AUTO_INCREMENT not null,
    username     varchar(100) not null,
    email        varchar(100) not null,
    password     varchar(32) not null,
    date_created date,
    last_updated date,
    version      varchar(10),
    primary key  (id)
);


drop table if exists post;

create table post (
    id            integer AUTO_INCREMENT NOT NULL,
    username      varchar(100)  NOT NULL,
    content       varchar(1000) NOT NULL,
    media         varchar(1000),
    date_created  date,
    last_updated  date,
    version       varchar(10),
    primary key   (id)
);
