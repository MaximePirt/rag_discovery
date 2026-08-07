import test from "node:test";
import assert from "node:assert/strict";

import * as parse_f from "../src/file_pars.js";

test("tokenize splits text into tokens", () => {
	const text = "Hello, world! This is a test.";

	const tokens = parse_f.tokenize(text);

	assert.deepEqual(tokens, ["hello", "world", "this", "is", "a", "test"]);
});

test("List files returns an array of file paths", async () => {
	const folder = "./documents";
	const files = await parse_f.listfiles(folder);

	assert.ok(Array.isArray(files), "Expected an array of file paths");
	assert.ok(files.every(file => typeof file === "string"), "Expected all elements to be strings");
	assert.ok(files.every(file => file.endsWith(".md") || file.endsWith(".txt")), "Expected all files to have .md or .txt extension");
});


// Limit to this test : its based on real files in the documents folder. If you add or remove files, this test will fail.
test("Read files returns an array of FileContent objects", async () => {
	const files = ["docker.txt", "rag.md"];
	const fileContents = await parse_f.readfiles(files);

	assert.ok(Array.isArray(fileContents), "Expected an array of FileContent objects");
	assert.ok(fileContents.every(fc => typeof fc.filename === "string" && typeof fc.content === "string"), "Expected all elements to be FileContent objects with filename and content properties");
});

