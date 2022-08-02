import { Dropbox } from 'dropbox';
import FormData from 'form-data';
import got from 'got';

import { FileChunker, prettyBytes } from '../utils';

export const upload = (config, filePath, dropboxFilePath) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    console.log('[dropbox]: upload task received');

    const formData = new FormData();

    formData.append('refresh_token', config.refreshToken);
    formData.append('grant_type', 'refresh_token');

    console.log('[dropbox]: requesting access token');

    const authResponse: any = await got
      .post('https://api.dropboxapi.com/oauth2/token', {
        body: formData,
        username: config.username,
        password: config.password,
        throwHttpErrors: false,
      })
      .json();

    console.log('[dropbox]: received access token');

    // rotate and get access token using refreshToken
    const dropbox = new Dropbox({ accessToken: authResponse.access_token });

    // initialize upload
    console.log(`[dropbox]: upload file '${filePath}' to '${dropboxFilePath}'`);

    try {
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
            cursor: { session_id: fileUploadSession.result.session_id, offset },
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

      console.log('[dropbox]: upload session completed');
      return resolve(response.result);
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};
