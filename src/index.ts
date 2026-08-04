import * as parse_f from "./file_pars.js"

/**
 * @brief The main function that orchestrates files parsing, chunk creation,
 * 		and RAG (Retrieval-Augmented Generation) processing.
 * @returns void
 */
async function main() : Promise <void>
{

	try {
		const files =  await parse_f.listfiles("./documents");
		if (!files)
			throw Error
		// TODO : DEBUG variable
		// const files = ['docker.txt']
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
	}
	catch (error) {
		console.log("An error occured", error)
	}
}


main().catch(console.error)
