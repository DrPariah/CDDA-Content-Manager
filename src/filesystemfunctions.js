const fs = require('fs');
const path = require('path');


//Takes a directory string, i.e. c:\users\tom\somefolder
//Returns a list of all the files in the folder and subfolders
//The returned filenames are full path names, i.e. c:\users\tom\somefolder\somesettings.json
async function getAllFiles(dirPath, arrayOfFiles) {
	let files = fs.readdirSync(dirPath)
    let i = 0;
    let amountOfFiles = files.length;
	let fullFilePath = "";

    for (; i < amountOfFiles; i++) {
		if (files[i]) {
			fullFilePath = dirPath + "/" + files[i];
			if (fs.statSync(fullFilePath).isDirectory()) {
				arrayOfFiles = await getAllFiles(fullFilePath, arrayOfFiles)
			} else {
				arrayOfFiles.push(path.join(dirPath, "/", files[i]))
			}
		} else {
			console.log("files[i] does not have a name");
		}
    }
	return arrayOfFiles
}


//Returns the contents of a json file in the form of a JSON object
async function getJsonFromFile(filepath){
	if(!fileExists(filepath)){
		return "file does not exist";
	}
	if(filepath.split('.').pop() != "json"){
		//console.log('[getJsonFromFile]: skipped file \"'+filepath+'\", it is not a json file');
		return "file is not a json file";
	}
	
	const util = require('util');
	const readfile = util.promisify(fs.readFile);

	let names;
	try {
		data = await readfile(filepath);
	} catch (err) {
		console.log(err);
	}
	if (data === undefined) {
		console.log('[getJsonFromFile]:undefined');
	} else {
		let jsonObj;
		try {
			jsonObj = JSON.parse(data);
		} catch (e) {
			if (e instanceof SyntaxError) {
				console.log('[getJsonFromFile]: file \"'+filepath+'\", contains bad syntax');
				printError(e, true);
			} else {
				printError(e, false);
			}
		}
		return jsonObj;
	}
}
var printError = function(error, explicit) {
    console.log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`);
}


//Gets the cataclysm game folder previously selected by the user
async function getCataclysmGameFolder(){
	if(!fileExists("userSettings.json")){
		return "No game folder set!";
	}
	
	const util = require('util');
	const readfile = util.promisify(fs.readFile);

	let names;
	try {
		data = await readfile('userSettings.json');
	} catch (err) {
		console.log(err);
	}
	if (data === undefined) {
		console.log('[getCataclysmGameFolder]:undefined');
	} else {
		let jsonParsed = JSON.parse(data);
		return jsonParsed["cataclysmGameFolder"];
	}
}
		
function fileExists(fileName){
	try {
	  if (fs.existsSync(fileName)) {
		//file exists
		return true;
	  }
	} catch(err) {
	  console.log(err);
	return false;
	}
}