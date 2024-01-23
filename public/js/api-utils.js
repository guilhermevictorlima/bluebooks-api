function showLoading() {
	document.getElementById('uploadBtn').disabled = true;
	document.querySelectorAll('.requestForm')
		.forEach(el => el.disabled = true);

	document.getElementById('uploadBtnDefaultLabel').style.display = 'none';

	document.querySelectorAll('.buttonLoadingLabel')
		.forEach(el => el.style.display = 'inline-block');
}

function hideLoading() {
	document.getElementById('uploadBtn').disabled = false;
	document.querySelectorAll('.requestForm')
		.forEach(el => el.disabled = false);

	document.getElementById('uploadBtnDefaultLabel').style.display = 'inline-block';

	document.querySelectorAll('.buttonLoadingLabel')
		.forEach(el => el.style.display = 'none');
}

function showResponse(responseText) {
	const element = document.getElementById('resposta');
	element.value = `${responseText}\n`;

	element.style.height = `${element.scrollHeight}px`;
}

async function sendAPIRequest(jsonsArray) {
	const tokenId = document.getElementById('tokenId').value;
	const tokenSecret = document.getElementById('tokenSecret').value;
	const url = document.getElementById('url').value;
	const httpMethod = document.getElementById('httpMethod').value;

	const requestBody = {
		tokenId,
		tokenSecret,
		url,
		httpMethod,
		requestJsons: jsonsArray
	};

	fetch(`${window.location.origin}/api`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	}).catch(error => showResponse(error))
	  .then(response => response.json().then(data => ({ status: response.status, body: data })))
	  .then(responseObj => {
		showResponse(JSON.stringify(responseObj, null, 2));
		hideLoading();
	});
}

export { sendAPIRequest, showLoading };