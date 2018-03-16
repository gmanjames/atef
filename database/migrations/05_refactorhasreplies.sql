alter table post drop column has_replies;
alter table post add column has_replies tinyint default 1;
