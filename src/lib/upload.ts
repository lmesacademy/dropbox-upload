import { Dropbox } from 'dropbox';
import FormData from 'form-data';
import fs from 'fs-extra';
import got from 'got';
import Keyv from 'keyv';
import PQueue from 'p-queue';
import { retry } from 'ts-retry-promise';

import { FileChunker, prettyBytes, stripTrailingSlash } from '../utils';
import { walk } from '../utils/Walk';

const KV = new Keyv();
export interface UploadConfig {
  appSecret: string;
  appKey: string;
  refreshToken: string;
  concurrency?: number;
}

const generateAccessToken = (config: UploadConfig) => {
  return new Promise(async (resolve) => {
    const formData = new FormData();

    formData.append('refresh_token', config.refreshToken);
    formData.append('grant_type', 'refresh_token');

    console.log('[dropbox]: requesting access token');

    const authResponse: Record<string, any> = await got
      .post('https://api.dropboxapi.com/oauth2/token', {
        body: formData,
        username: config.appKey,
        password: config.appSecret,
        throwHttpErrors: false,
      })
      .json();

    console.log('[dropbox]: 🔒 access_token received');

    KV.set(
      'access_token',
      authResponse.access_token,
      authResponse.expires_in - 1000
    );

    return resolve(authResponse.access_token);
  });
};

export const upload = (
  config: UploadConfig,
  filePath: string,
  dropboxFilePath: string
) => {
  return new Promise(async (resolve, reject) => {
    console.log('[dropbox]: ⌛️ upload task received');

    if (!(await KV.get('access_token'))) {
      console.log('[dropbox]: no access_token, generating one');
      // get access token using refreshToken
      await generateAccessToken(config);
    }

    const dropbox = new Dropbox({ accessToken: await KV.get('access_token') });

    // initialize upload
    console.log(`[dropbox]: 🗄 upload file ${filePath} to ${dropboxFilePath}`);

    try {
      if (fs.statSync(filePath).size < 1024 * 1024 * 150) {
        const response = await dropbox.filesUpload({
          path: dropboxFilePath,
          contents: fs.readFileSync(filePath),
        });

        console.log('[dropbox]: ✅ normal upload completed');

        return resolve(response.result);
      } else {
        const fileChunker = new FileChunker({
          filePath,
          chunkSize: 1024 * 1024 * 50,
        });

        let contents = fileChunker.getNextChunk();

        const fileUploadSession = await dropbox.filesUploadSessionStart({
          contents,
          close: false,
        });

        let response;

        // eslint-disable-next-line no-constant-condition
        while (true) {
          contents = fileChunker.getNextChunk();
          const offset = fileChunker.getLastChunkOffset();

          if (fileChunker.isFinished) {
            response = await dropbox.filesUploadSessionFinish({
              contents,
              cursor: {
                session_id: fileUploadSession.result.session_id,
                offset,
              },
              commit: { path: dropboxFilePath, mode: { '.tag': 'overwrite' } },
            });
            break;
          }

          await dropbox.filesUploadSessionAppendV2({
            contents,
            cursor: {
              offset,
              session_id: fileUploadSession.result.session_id,
            },
            close: false,
          });
          console.log(`uploaded ${prettyBytes(offset)}`);
        }

        // Close file
        fileChunker.close();

        console.log('[dropbox]: ✅ upload session completed');
        return resolve(response.result);
      }
    } catch (err: any) {
      console.log('file:', filePath, err ? err.error : err);
      return reject(err);
    }
  });
};

export const uploadDir = (
  config: UploadConfig,
  folderPath: string,
  dropboxFolderPath: string
) => {
  folderPath = stripTrailingSlash(folderPath);
  dropboxFolderPath = stripTrailingSlash(dropboxFolderPath);

  const queue = new PQueue({ concurrency: config.concurrency || 5 });

  console.log(`[dropbox]: 📂 upload ${folderPath} to ${dropboxFolderPath}`);
  return new Promise(async (resolve) => {
    if (!(await KV.get('access_token'))) {
      console.log('[dropbox]: no access_token, generating one');
      // get access token using refreshToken
      await generateAccessToken(config);
    }

    const files: any[] = [];
    const dropboxResults: any[] = [];
    let count = 0;

    for await (const file of walk(folderPath)) {
      files.push(file);
    }

    console.log(`[dropbox]: found ${files.length} files`);

    for (const file of files) {
      const uploadFilePath = file.replace(folderPath + '/', '');

      queue
        .add(async () =>
          retry(
            async () => {
              await upload(
                config,
                file,
                `${dropboxFolderPath}/${uploadFilePath}`
              );
            },
            { retries: 5, delay: 5000 }
          )
        )
        .catch((err) => {
          dropboxResults.push(err);
        });
    }

    queue.on('active', () => {
      console.log(`[dropbox]: ⬆️ uploading ${++count} / ${files.length}`);
    });

    queue.on('completed', (result) => {
      dropboxResults.push(result);
    });

    queue.on('idle', () => {
      return resolve(dropboxResults);
    });
  });
};
