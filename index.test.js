'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const xpipe = require('./index.js');

function withPlatform(platform, fn) {
	const original = Object.getOwnPropertyDescriptor(process, 'platform');
	Object.defineProperty(process, 'platform', { value: platform });
	try {
		fn();
	} finally {
		Object.defineProperty(process, 'platform', original);
	}
}

test('prefix is empty on non-Windows platforms', () => {
	withPlatform('linux', () => {
		assert.equal(xpipe.prefix, '');
	});
});

test('prefix is the named pipe root on Windows', () => {
	withPlatform('win32', () => {
		assert.equal(xpipe.prefix, '//./pipe/');
	});
});

test('eq() returns the path unchanged on non-Windows platforms', () => {
	withPlatform('linux', () => {
		assert.equal(xpipe.eq('/tmp/my.sock'), '/tmp/my.sock');
	});
});

test('eq() prefixes an absolute path with the named pipe root on Windows', () => {
	withPlatform('win32', () => {
		assert.equal(xpipe.eq('/tmp/my.sock'), '//./pipe/tmp/my.sock');
	});
});

test('eq() prefixes a relative path with the named pipe root on Windows', () => {
	withPlatform('win32', () => {
		assert.equal(xpipe.eq('tmp/my.sock'), '//./pipe/tmp/my.sock');
	});
});
