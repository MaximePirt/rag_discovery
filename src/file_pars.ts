import { readFileSync } from 'fs';
import * as fs from 'fs/promises'
import * as Path from 'path'


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
 * @brief Represents the content of a file, including its filename and the actual content.
 * @property filename - The name of the file.
 * @property content - The content of the file as a string.
 */
interface FileContent {
	filename: string;
	content: string;
}

/**
 * @brief 	Lists all files in the specified folder that have a .md or .txt extension.
 * 			Ignore every other file types.
 * @param folder 
 * @returns 
 */
async function listfiles(folder: string) : Promise <string[]>{

	try{
		let files = await fs.readdir(folder)
		console.log("Here is files :", files)
		const res = files.filter(
			filename => filename.endsWith(".md") || filename.endsWith(".txt"),)
		return res
	}
	catch {
		console.error("Error while readding folder", folder)
		throw new Error() 
	}
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
	const maxLength = 30;

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

/**
 * @brief Tokenizes the given text into an array of tokens by splitting on whitespace.
 * @param text The text to be tokenized.
 * @returns string[] An array of tokens extracted from the input text.
 */
function tokenize(text: string): string[] {
	const res = text.split(/\s+/).filter(token => token.length > 0);
	return res
}


/**
 * @brief Creates an array of Chunk objects from the given file content and filename.
 * @param fileContent 
 * @param filename 
 * @returns 
 */
function createChunk(fileContent: string, filename: string){
	let nextId = 0
	let chunksTable: Chunk[] = []

	const textChunks = splitIntoChunks(fileContent)
	for (let position = 0; position < textChunks.length; position++){
		const text = textChunks[position];
		if (text == undefined)
			continue
		const chunk: Chunk = {
			id: nextId++,
			documentName: filename,
			ref: `${filename}#${position}`,
			text: text,
			tokens: tokenize(text)
		}
		chunksTable.push(chunk)
	}
	return chunksTable
}


/**
 * @brief Reads the content of multiple files
 * @param files  - An array of filenames to read from the "./documents" directory
 * @returns Filecontent[] - Array of objects containing filename and content
 */
async function readfiles(files : string[]) : Promise <FileContent[]> {
	try{
		const bookContents: FileContent[] = [];
		for (const filename of files)
		{
			const content = await fs.readFile(Path.join("./documents", filename), "utf-8")
			bookContents.push({ filename, content })
		}
		return bookContents
	}
	catch{
		console.error("Error while reading files", files)
		throw new Error()
	}
}



export { 	listfiles,
			readfiles,
			createChunk,
		}
