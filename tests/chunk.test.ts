import test from "node:test";
import assert from "node:assert/strict";

import * as c from "../src/chunk.js";

test("Split into chunks splits text into chunks of maximum length 500", () => {
	const text = "This is a test. ".repeat(50); // 750 characters
	const chunks = c.splitIntoChunks(text);

	assert.ok(Array.isArray(chunks), "Expected an array of chunks");
	assert.ok(chunks.every(chunk => typeof chunk === "string"), "Expected all elements to be strings");
	assert.ok(chunks.every(chunk => chunk.length <= 500), "Expected all chunks to have a maximum length of 500 characters");
});

test("Split into chunks handles text shorter than 500 characters", () => {
	const text = "This is a short test.";
	const chunks = c.splitIntoChunks(text);

	assert.ok(Array.isArray(chunks), "Expected an array of chunks");
	assert.strictEqual(chunks.length, 1, "Expected only one chunk for short text");
	assert.strictEqual(chunks[0], text, "Expected the chunk to be the same as the input text");
});

test("Split into chunks handles text with no sentence-ending punctuation", () => {
	const text = "This is a test without any sentence-ending punctuation ".repeat(10); // 600 characters
	const chunks = c.splitIntoChunks(text);

	assert.ok(Array.isArray(chunks), "Expected an array of chunks");
	assert.ok(chunks.every(chunk => typeof chunk === "string"), "Expected all elements to be strings");
	assert.ok(chunks.every(chunk => chunk.length <= 500), "Expected all chunks to have a maximum length of 500 characters");
});

