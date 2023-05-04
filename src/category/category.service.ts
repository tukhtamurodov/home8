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
    const { rows } = await this.db.query('select * from category');
    return rows;
  }

  async findOne(id: string) {
    const { rows: data } = await this.db.query(
      'select * from category where category_id = $1',
      [id],
    );
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
