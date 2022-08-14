import { DatabaseModule } from './modules/database/database.module';
import { Module } from '@nestjs/common';
import { RepositoryModule } from './modules/repository/repository.module';
@Module({
  imports: [DatabaseModule, RepositoryModule],
})
export class AppModule {}
