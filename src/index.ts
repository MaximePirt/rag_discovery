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
		console.log("Here is chunks :", chunks)

//------------------------- Calculate TF-IDF

		const calcChunk: rag_f.DataChunk[] = []
		for (const i of chunks)
		{
			const frequency = rag_f.tokenFrequency(i.tokens)
			console.log("Here is frequency for chunk", i.id, ":", frequency)
			calcChunk.push({ ...i, tf: frequency })
		}
		console.log("Here is calcChunk :", calcChunk)



	}
	catch (error) {
		console.log("An error occured", error)
	}
}


main().catch(console.error)
