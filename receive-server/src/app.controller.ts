import { Controller } from '@nestjs/common';
import { Post, Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import * as readline from 'readline';

@Controller()
export class AppController {
  @Post()
  async readFile(@Req() request: Request) {
    const rl = readline.createInterface({
      input: request,
      crlfDelay: Infinity,
    });
    let iterator = 0;

    rl.on('line', (line: string) => {
      iterator++;
      // espera 50 milisegndos
      if (iterator % 100000 === 0) {
        console.log(iterator);
      }
      // Handle the line as needed
    });

    return new Promise((resolve, reject) => {
      rl.on('close', () => {
        console.log('File reading completed');
        resolve(true);
      });

      rl.on('error', (error: any) => {
        reject(error);
      });
    });
  }
}
