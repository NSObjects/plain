import assert from 'node:assert/strict';
import { previewBase } from './preview-base.mjs';

assert.equal(previewBase({}), '/');
assert.equal(previewBase({ GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'NSObjects/plain' }), '/plain/');
assert.equal(previewBase({ GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'other/blog' }), '/blog/');
assert.equal(previewBase({ GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'other/other.github.io' }), '/');
assert.equal(previewBase({ GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'other/blog', BASE_PATH: '/custom' }), '/custom/');
console.log('Preview base path scenarios passed');
