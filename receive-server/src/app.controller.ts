import { Controller } from '@nestjs/common';
import { Post, Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import * as readline from 'readline';
import * as fs from 'fs';

@Controller()
export class AppController {
  @Post()
  async readFile(@Req() request: Request) {
    const writeStream = fs.createWriteStream('temp/test.txt', {
      mode: 1600,
    });
    const rl = readline.createInterface({
      input: request,
      crlfDelay: Infinity,
    });

    rl.on('line', (line: string) => {
      // backpressure
      const result = writeStream.write(line + '\n');
      if (!result) {
        // console.log('backpressure');
        rl.pause();
      }
    });

    writeStream.on('drain', () => {
      // console.log('DREAINED');
      rl.resume();
    });

    return new Promise((resolve, reject) => {
      rl.on('close', () => {
        console.log('File reading completed');
        writeStream.end();
        resolve(true);
        // remove file
        fs.unlinkSync('temp/test.txt');
      });

      rl.on('error', (error: any) => {
        writeStream.end();
        reject(error);
        fs.unlinkSync('temp/test.txt');
      });
    });
  }
}
