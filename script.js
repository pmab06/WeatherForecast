import api_key from './env.js'

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

function doisDigitos(n) {
    return (n < 10 ? '0' : '') + n;
}
// Iniciar processamento assim que a página carregar
window.addEventListener('load', async () => {

    // Elementos HTML
    const mainWrapper = document.querySelector('main')
    const selectEstados = document.getElementById('estados');
    const selectCidades = document.getElementById('cidades');
    const infoClima = document.getElementById('weather-wrapper');
    const iconeClima = document.getElementById('weatherIcon');
    const hora = document.getElementById('hora')
    const data = document.getElementById('data')

    let doisP = true // variável pra piscar o : no relógio 

    // Dados Estados
    const estados = await getApi('https://servicodados.ibge.gov.br/api/v1/localidades/estados');


    // Adiciona opções no select de estados
    estados.forEach(estado => {
        selectEstados.innerHTML += createOption(estado.id, estado.nome)
    });

    let clockUpdate = null;

    // Adiciona listener de eventos no select estado
    selectEstados.addEventListener('change', async function () {
        if (estados) {
            let estadoSelecionado = estados.find(estado => estado.id === Number(this.value)).nome
            if (this.value != 'none') {
                selectCidades.style.display = 'block'
            } else {
                selectCidades.style.display = 'none'
            }
            //Dados da API
            const cidades = await getApi(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${this.value}/municipios`);
            selectCidades.innerHTML = createOption('none', '-- Selecione uma cidade --')

            cidades.forEach(cidade => {
                selectCidades.innerHTML += createOption(cidade.id, cidade.nome)
            });

            // Adiciona listener de eventos no select cidades
            selectCidades.addEventListener('change', async function () {
                console.log(clockUpdate)
                let cidadeSelecionada = cidades.find(cidade => cidade.id === Number(this.value)).nome
                let weatherData = await getApi(`https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${estadoSelecionado}, ${cidadeSelecionada}&aqi=yes&lang=pt`)

                infoClima.style.display = 'flex';

                if (this.value != 'none' && !weatherData.error) {
                    document.getElementById('resposta').style.display = 'none'

                    let dataLocalEscolhido = new Date(weatherData.location.localtime)
                    // Ícone do clima
                    iconeClima.src = weatherData.current.condition.icon.replace('64x64', '128x128')
                    document.getElementById('temps').style.display = 'flex'
                    document.getElementById('temperatura').innerHTML = `${weatherData.current.temp_c}°C`
                    document.getElementById('sensacao').innerHTML = `Sensação de ${weatherData.current.feelslike_c}°C`
                    document.getElementById('addr-cidade').innerHTML = `${weatherData.location.name}`
                    document.getElementById('addr-estado').innerHTML = `${weatherData.location.region}, ${weatherData.location.country}`
                    document.getElementById('mensagem').innerHTML = `${weatherData.current.condition.text}`
                    if (clockUpdate) {
                        clearInterval(clockUpdate)
                        console.log('CLOCK UPDATE APAGADO')
                    }
                    clockUpdate = setInterval(() => {
                        doisP = !doisP
                        hora.innerHTML = `${doisDigitos(dataLocalEscolhido.getHours())}${doisP ? ' ' : ':'}${doisDigitos(dataLocalEscolhido.getMinutes())}`
                        data.innerHTML = `${doisDigitos(dataLocalEscolhido.getDate())}/${doisDigitos(dataLocalEscolhido.getMonth() + 1)}/${doisDigitos(dataLocalEscolhido.getFullYear())}`
                    }, 1000)
                    console.log('CLOCKUPDATE CONFIGURADO COM ', dataLocalEscolhido, " - ", clockUpdate)
                    // Muda a cor do wrapper dependendo da hora
                    if (dataLocalEscolhido.getHours() > 17) {
                        mainWrapper.classList.add('noite')
                    } else if (dataLocalEscolhido.getHours() > 15) {
                        mainWrapper.classList.add('tarde')
                    } else {
                        mainWrapper.classList.remove('tarde', 'noite')
                    }
                } else {
                    document.getElementById('resposta').style.display = 'flex'
                    document.getElementById('temps').style.display = 'none'
                }
            });
        }
    })

})
