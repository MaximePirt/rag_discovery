import * as parse_f from "./file_pars.js"

/**
 * @brief Extends the Chunk interface from file_pars.ts to include term frequency (tf) information.
 * @interface DataChunk
 * @extends {parse_f.Chunk}
 * @property {Map<string, number>} tf - A map where keys are tokens and values are their respective term frequencies.
 */
export interface DataChunk extends parse_f.Chunk {
	tf: Map<string, number>;
}

/**
 * @brief Counts the occurrences of each token in the given array of tokens.
 * @param tokens 
 * @returns Map<string, number> A map where keys are tokens and values are their respective counts.
 */
function tokenCount(tokens: string[]): Map<string, number> {
	let frequency = new Map<string, number>();

	for (const term of tokens)
	{
		const currentCount = frequency.get(term) ?? 0;
		frequency.set(term, currentCount + 1);
	}
	
	return frequency;
}

/**
 * @brief Calculates the term frequency (TF) for each token in the given array of tokens.
 * @param tokens 
 * @returns Map<string, number> A map where keys are tokens and values are their respective term frequencies.
 */
function tokenFrequency(tokens: string[]): Map<string, number> {
	const frequency = tokenCount(tokens);
	const length = tokens.length;
	const res = new Map<string, number>();
	if (length === 0) {
		return res;
	}
	for (const [term, count] of frequency) {
		res.set(term, count / length);
	}

	return res;
}

/**
 * @brief Calculates the document frequency (DF) for each unique token across the given array of DataChunk objects.
 * @param chunks 
 * @returns Map<string, number> A map where keys are unique tokens and values are the number of documents in which each token appears.
 */
function documentFrequency(chunks: DataChunk[]): Map<string, number> {
	const frequency = new Map<string, number>();
	for (const i of chunks)
	{
		for (const term of i.tf.keys())
		{
			const currentCount = frequency.get(term) ?? 0;
			frequency.set(term, currentCount + 1);
		}
	}

	return frequency;
}

export {
		tokenCount,
		tokenFrequency,
		documentFrequency
	}