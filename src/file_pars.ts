import { readFileSync } from 'fs';
import * as fs from 'fs/promises'
import * as Path from 'path'


interface Chunk{
	id: number;
	documentName: string;
	ref: string;
	text: string;
	tokens: string[];
}


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




let nextId = 0
async function readfiles(files : string[]) : Promise <void> {
	try{
		for (const filename of files)
		{
			console.log("Here is i :", filename)
			const fileContent = await fs.readFile(Path.join("./documents", filename), "utf-8")
			// console.log(fileContent)
		}
	}
	catch{
		console.error("An error occured")
	}
}



export { 	listfiles,
			readfiles
		}
