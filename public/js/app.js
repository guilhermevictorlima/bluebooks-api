import excelToJson from './json-utils.js';
import { sendAPIRequest, showLoading } from './api-utils.js';

document.addEventListener("DOMContentLoaded", () => {
	async function onFileSubmit(file) {
		const reader = new FileReader();

		reader.onload = async (e) => {
			const data = e.target.result;
			sendAPIRequest(excelToJson(data));
		};

		reader.readAsBinaryString(file);
	}

	function clearResponses() {
		document.getElementById('resposta').value = '';
	}

	function showOrHideFileInput(method) {
		const isMethodWithRequestBody = method === 'POST' || method === 'PUT';
		const fileInput = document.getElementById('file');
		fileInput.style.display = isMethodWithRequestBody ? 'block' : 'none';
		fileInput.required = isMethodWithRequestBody;
	}

	document.getElementById('httpMethod')
		.addEventListener('change', ev => showOrHideFileInput(ev.target.value));

	document.getElementById('fileForm')
		.addEventListener('submit', ev => {
			ev.preventDefault();
			clearResponses();
			showLoading();

			const file = document.getElementById('file').files[0];

			if (file) {
				onFileSubmit(file);
			} else {
				sendAPIRequest(null);
			}
		});
});