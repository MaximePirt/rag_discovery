import * as rag_f from './tf-idf.js'
import * as interface_i from './interface.js'
import * as c from './chunk.js'
import * as parse_f from './file_pars.js'

/**
 * @brief Searches for the most relevant DataChunks based on a query string,
 *  using cosine similarity between the query's TF-IDF vector and the TF-IDF vectors 
 * 	of the DataChunks.
 * @param dataChunks An array of DataChunk objects, each containing text and its corresponding TF-IDF vector.
 * @param idf A map of inverse document frequency (IDF) values for each token, used to compute the TF-IDF vector for the query.
 * @returns  An array of SearchResult objects, each containing a DataChunk and its similarity score to the query, sorted in descending order of similarity.
 * @throws Error if no query is provided as a command line argument.
 * @note The function expects the query to be passed as the first command line argument.
 * @note The similarity scores are calculated using cosine similarity, which measures the cosine of the angle between two vectors in a multi-dimensional space.
 * @note The results are sorted in descending order of similarity, so the most relevant DataChunks appear first in the returned array.
 */
function search(dataChunks: interface_i.DataChunk[], idf: Map<string, number>): interface_i.SearchResult[]
{
	//----------  Query processing
	const args = process.argv.slice(2)
	const query = args[0]

	if (!query) {
		throw new Error("No query provided. Please provide a query as a command line argument.");
	}

	const queryTokens = parse_f.tokenize(query)
	const queryTf = rag_f.tokenFrequency(queryTokens)
	const queryTfidf = rag_f.computeTfIdf(queryTf, idf)

	//---------- Cosine similarity calculation

	const cosineSimilarities: interface_i.SearchResult[] = []
	for (const dataChunk of dataChunks)
	{
		const similarity = rag_f.cosineSimilarity(queryTfidf, dataChunk.tfidf)
		cosineSimilarities.push({ chunk: dataChunk, similarity: similarity })
	}

	cosineSimilarities.sort((a, b) => b.similarity - a.similarity)
	return cosineSimilarities
}


/**
 * @brief Builds an index of DataChunks from the provided chunks,
 * 		calculating their TF-IDF vectors and the overall IDF values for the tokens.
 * @param chunks  An array of Chunk objects, each containing text and its corresponding tokens.
 * @returns An object containing an array of DataChunk objects with their TF-IDF vectors and a map of IDF values for the tokens.
 * @note The function first calculates the term frequency (TF) for each chunk, then computes the document frequency (DF) and inverse document frequency (IDF) for the tokens.
 * @note The resulting DataChunks include both the original chunk data and their corresponding TF and TF-IDF vectors, which can be used for search and retrieval operations.
 */
function buildIndex(chunks : interface_i.Chunk[]): { dataChunks: interface_i.DataChunk[], idf: Map<string, number> } {
	//---------- Calculate TF-IDF

	const tfChunks: Map<string, number>[] = []
	for (const i of chunks)
	{
		const frequency = rag_f.tokenFrequency(i.tokens)
		tfChunks.push(frequency)
	}
	const docFrequency = rag_f.documentFrequency(tfChunks)
	
	const idf = rag_f.inverseDocumentFrequency(docFrequency, tfChunks.length)

	//---------- Create DataChunks
	const dataChunks: interface_i.DataChunk[] = []
	for (let i = 0; i < chunks.length; i++)
	{
		const chunk = chunks[i]
		const tf = tfChunks[i]
		if (tf == undefined)
			continue
		const tfidf = rag_f.computeTfIdf(tf, idf)
		if (chunk == undefined || tfidf == undefined)
			continue
		const dataChunk = c.createDataChunk(chunk, tf, tfidf)
		dataChunks.push(dataChunk)
	}

	return { dataChunks, idf }
}


export {
		buildIndex,
		search
	}