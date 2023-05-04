import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [CategoryModule, SharedModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
