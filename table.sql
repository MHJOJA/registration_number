

create table town(
	id serial not null primary key,
    registration text not null,
    start_string text not null
    
);

create table registration_numbers(
	id serial not null primary key,
    numberplates text not null,
    town_id int not null,
     foreign key (town_id) references town(id)


);





insert into town (registration, start_string) values('Bellvillle', 'CY');
insert into town (registration, start_string) values('Paarl', 'CJ');
insert into town (registration, start_string) values('Cape Town', 'CA');
    