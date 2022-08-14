import { Global, Module } from '@nestjs/common';
import { repositoryProvider } from 'src/providers/repository.provider';

@Global()
@Module({
  providers: [...repositoryProvider],
  exports: [...repositoryProvider],
})
export class RepositoryModule {}
