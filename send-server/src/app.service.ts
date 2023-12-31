import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import * as http from 'http';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  async sendFile(): Promise<boolean> {
    try {
      const tempFolderPath = 'temp';
      const fileName = 'test.txt';
      const filePath = `${tempFolderPath}/${fileName}`;
      const fileStream = fs.createReadStream(filePath);

      const url = this.configService.get<string>('API_URL');

      const requestOptions: http.RequestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        timeout: 1,
      };

      const request = http.request(url, requestOptions, (response) => {
        // Handle the response as needed
        if (response.statusCode === 201) {
          console.log('File uploaded successfull');
        } else {
          console.error('File upload failed!');
        }
      });

      request.on('socket', (socket) => {
        socket.setTimeout(1);
      });

      fileStream.pipe(request);
    } catch (e) {
      console.error(e);
      return false;
    }

    // axios.interceptors.request.use((request) => {
    //   request.maxContentLength = Infinity;
    //   request.maxBodyLength = Infinity;
    //   return request;
    // });

    // axios
    //   .post(url + `/`, txtLines, {
    //     headers: {
    //       ...txtLines.getHeaders(),
    //     },
    //   })
    //   .then(() => {
    //     // fs.unlinkSync(filePath);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    return true;
  }
}
