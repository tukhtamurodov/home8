import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DB_CONNECTION } from 'src/shared/constants';
import { Response } from 'express';

@Injectable()
export class CategoryService {
  constructor(@Inject(DB_CONNECTION) private db: any) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    const { name } = createCategoryDto;
    const photo = file.filename;
    const {
      rows: [data],
    } = await this.db.query(
      'insert into category (category_name, category_photo) values($1, $2) returning *',
      [name, photo],
    );
    return { message: 'created category', data };
  }

  async findAll(): Promise<Response> {
    let { rows } = await this.db.query(`
    select ct.category_id , ct.category_name,
    ct.created_at, ct.category_photo,
    json_agg(json_build_object(
      'product_id',pr.product_id , 
      'product_descr',pr.product_descr ,
      'product_image',pr.product_image ,
      'product_count',pr.product_count ,
      'product_price',pr.product_price ,
      'created_at',pr.created_at 
    )) as product
     from category ct
      left join products pr 
        on ct.category_id = pr.category_id
          group by ct.category_id , ct.category_name,
            ct.created_at, ct.category_photo`);

    rows = rows.map((u) => {
      if (!u.product[0].product_id) {
        delete u.product;
        return u;
      }
      return u;
    });

    return rows;
  }

  async findOne(id: string) {
    const { rows: data } = await this.db.query(
      `
      select ct.category_id , ct.category_name,
      ct.created_at, ct.category_photo,
      json_agg(json_build_object(
        'product_id',pr.product_id , 
        'product_descr',pr.product_descr ,
        'product_image',pr.product_image ,
        'product_count',pr.product_count ,
        'product_price',pr.product_price ,
        'created_at',pr.created_at 
      )) as product
       from category ct
        left join products pr 
          on ct.category_id = pr.category_id
            where ct.category_id = $1
            group by ct.category_id , ct.category_name,
              ct.created_at, ct.category_photo`,
      [id],
    );
    if (!data[0].product[0].product_id) {
      delete data[0].product;
    }
    return data;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    file: Express.Multer.File,
  ) {
    const { name } = updateCategoryDto;
    const photo = file.fieldname;
    const {
      rows: [data],
    } = await this.db.query(
      'update category set category_name=$1 , category_photo=$2 where category_id=$3 returning *',
      [name, photo, id],
    );
    return { message: 'updated category', data };
  }

  async remove(id: string) {
    const {
      rows: [data],
    } = await this.db.query(
      'delete from category where category_id=$1 returning *',
      [id],
    );
    return { message: 'delete category', data };
  }
}
