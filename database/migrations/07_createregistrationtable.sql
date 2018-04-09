create table registration_queue (
    id          integer AUTO_INCREMENT not null,
    username    varchar(100) not null,
    email       varchar(100) not null,
    primary key (id)
);
