import api_key from "./api_key.js";
import { getApi } from "./tools.js";

const gerarTabela = async (endereco) => {
    let weatherData = await getApi(`https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${endereco}&aqi=no&days=1&alerts=no&lang=pt`)
    console.log(weatherData)
    const dia = weatherData.forecast.forecastday[0]
    const horas = dia.hour

    const table = document.createElement('table')
    const table_row = document.createElement('tr')
    const table_header = document.createElement('th')
    const table_data = document.createElement('td')

    
    
    horas.map((x) => {console.log(x)})
}   
export default gerarTabela