import test from 'ava';

import { upload } from './upload';

test('getABC', async (t) => {
  t.deepEqual(await upload(), {});
});
