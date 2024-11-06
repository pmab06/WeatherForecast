const apiIbge = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'

async function getApi(url) {
    response = await fetch(url);
    data = await response.json();
    return data;
}

window.addEventListener('load', async () => {
    function createOption(optionValue, optionText) {
        return `<option value="${optionValue}">${optionText}</option>`
    }

    const estados = await getApi(apiIbge);

    const selectEstados = document.getElementById('estados');
    const selectCidades = document.getElementById('cidades');

    estados.forEach(estado => {
        selectEstados.innerHTML += createOption(estado.id, estado.nome)
    });

    selectEstados.addEventListener('change', async function () {

        const cidades = await getApi(apiIbge + "/" + this.value + '/municipios');

        // selectCidades.style.opacity = '100'
        selectCidades.style.display = 'block'

        cidades.forEach(cidade => {
            selectCidades.innerHTML += createOption(cidade.id, cidade.nome)
        });
        // selectCidades.addEventListener('change', async function () {

        // })
    })
})
