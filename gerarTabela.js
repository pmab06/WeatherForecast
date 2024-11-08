import api_key from "./api_key.js";
import { getApi, doisDigitos } from "./tools.js";



const createTableRow = (values = [], type = 'data') => {
    const table_row = document.createElement('tr');

    values.map((v) => {
        const cell = type === 'header' ? document.createElement('th') : document.createElement('td');
        cell.innerHTML = v;
        table_row.appendChild(cell);
    })
    return table_row
}



const gerarTabela = async (endereco, elemento) => {
    if (endereco && elemento) {
        elemento.innerHTML = ''
        let weatherData = await getApi(`https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${endereco}&aqi=no&days=1&alerts=no&lang=pt`)
        const dia = weatherData.forecast.forecastday[0]
        const horas = dia.hour
        const table = document.createElement('table');

        let header_row = createTableRow([
            'Horário',
            'Condição',
            'Chuva',
            'Temperatura',
            'Sensação',
            'Umidade',
            'Vento'
        ],
            'header')
        elemento.appendChild(table)
        table.appendChild(header_row)

        let dt_h, new_row = null

        horas.map((hora) => {
            dt_h = new Date(hora.time)
            new_row = createTableRow([
                `${doisDigitos(dt_h.getHours())}:${doisDigitos(dt_h.getMinutes())}`,
                hora.condition.text,
                `${hora.chance_of_rain}%`,
                `${hora.temp_c}°C`,
                `${hora.feelslike_c}°C`,
                `${hora.humidity}%`,
                `${hora.wind_kph} km/h`,
            ])
            table.appendChild(new_row)
        });

    }
}
export default gerarTabela