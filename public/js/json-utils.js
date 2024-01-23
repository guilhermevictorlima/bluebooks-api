function isJson(str) {
	try {
		JSON.parse(str);
		return true;
	} catch (error) {
		return false;
	}
}

function convertJsonNodes(obj) {
	for (const key in obj) {
		const value = obj[key];

		if (typeof value === 'object') {
			convertJsonNodes(value);
		}

		if (typeof value === 'string' && isJson(value)) {
			obj[key] = JSON.parse(value);
		}
	}
}

function excelToJson(fileData) {
	const { Sheets, SheetNames } = XLSX.read(fileData, { type: 'binary' });

	const convertedRows = SheetNames.map(sheetName => [
		sheetName,
		XLSX.utils.sheet_to_json(Sheets[sheetName]),
	]).map(pages => Object.values(pages));

	const convertedJson = Object.values(Object.fromEntries(convertedRows))
		.reduce((array1, array2) => array1.concat(array2));

	convertJsonNodes(convertedJson);

	return convertedJson;
}


export default excelToJson;