import { uploadDir } from '@lmes/dropbox-upload';

uploadDir(
  {
    refreshToken: '',
    appKey: '',
    appSecret: '',
  },
  '../example/files/',
  '/bulk-upload/'
).then((files) => {
  console.log(files);
});
