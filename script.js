import api_key from './env.js'
console.log(api_key)

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

// Iniciar processamento assim que a página carregar
window.addEventListener('load', async () => {

    // elementos HTML
    const selectEstados = document.getElementById('estados');
    const selectCidades = document.getElementById('cidades');

    // dados
    const estados = await getApi('https://servicodados.ibge.gov.br/api/v1/localidades/estados');



    // Adiciona opções no select de estados
    estados.forEach(estado => {
        selectEstados.innerHTML += createOption(estado.id, estado.nome)
    });



    // Adiciona listener de eventos no select estado
    selectEstados.addEventListener('change', async function () {
        const cidades = await getApi(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${this.value}/municipios`);
        if (this.value != 'none') {
            selectCidades.style.display = 'block'
        }else{
            selectCidades.style.display = 'none'
        }
        cidades.forEach(cidade => {
            selectCidades.innerHTML += createOption(cidade.id, cidade.nome)
        });
    })



    // Adiciona listener de eventos no select cidades
    selectCidades.addEventListener('change', async function () {
        weatherData = await getApi('')         
    });



    console.log
})
