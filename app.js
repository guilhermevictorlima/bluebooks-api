import express from 'express';
import fetch from 'node-fetch';

const server = express();
const PORT = process.env.PORT || 3000;
const URL_POST_BOOKS = 'https://requisitos.bluesoft.com.br/api/books';

server.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

async function sendRequestAPI(jsonArray, tokenId, tokenSecret) {
	const responses = [];
	console.log(`Token ${tokenId}:${tokenSecret}`);

	for (const json of jsonArray) {
		try {
			const res = await fetch(URL_POST_BOOKS, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Token ${tokenId}:${tokenSecret}`,
				},
				body: JSON.stringify(json),
			});

			console.error(`Requisição enviada com sucesso: ${json.name}`)
			responses.push({ response: res, json });
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
			const responses = await sendRequestAPI(json.requestJsons, json.tokenId, json.tokenSecret);
			console.log(`Quantidade de respostas: ${responses.length}`);
			res.status(200).json(responses);	
		} catch(error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
});


server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));