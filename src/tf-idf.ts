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
function documentFrequency(chunks: Map<string, number>[]): Map<string, number> {
	const frequency = new Map<string, number>();
	for (const i of chunks)
	{
		for (const term of i.keys())
		{
			const currentCount = frequency.get(term) ?? 0;
			frequency.set(term, currentCount + 1);
		}
	}

	return frequency;
}

/**
 * @brief Calculates the inverse document frequency (IDF) 
 * 		for each unique token based on the provided document frequency and total number of chunks.
 * @param documentFrequency  A map where keys are unique tokens and values are the number of documents in which each token appears.
 * @param totalChunks The total number of chunks (documents) considered for the IDF calculation.
 * @returns Map<string, number> A map where keys are unique tokens and values are their respective inverse document frequencies.
 * @note The IDF is calculated using the formula: IDF(term) = log(totalChunks / documentFrequency(term)).
 * 		if only 1 chunk is present, the IDF will be 0 for all tokens.
 * 		if a token appears in all chunks, its IDF will also be 0.
 * 		a token that appears in only one chunk will have the highest IDF value.
 */
function inverseDocumentFrequency(documentFrequency: Map<string, number>, totalChunks: number): Map<string, number> {
	const idf = new Map<string, number>();
	if (totalChunks === 0)
		return idf;
	for (const [term, df] of documentFrequency)
	{
		let score = Math.log(totalChunks/ df);
		idf.set(term, score);
	}

	return idf
}

/**
 * @brief Computes the TF-IDF score for each token based on its term frequency (TF) and inverse document frequency (IDF).
 * @param tf 
 * @param idf 
 * @returns 
 */
function computeTfIdf(tf: Map<string, number>, idf: Map<string, number>): Map<string, number> {
	const tfidf = new Map<string, number>();
	for (const [term, tfvalue] of tf)
	{
		const score = idf.get(term)
		if (score === undefined)
			continue;
		tfidf.set(term, tfvalue * score);
	}

	return tfidf;
}


/**
 * @brief Calculates the cosine similarity between two vectors
 * 		represented as maps of tokens and their respective values.
 * @param vectorA
 * @param vectorB 
 * @returns number result of the cosine similarity calculation, ranging from 0 (no similarity) to 1 (identical vectors).
 * @note The cosine similarity is calculated using the formula:
 * 		cosine_similarity(A, B) = (A . B) / (||A|| * ||B||)
 * 		where A . B is the dot product of vectors A and B,
 * 		and ||A|| and ||B|| are the magnitudes (lengths) of vectors A and B, respectively.
 * @note If either vector has a magnitude of 0, the function returns 0 to avoid division by zero.
 */
function cosineSimilarity(vectorA: Map<string, number>, vectorB: Map<string, number>) : number {
	let dot = 0;
	let vecASquareSum = 0;
	let vecBquareSum = 0;

	for (const [term, valueA] of vectorA)
	{
		vecASquareSum += valueA **2;
		const valueB = vectorB.get(term) ?? 0;
		dot += valueA * valueB;
	}
	for (const valueB of vectorB.values())
		vecBquareSum += valueB **2;

	const Asquare = Math.sqrt(vecASquareSum);
	const Bsquare = Math.sqrt(vecBquareSum);
	
	if (Asquare === 0 || Bsquare === 0)
		return 0;

	return dot / (Asquare * Bsquare);
}

export {
		tokenCount,
		tokenFrequency,
		documentFrequency,
		inverseDocumentFrequency,
		computeTfIdf,
		cosineSimilarity,
	}