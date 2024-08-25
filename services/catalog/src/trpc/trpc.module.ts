import { Module } from '@nestjs/common';
import { TRPCService } from './trpc.service';

@Module({
  providers: [TRPCService],
  exports: [TRPCService],
})
export class TrpcModule {}
