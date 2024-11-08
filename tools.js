// Função simples para retornar uma opção em HTML (string)
function createOption(optionValue, optionText) {
    return `<option value="${optionValue}">${optionText}</option>`
}

// Função simples que busca e retorna dados de APIs
async function getApi(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

// 1 ---> 01
function doisDigitos(n) {
    return (n < 10 ? '0' : '') + n;
}

export {createOption, getApi, doisDigitos}