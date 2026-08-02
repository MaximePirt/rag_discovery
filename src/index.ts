import * as parse_f from "./file_pars.js"


async function main() : Promise <void>
{

	try {
		// const files =  await parse_f.listfiles("./documents");
		// if (!files)
		// 	throw Error
		const files = ['sql.txt']
		await parse_f.readfiles(files);
	}
	catch {
		console.log("An error occured")
	}
}


main().catch(console.error)
