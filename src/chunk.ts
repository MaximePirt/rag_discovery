import * as interface_i from './interface.js'
import * as parse_f from './file_pars.js'

/**
 * @brief Creates a DataChunk object by combining a Chunk with its corresponding term frequency (tf) and term frequency-inverse document frequency (tfidf) maps.
 * @param chunk - The Chunk object containing the text and metadata.
 * @param tf - A map of term frequencies for the tokens in the chunk.
 * @param tfidf - A map of term frequency-inverse document frequency values for the tokens in the chunk.
 * @returns A DataChunk object that includes the original chunk data along with its tf and tfidf maps.
 */
function createDataChunk(chunk: interface_i.Chunk, tf: Map<string, number>, tfidf: Map<string, number>): interface_i.DataChunk {
	return { ...chunk, tf: tf, tfidf: tfidf }

}


/**
 * @brief Creates an array of Chunk objects from the given file content and filename.
 * @param fileContent 
 * @param filename 
 * @returns 
 */
function createChunk(fileContent: string, filename: string){
	let nextId = 0
	let chunksTable: interface_i.Chunk[] = []

	const textChunks = splitIntoChunks(fileContent)
	for (let position = 0; position < textChunks.length; position++){
		const text = textChunks[position];
		if (text == undefined)
			continue
		const chunk: interface_i.Chunk = {
			id: nextId++,
			documentName: filename,
			ref: `${filename}#${position}`,
			text: text,
			tokens: parse_f.tokenize(text)
		}
		chunksTable.push(chunk)
	}
	return chunksTable
}



/**
 * @brief Splits the given file content into chunks of text,
 * 		maximum length of 500 characters (end with periods, exclamation marks, or question marks)
 * 		If no end found : split at the maximum length.
 * @param fileContent The content of the file to be split into chunks.
 * @returns string[] An array of strings, where each string is a chunk of the original file content.
 */
function splitIntoChunks(fileContent: string): string[] {
	const chunks: string[] = [];
	const maxLength = 500;

	let remainingText = fileContent.trim();
	while (remainingText.length > maxLength) {
		const textToCut = remainingText.slice(0, maxLength + 1);
		const sentenceEnd = Math.max(
			textToCut.lastIndexOf("."),
			textToCut.lastIndexOf("!"),
			textToCut.lastIndexOf("?")
		);
		const lineBreak = textToCut.lastIndexOf("\n");
		const space = textToCut.lastIndexOf(" ");

		let cutIndex: number;
		if (sentenceEnd !== -1) {
			cutIndex = sentenceEnd + 1;
		} else if (lineBreak !== -1) {
			cutIndex = lineBreak + 1;
		} else if (space !== -1) {
			cutIndex = space + 1;
		} else {
			cutIndex = maxLength;
		}

		const chunk = remainingText.slice(0, cutIndex).trim();
		if (chunk.length > 0) {
			chunks.push(chunk);
		}
		remainingText = remainingText.slice(cutIndex).trim();
	}
	if (remainingText.length > 0) {
		chunks.push(remainingText);
	}
	return chunks;
}

export {
	createDataChunk,
	createChunk,
	splitIntoChunks,

}