import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderTrpcPanel } from 'trpc-panel';
import { AppRouter } from '../app.router';

@Controller('trpc-panel')
export class TrpcPanelController {
  @Get()
  async renderPanel(@Res() res: Response) {
    const html = renderTrpcPanel(AppRouter, {
      url: 'http://localhost:3000/trpc',
    });
    res.send(html);
  }
}
