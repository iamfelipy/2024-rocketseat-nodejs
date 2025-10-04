import { Encrypter } from '@/domain/core/application/cryptography/encrypter'
import { JwtEncrypter } from './jwt-encrypter'
import { Module } from '@nestjs/common'
import { HashComparer } from '@/domain/core/application/cryptography/hash-comparer'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/core/application/cryptography/hash-generator'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
