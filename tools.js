// Função simples para retornar uma opção em HTML (string)
function createOption(optionValue, optionText) {
    return `<option value="${optionValue}">${optionText}</option>`
}

async function salvarPDF(elemento,filename){
    const options = {
        margin: [10,10,10,10],
        filename: filename+".pdf",
        image: { type: 'png', quality: 1 },
        html2canvas: { scale: 1 },  
        jsPDF: {
            unit:'mm',
            format:'a4' ,
            orientation:'portrait',
        }
    }
    html2pdf().set(options).from(elemento).save()
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

export {createOption, getApi, doisDigitos, salvarPDF}