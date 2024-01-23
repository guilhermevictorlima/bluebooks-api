import express from 'express';
import fetch from 'node-fetch';

const server = express();
const PORT = process.env.PORT || 3000;

server.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});


async function makeRequest(body, requestName, tokenId, tokenSecret, url, httpMethod) {
	const requestResponse = await fetch(url, {
		method: httpMethod,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${tokenId}:${tokenSecret}`,
		},
		body: body
	});

	if (requestResponse.ok) {
		console.log(`Requisição enviada com sucesso: ${requestName ? requestName : httpMethod}`);
		return await requestResponse.json();
	} else {
		console.log(JSON.stringify(body, null, 2));
		console.error(`Algo de errado ocorreu ao realizar a requisição: Status ${requestResponse.status}, JSON: ${JSON.stringify(await requestResponse.json(), null, 2)}`);
		return { error: `Algo de errado ocorreu ao realizar a requisição: Status ${requestResponse.status}, JSON: ${JSON.stringify(await requestResponse.json())}` };
	}
}

async function sendRequestsByJsons(jsonArray, tokenId, tokenSecret, url, httpMethod) {
	const responses = [];

	for (const json of jsonArray) {
		try {
			responses.push(await makeRequest(JSON.stringify(json), json.name, tokenId, tokenSecret, url, httpMethod));
		} catch (error) {
			console.error(`Ocorreu um erro: ${error}`)
			responses.push({ error: `Erro ao realizar requisição (${json.name}): ${error}`, json });
		}
	}

	return responses;
}

server.post('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');

	let data = '';

	req.on('data', chunk => data += chunk);
	req.on('end', async () => {
		try {
			const json = JSON.parse(data);
			console.log(`Token ${json.tokenId}:${json.tokenSecret}`);

			let responses;

			if (json.httpMethod === 'POST' || json.httpMethod === 'PUT') {
				responses = await sendRequestsByJsons(json.requestJsons, json.tokenId, json.tokenSecret, json.url, json.httpMethod);
			} else {
				responses = await makeRequest(null, '', json.tokenId, json.tokenSecret, json.url, json.httpMethod);
			}

			console.log(`Quantidade de respostas: ${responses.length || 1}`);
			res.status(200).json(responses);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
});


server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));