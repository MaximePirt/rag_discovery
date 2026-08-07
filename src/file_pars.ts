import * as fs from 'fs/promises'
import * as Path from 'path'
import * as interface_i from './interface.js'


/**
 * @brief 	Lists all files in the specified folder that have a .md or .txt extension.
 * 			Ignore every other file types.
 * @param folder 
 * @returns 
 */
async function listfiles(folder: string) : Promise <string[]>{

	try{
		let files = await fs.readdir(folder)
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
 * @brief Tokenizes the given text into an array of tokens by splitting on whitespace.
 * @param text The text to be tokenized.
 * @returns string[] An array of tokens extracted from the input text.
 */
function tokenize(text: string): string[] {
	const res = text.toLowerCase().split(/\s+|(?<!\d)[.!?…]+|[!?…]+|\.(?!\d)/).filter(token => token.length > 0);
	return res
}



/**
 * @brief Reads the content of multiple files
 * @param files  - An array of filenames to read from the "./documents" directory
 * @returns Filecontent[] - Array of objects containing filename and content
 */
async function readfiles(files : string[]) : Promise <interface_i.FileContent[]> {
	try{
		const bookContents: interface_i.FileContent[] = [];
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
			tokenize,
		}
