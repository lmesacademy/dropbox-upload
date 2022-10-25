# Dropbox Upload

Oneliner to Upload Large Files to Dropbox

#### Upload single file

```js
import { upload } from '@lmes/dropbox-upload';

upload(
  { refreshToken: '', appKey: '', appSecret: '' },
  '/tmp/video.mp4',
  '/videos/video.mp4'
);
```

#### Upload folder

```js
import { uploadDir } from '@lmes/dropbox-upload';

uploadDir(
  { refreshToken: '', appKey: '', appSecret: '' },
  '/files',
  '/dropbox-folder'
);
```
