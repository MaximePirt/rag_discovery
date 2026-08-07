import test from "node:test";
import assert from "node:assert/strict";

import * as rag from "../src/tf-idf.js";


test("tokenFrequency calculates normalized term frequencies", () => {
	const tf = rag.tokenFrequency([
		"docker",
		"docker",
		"compose",
		"service",
	]);

	assert.equal(tf.get("docker"), 0.5);
	assert.equal(tf.get("compose"), 0.25);
	assert.equal(tf.get("service"), 0.25);
});


test("documentFrequency counts chunks, not occurrences", () => {
	const firstChunkTf = new Map<string, number>([
		["docker", 0.5],
		["compose", 0.5],
	]);

	const secondChunkTf = new Map<string, number>([
		["docker", 0.5],
		["postgres", 0.5],
	]);

	const df = rag.documentFrequency([
		firstChunkTf,
		secondChunkTf,
	]);

	assert.equal(df.get("docker"), 2);
	assert.equal(df.get("compose"), 1);
	assert.equal(df.get("postgres"), 1);
});

test("inverseDocumentFrequency calculates classic IDF", () => {
	const df = new Map<string, number>([
		["docker", 3],
		["compose", 1],
	]);

	const idf = rag.inverseDocumentFrequency(df, 3);

	assert.equal(idf.get("docker"), 0);

	assert.ok(
		Math.abs((idf.get("compose") ?? 0) - Math.log(3)) < 0.000001,
	);
});

test("cosineSimilarity gives a higher score to the relevant chunk", () => {
	const query = new Map<string, number>([
		["compose", 1],
	]);

	const relevantChunk = new Map<string, number>([
		["compose", 0.5],
		["service", 0.5],
	]);

	const unrelatedChunk = new Map<string, number>([
		["postgres", 0.5],
		["database", 0.5],
	]);

	const relevantScore = rag.cosineSimilarity(query, relevantChunk);
	const unrelatedScore = rag.cosineSimilarity(query, unrelatedChunk);

	assert.ok(relevantScore > 0);
	assert.equal(unrelatedScore, 0);
	assert.ok(relevantScore > unrelatedScore);
});
