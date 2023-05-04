import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DB_CONNECTION } from 'src/shared/constants';

@Injectable()
export class ProductsService {
  constructor(@Inject(DB_CONNECTION) private db: any) {}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    const { descr, count, price, category_id } = createProductDto;
    const photo = file.fieldname;

    const {
      rows: [data],
    } = await this.db.query(
      `insert into products (product_descr, product_count, product_price,
        category_id,product_image) values($1, $2, $3, $4, $5) returning *`,
      [descr, count, price, category_id, photo],
    );
    return { message: 'created product', data };
  }

  async findAll() {
    const { rows } = await this.db.query('select * from products');
    return rows;
  }

  async findOne(id: string) {
    const { rows: data } = await this.db.query(
      'select * from products where product_id = $1',
      [id],
    );
    return data;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File,
  ) {
    const { descr, count, price, category_id } = updateProductDto;
    const photo = file.fieldname;

    const {
      rows: [data],
    } = await this.db.query(
      `update products set product_descr=$1, product_count=$2, product_price=$3,
      category_id=$4,product_image=$5 where product_id = $6 returning *`,
      [descr, count, price, category_id, photo, id],
    );
    return { message: 'updated product', data };
  }

  async remove(id: string) {
    const {
      rows: [data],
    } = await this.db.query(
      'delete from products where product_id=$1 returning *',
      [id],
    );
    return { message: 'delete product', data };
  }
}
