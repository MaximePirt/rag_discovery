

/**
 * @brief Represents the content of a file, including its filename and the actual content.
 * @property filename - The name of the file.
 * @property content - The content of the file as a string.
 */
export interface FileContent {
	filename: string;
	content: string;
}


/**
 * @brief Represents a chunk of text extracted from a document, along with its metadata.
 * @property id - A unique identifier for the chunk.
 * @property documentName - The name of the document from which the chunk was extracted.
 * @property ref - A reference string that indicates the position of the chunk within the document.
 * @property text - The actual text content of the chunk.
 * @property tokens - An array of tokens (words) extracted from the text content.
 */
export interface Chunk{
	id: number;
	documentName: string;
	ref: string;
	text: string;
	tokens: string[];
}

/**
 * @brief Extends the Chunk interface from file_pars.ts to include term frequency (tf) information.
 * @interface DataChunk
 * @extends {parse_f.Chunk}
 * @property {Map<string, number>} tf - A map where keys are tokens and values are their respective term frequencies.
 */
export interface DataChunk extends Chunk {
	tf: Map<string, number>;
	tfidf: Map<string, number>;
}

/**
 * @brief Represents the result of a search operation, including the chunk of text and its similarity score.
 * @interface SearchResult
 * @property {DataChunk} chunk - The chunk of text that matched the search query.
 * @property {number} similarity - The similarity score between the search query and the chunk of text.
 */
export interface SearchResult {
	chunk: DataChunk;
	similarity: number;
}