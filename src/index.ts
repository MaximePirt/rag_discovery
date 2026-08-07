import * as parse_f from "./file_pars.js"
import * as rag_f from "./tf-idf.js"

interface SearchResult {
	chunk: rag_f.DataChunk;
	similarity: number;
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
		// const files =  await parse_f.listfiles("./documents");
		// if (!files)
		// 	throw Error
		// TODO : DEBUG variable

		const files = ['test.txt']
		const bookContent = await parse_f.readfiles(files);
		if (!bookContent)
			throw Error
		const chunks: parse_f.Chunk[] = []
		for (let i = 0; i < bookContent.length; i++)
		{
			const pairs = bookContent[i]
			if (pairs == undefined)
				continue
			const {filename, content } = pairs
			chunks.push(...parse_f.createChunk(content, filename))
		}
		// console.log("Here is chunks :", chunks)

//------------------------- Calculate TF-IDF


		const tfChunks: Map<string, number>[] = []
		for (const i of chunks)
		{
			const frequency = rag_f.tokenFrequency(i.tokens)
			tfChunks.push(frequency)
		}
		// console.log("Here is tfChunks :", tfChunks)

		const docFrequency = rag_f.documentFrequency(tfChunks)
		// console.log("Here is docFrequency :", docFrequency)
		
		const idf = rag_f.inverseDocumentFrequency(docFrequency, tfChunks.length)
		// console.log("Here is idf :", idf)

//------------------------- Create DataChunks
		const dataChunks: rag_f.DataChunk[] = []
		for (let i = 0; i < chunks.length; i++)
		{
			const chunk = chunks[i]
			const tf = tfChunks[i]
			if (tf == undefined)
				continue
			const tfidf = rag_f.computeTfIdf(tf, idf)
			if (chunk == undefined || tfidf == undefined)
				continue
			const dataChunk = rag_f.createDataChunk(chunk, tf, tfidf)
			dataChunks.push(dataChunk)
		}
		// console.log("Here is dataChunks :", dataChunks)

//------------------------- Query processing
		const query = "What is the main topic 1.2.3? of the database?"

		const queryTokens = parse_f.tokenize(query)
		const queryTf = rag_f.tokenFrequency(queryTokens)
		const queryTfidf = rag_f.computeTfIdf(queryTf, idf)

		console.log("Here is queryTfidf :", queryTfidf)

//------------------------- Cosine similarity calculation

		const cosineSimilarities: SearchResult[] = []
		for (const dataChunk of dataChunks)
		{
			const similarity = rag_f.cosineSimilarity(queryTfidf, dataChunk.tfidf)
			cosineSimilarities.push({ chunk: dataChunk, similarity: similarity })
		}

		cosineSimilarities.sort((a, b) => b.similarity - a.similarity)

//------------------------- Display results
		console.log("Here is cosineSimilarities :", cosineSimilarities)

		

	}
	catch (error) {
		console.log("An error occured", error)
	}
}


main().catch(console.error)
