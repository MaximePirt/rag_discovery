import * as parse_f from "./file_pars.js"
import * as interface_i from "./interface.js"
import * as search_f from "./search.js"


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
 * @note Project need to be run with a query as a command line argument, e.g., `npm start -- "your query here"`.
 * 		Project will throw an error if no query is provided.
 * @note The function first parses and chunks the documents, then builds an index of DataChunks with their TF-IDF vectors.
 * 		Finally, it processes the query and calculates cosine similarity scores to find the most relevant DataChunks.
 */
async function main() : Promise <void>
{

	try {
		const query = process.argv.slice(2).join(" ").trim();
	
		if (!query)
			throw new Error("No query provided. Please provide a query as a command line argument. : npm start -- \"your query here\"");
		
		//------------ Parse documents and create chunks
		const chunks = await parse_f.parseAndChunkDocuments()

		//------------ Calculate TF-IDF & Create DataChunks
		const { dataChunks, idf } = search_f.buildIndex(chunks)

		//------------ Query processing & Cosine similarity calculation
		const cosineSimilarities = search_f.search(query, dataChunks, idf)

		displayResults(cosineSimilarities)

	}
	catch (error) {
		console.log(error)
	}
}


main().catch(console.error)
