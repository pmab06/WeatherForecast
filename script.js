import gerarTabela from "./gerarTabela.js";
import api_key from "./api_key.js";
import { createOption, getApi, doisDigitos } from "./tools.js";
// Códigos da API *weatherapi* que indicam chuva
const rainCodes = [
    1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195,
    1240, 1243, 1246, 1273, 1276, 1087, 1201, 1198, 1243, 1252,
];

// Iniciar processamento assim que a página carregar
window.addEventListener('load', async () => {

    let doisP = true
    let dataAtual = new Date()
    const dataHoraAt = document.getElementById('data-horaAt')


    dataHoraAt.innerHTML = `${doisDigitos(dataAtual.getHours())}${doisP ? ' ' : ':'}${doisDigitos(dataAtual.getMinutes())} • ${doisDigitos(dataAtual.getDate())}/${doisDigitos(dataAtual.getMonth() + 1)}/${dataAtual.getFullYear()}`

    let clockAtualUpdate = setInterval(() => {
        dataAtual = new Date()
        doisP = !doisP
        dataHoraAt.innerHTML = `${doisDigitos(dataAtual.getHours())}${doisP ? ' ' : ':'}${doisDigitos(dataAtual.getMinutes())} • ${doisDigitos(dataAtual.getDate())}/${doisDigitos(dataAtual.getMonth() + 1)}/${dataAtual.getFullYear()}`
    }, 1000)

    // Elementos HTML
    const mainWrapper = document.querySelector('main')
    const selectEstados = document.getElementById('estados');
    const selectCidades = document.getElementById('cidades');
    const infoClima = document.getElementById('weather-wrapper');
    const iconeClima = document.getElementById('weatherIcon');
    const hora = document.getElementById('hora')
    const data = document.getElementById('data')


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
                let cidadeSelecionada = cidades.find(cidade => cidade.id === Number(this.value)).nome
                let endereco = `${estadoSelecionado}, ${cidadeSelecionada}`
                let weatherData = await getApi(`https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${endereco}&aqi=yes&lang=pt`)
                console.log(JSON.stringify(weatherData))

                infoClima.style.display = 'flex';

                if (this.value != 'none' && !weatherData.error) {
                    document.getElementById('resposta').style.display = 'none'
                    let dataLocalEscolhido = new Date(weatherData.location.localtime) // data do local escolhido pelo usuario
                    iconeClima.src = weatherData.current.condition.icon.replace('64x64', '128x128') // api possui imagens 128x128 mas não retorna por padrão
                    // ========= adicionando os dados em todos os elementos
                    document.getElementById('temps').style.display = 'flex'
                    document.getElementById('temperatura').innerHTML = `${weatherData.current.temp_c}°C`
                    document.getElementById('sensacao').innerHTML = `Sensação de ${weatherData.current.feelslike_c}°C`
                    document.getElementById('addr-cidade').innerHTML = `${weatherData.location.name}`
                    document.getElementById('addr-estado').innerHTML = `${weatherData.location.region}, ${weatherData.location.country}`
                    document.getElementById('mensagem').innerHTML = `${weatherData.current.condition.text}`
                    // ========= qualidade do ar
                    document.getElementById('aq-wrapper').style.display = 'flex'
                    let textoAqi = null
                    document.getElementById('aqi').classList.remove('case1', 'case2', 'case3', 'case4', 'case5', 'case6')
                    switch (weatherData.current.air_quality["us-epa-index"]) {
                        case 1:
                            textoAqi = 'Boa'
                            break
                        case 2:
                            textoAqi = 'Moderada'
                            break
                        case 3:
                            textoAqi = 'Insalubre para grupos sensíveis'
                            break
                        case 4:
                            textoAqi = 'Insalubre'
                            break
                        case 5:
                            textoAqi = 'Muito Insalubre'
                            break
                        case 6:
                            textoAqi = 'Perigoso'
                            break
                        default:
                            textoAqi = 'Desconhecido'
                            break
                    }
                    document.getElementById('aqi').classList.add(`case${weatherData.current.air_quality["us-epa-index"]}`);
                    document.getElementById('aqi').innerHTML = `<b>${textoAqi}</b>`;
                    document.getElementById('co').innerHTML = `<b>CO</b> ${weatherData.current.air_quality.co} µg/m³`;
                    document.getElementById('o3').innerHTML = `<b>O₃</b> ${weatherData.current.air_quality.o3} µg/m³`;
                    document.getElementById('no2').innerHTML = `<b>NO₂</b> ${weatherData.current.air_quality.no2} µg/m³`;
                    document.getElementById('so2').innerHTML = `<b>SO₂</b> ${weatherData.current.air_quality.so2} µg/m³`;
                    document.getElementById('pm2_5').innerHTML = `<b>PM₂.₅</b> ${weatherData.current.air_quality.pm2_5} µg/m³`;
                    document.getElementById('pm10').innerHTML = `<b>PM₁₀</b> ${weatherData.current.air_quality.pm10} µg/m³`;

                    gerarTabela(endereco)
                    // =========
                    hora.innerHTML = `${doisDigitos(dataLocalEscolhido.getHours())}:${doisDigitos(dataLocalEscolhido.getMinutes())}`
                    data.innerHTML = `${doisDigitos(dataLocalEscolhido.getDate())}/${doisDigitos(dataLocalEscolhido.getMonth() + 1)}/${dataLocalEscolhido.getFullYear()}`
                    // ====

                    // ========= Muda a cor do wrapper dependendo da hora e do clima
                    // Está chovendo?
                    if (rainCodes.includes(weatherData.current.condition.code)) {
                        mainWrapper.classList.add('chuva')
                        mainWrapper.classList.remove('tarde', 'noite')
                    } else {
                        if (dataLocalEscolhido.getHours() > 17) {
                            mainWrapper.classList.add('noite')
                        } else if (dataLocalEscolhido.getHours() > 15) {
                            mainWrapper.classList.add('tarde')
                        } else {
                            mainWrapper.classList.remove('tarde', 'noite')
                        }
                    }
                } else {
                    // mostrar mensagem de erro
                    document.getElementById('resposta').style.display = 'flex'
                    document.getElementById('temps').style.display = 'none'
                    document.getElementById('aq-wrapper').style.display = 'none'
                }
            });
        }
    })

})
