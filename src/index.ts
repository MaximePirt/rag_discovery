import * as parse_f from "./file_pars.js"
import * as rag_f from "./tf-idf.js"
import * as interface_i from "./interface.js"
import * as c from "./chunk.js"


/**
 * @brief Displays the top search results based on cosine similarity scores.
 * @param results 
 * @returns 
 * @note The function limits the display to a maximum of 3 results, but it also shows the total number of results found.
 * @note This limit is set to match subject requirements, but can be adjusted as needed.
 * @note if limit > results.length, it will display all results.
 */
function displayResults(results: interface_i.SearchResult[]): void {
	const ChunkDisplayLimit = 3;
	const displayCount = Math.min(ChunkDisplayLimit, results.length);
	console.log(`Top ${displayCount} results out of ${results.length} total results.`);

	for (let i = 0; i < displayCount; i++) {
		const result = results[i];
		if (result === undefined) {
			console.log(`Result ${i + 1}: Chunk is undefined`);
			continue;
		}
		console.log(`Chunk ID: ${result.chunk.id}, Document: ${result.chunk.documentName}, score: ${result.similarity}\n[${result.chunk.text}]\n`);
	}
	return
}

/**
 * @brief The main function that orchestrates files parsing, chunk creation,
 * 		and RAG (Retrieval-Augmented Generation) processing.
 * @returns void
 */
async function main() : Promise <void>
{

	try {
//------------------------- Parse documents and create chunks
		const files =  await parse_f.listfiles("./documents");
		if (!files)
			throw Error

		const bookContent = await parse_f.readfiles(files);
		if (!bookContent)
			throw Error
		const chunks: interface_i.Chunk[] = []
		for (let i = 0; i < bookContent.length; i++)
		{
			const pairs = bookContent[i]
			if (pairs == undefined)
				continue
			const {filename, content } = pairs
			chunks.push(...c.createChunk(content, filename))
		}

//------------------------- Calculate TF-IDF


		const tfChunks: Map<string, number>[] = []
		for (const i of chunks)
		{
			const frequency = rag_f.tokenFrequency(i.tokens)
			tfChunks.push(frequency)
		}
		const docFrequency = rag_f.documentFrequency(tfChunks)
		
		const idf = rag_f.inverseDocumentFrequency(docFrequency, tfChunks.length)

//------------------------- Create DataChunks
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

//------------------------- Query processing
		const args = process.argv.slice(2)
		const query = args[0]

		if (!query) {
			throw new Error("No query provided. Please provide a query as a command line argument.");
		}

		const queryTokens = parse_f.tokenize(query)
		const queryTf = rag_f.tokenFrequency(queryTokens)
		const queryTfidf = rag_f.computeTfIdf(queryTf, idf)


//------------------------- Cosine similarity calculation

		const cosineSimilarities: interface_i.SearchResult[] = []
		for (const dataChunk of dataChunks)
		{
			const similarity = rag_f.cosineSimilarity(queryTfidf, dataChunk.tfidf)
			cosineSimilarities.push({ chunk: dataChunk, similarity: similarity })
		}

		cosineSimilarities.sort((a, b) => b.similarity - a.similarity)

//------------------------- Display results
		displayResults(cosineSimilarities)
		

	}
	catch (error) {
		console.log(error)
	}
}


main().catch(console.error)
