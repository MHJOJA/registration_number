

create table town(
	id serial not null primary key,
    town_name text not null,
    start_string text not null
);

create table registration_numbers(
	id serial not null primary key,
    numberplates text not null,
    town_code text not null


);
--    foreign key (town_code) references town(id)





insert into town (town_name, start_string) values('Bellvillle', 'CY');
insert into town (town_name, start_string) values('Paarl', 'CJ');
insert into town (town_name, start_string) values('Cape Town', 'CA');
    