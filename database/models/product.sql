create table products(
  product_id uuid not null primary key default uuid_generate_v4(),
  product_descr text not null,
  product_image text not null,
  product_count int not null,
  product_price bigint not null,
  created_at timestamp default current_timestamp,
  category_id uuid not null,
  foreign key (category_id) 
    references category(category_id)
      on delete set null
)