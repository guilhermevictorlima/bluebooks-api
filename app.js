import express from 'express';
import fetch from 'node-fetch';

const server = express();
const PORT = process.env.PORT || 3000;

server.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

async function sendRequestAPI(jsonArray, tokenId, tokenSecret, url, httpMethod) {
	const responses = [];
	console.log(`Token ${tokenId}:${tokenSecret}`);

	for (const json of jsonArray) {
		try {
			const requestResponse = await fetch(url, {
				method: httpMethod,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Token ${tokenId}:${tokenSecret}`,
				},
				body: JSON.stringify(json),
			});

			if (requestResponse.ok) {
				console.log(`Requisição enviada com sucesso: ${json.name}`);
				responses.push(await requestResponse.json());
			} else {
				console.log(JSON.stringify(json, null, 2));
				console.error(`Algo de errado ocorreu ao realizar a requisição: Status ${requestResponse.status}, JSON: ${JSON.stringify(await requestResponse.json(), null, 2)}`);
				responses.push({ error: `Algo de errado ocorreu ao realizar a requisição: Status ${requestResponse.status}, JSON: ${JSON.stringify(await requestResponse.json())}`});
			}
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
			const responses = await sendRequestAPI(json.requestJsons, json.tokenId, json.tokenSecret, json.url, json.httpMethod);
			console.log(`Quantidade de respostas: ${responses.length}`);
			res.status(200).json(responses);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
});


server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));