create database shops;


create extension if not exists "uuid-ossp";

create table category(
  category_id uuid primary key not null default uuid_generate_v4(),
  category_name varchar(64) not null,
  created_at timestamp default current_timestamp,
  category_photo text not null
);