drop table if exists event;

create table event (
    id              integer AUTO_INCREMENT not null,
    org_id          integer not null,
    message         varchar(1000),
    date_created    date,
    last_updated    date,
    version         varchar(10),
    primary key (id)
);

drop table if exists event_subscriber;

create table event_subscriber (
    id     integer AUTO_INCREMENT not null,
    org_id integer not null,
    sub_id integer not null,
    primary key (id)
);
