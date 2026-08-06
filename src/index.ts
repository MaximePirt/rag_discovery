import * as parse_f from "./file_pars.js"
import * as rag_f from "./tf-idf.js"

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

		let tfidfChunks: Map<string, number>[] = []
		for ( const i of tfChunks)
		{
			const tfidf = rag_f.computeTfIdf(i, idf)
			tfidfChunks.push(tfidf)
		}
		// console.log("Here is tfidfChunks :", tfidfChunks)

//------------------------- Create DataChunks
		const dataChunks: rag_f.DataChunk[] = []
		for (let i = 0; i < chunks.length; i++)
		{
			const chunk = chunks[i]
			const tf = tfChunks[i]
			const tfidf = tfidfChunks[i]
			if (chunk == undefined || tf == undefined || tfidf == undefined)
				continue
			const dataChunk = rag_f.createDataChunk(chunk, tf, tfidf)
			dataChunks.push(dataChunk)
		}
		console.log("Here is dataChunks :", dataChunks)


	}
	catch (error) {
		console.log("An error occured", error)
	}
}


main().catch(console.error)
