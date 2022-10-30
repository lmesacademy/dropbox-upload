# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.5.0](https://github.com/lmesacademy/dropbox-upload/compare/v1.4.0...v1.5.0) (2022-10-30)


### Features

* **upload:** bulk upload on directory upload ([946a146](https://github.com/lmesacademy/dropbox-upload/commit/946a146a68ee844782f293518a353ae86d81780b))
* **upload:** files in folder upload will retry twice ([6052b22](https://github.com/lmesacademy/dropbox-upload/commit/6052b22629ae9c9dab9fc451fe0897dcce5819ef))
* **upload:** tweak retries and concurrency ([e0d9e10](https://github.com/lmesacademy/dropbox-upload/commit/e0d9e10b5d9d4144ee72427a2692c0fbb0620c32))
* use keyv instead of node-cache ([54b4881](https://github.com/lmesacademy/dropbox-upload/commit/54b4881dcbae8710233f44206420d635fde2f876))

## [1.4.0](https://github.com/lmesacademy/dropbox-upload/compare/v1.3.0...v1.4.0) (2022-10-28)


### Features

* **upload:** use normal upload for files lesser than 150mb ([069aaaa](https://github.com/lmesacademy/dropbox-upload/commit/069aaaa1fef107f0fd26f6be4e233db990c1e29b))


### Bug Fixes

* **upload:** send dropbox result for directory upload ([e4e4f29](https://github.com/lmesacademy/dropbox-upload/commit/e4e4f299735cafc0afeb5b7e9d5b3b138b18934e))

## [1.3.0](https://github.com/lmesacademy/dropbox-upload/compare/v1.2.0...v1.3.0) (2022-10-25)


### Features

* add example ([cdf55e7](https://github.com/lmesacademy/dropbox-upload/commit/cdf55e7c4773cc0b35d4888f7d9ccbbbbbefc10b))
* **docs:** directory upload ([5a9d703](https://github.com/lmesacademy/dropbox-upload/commit/5a9d70382de3991b6c9a5e31614f4a2e7fb67370))
* **upload:** directory upload ([46ae407](https://github.com/lmesacademy/dropbox-upload/commit/46ae407f769f1df6b05782dad0f7e1b47b4b14dd))
* **upload:** store access_token in cache to reuse ([68b5339](https://github.com/lmesacademy/dropbox-upload/commit/68b53399e34fcce1ce17eb66b34c44f456bd32cd))
* **utils:** folder walk function ([86e155f](https://github.com/lmesacademy/dropbox-upload/commit/86e155f441af13dbbeb69e9516dd8155b9f8fbf1))


### Bug Fixes

* add missing types ([6da73da](https://github.com/lmesacademy/dropbox-upload/commit/6da73da0286107106917dafc7d5596edaa1bfb00))
* **upload:** improved logging ([7432f55](https://github.com/lmesacademy/dropbox-upload/commit/7432f558b700b05535d3f00720ba9a7af39f1c6b))
* **upload:** remove used reject ([ea1d602](https://github.com/lmesacademy/dropbox-upload/commit/ea1d602a2ba1661d804358762f06293f0bdccae5))

## [1.2.0](https://github.com/lmesacademy/dropbox-upload/compare/v1.1.1...v1.2.0) (2022-08-04)


### Features

* add parameter types ([f260f4f](https://github.com/lmesacademy/dropbox-upload/commit/f260f4fab0becdcb905536f51c0483b0d5b0520d))
* **docs:** update readme ([f672bde](https://github.com/lmesacademy/dropbox-upload/commit/f672bde249769e3f9f8ed6cb39390d80ec45f3d9))

### [1.1.1](https://github.com/lmesacademy/dropbox-upload/compare/v1.1.0...v1.1.1) (2022-08-04)


### Bug Fixes

* **upload:** close file after successful upload ([538e60a](https://github.com/lmesacademy/dropbox-upload/commit/538e60ae7d87652ce0c3413181de0074ed98ad1f))
* **upload:** content read issue ([14c0631](https://github.com/lmesacademy/dropbox-upload/commit/14c06318cc51fe4a81345d26ebb402623d8bdaf5))

## 1.1.0 (2022-08-01)


### Features

* add dropbox upload ([f54a320](https://github.com/lmesacademy/dropbox-upload/commit/f54a3207f0488ffcd891edaccfc626686e51c070))
