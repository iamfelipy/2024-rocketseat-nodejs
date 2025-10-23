import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { R2Storage } from './rs-storage'
import { Uploader } from '@/domain/core/application/storage/uploader'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
