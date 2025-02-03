function formula(max, min, peso) {
    return (max - min) * peso + min;
}

function ajustesTunagem() {
    const pesoFrontalInt = document.getElementById('pesoFrontal').value;
    const pesoFrontal = parseFloat(pesoFrontalInt) / 100;
    const pesoTraseiro = parseFloat(100 - pesoFrontalInt) / 100;

    console.log(pesoFrontalInt)
    console.log(pesoFrontal)
    console.log(pesoTraseiro)
    
    const retornoDianteiraMin = parseFloat(document.getElementById('retornoDianteiraMin').value);
    const retornoDianteiraMax = parseFloat(document.getElementById('retornoDianteiraMax').value);
    const retornoTraseiraMin = parseFloat(document.getElementById('retornoTraseiraMin').value);
    const retornoTraseiraMax = parseFloat(document.getElementById('retornoTraseiraMax').value);

    const compressaoPct = parseFloat(document.getElementById('compressao').value) / 100;

    const barraDianteiraMin = parseFloat(document.getElementById('barraDianteiraMin').value);
    const barraDianteiraMax = parseFloat(document.getElementById('barraDianteiraMax').value);
    const barraTraseiraMin = parseFloat(document.getElementById('barraTraseiraMin').value);
    const barraTraseiraMax = parseFloat(document.getElementById('barraTraseiraMax').value);

    const molaDianteiraMin = parseFloat(document.getElementById('molaDianteiraMin').value);
    const molaDianteiraMax = parseFloat(document.getElementById('molaDianteiraMax').value);
    const molaTraseiraMin = parseFloat(document.getElementById('molaTraseiraMin').value);
    const molaTraseiraMax = parseFloat(document.getElementById('molaTraseiraMax').value);

    if (isNaN(pesoFrontal) || isNaN(retornoDianteiraMin) || isNaN(retornoDianteiraMax) || isNaN(compressaoPct)) {
        document.getElementById('resultados').innerHTML = '<p class="text-red-500">Preencha todos os campos corretamente.</p>';
        return;
    }
    
    const rigidezRetornoDianteira = formula(retornoDianteiraMax, retornoDianteiraMin, pesoFrontal);
    const rigidezRetornoTraseira = formula(retornoTraseiraMax, retornoTraseiraMin, pesoTraseiro);

    const rigidezCompressaoDianteira = rigidezRetornoDianteira * compressaoPct;
    const rigidezCompressaoTraseira = rigidezRetornoTraseira * compressaoPct;

    const barraEstabilizadoraDianteira = formula(barraDianteiraMax, barraDianteiraMin, pesoFrontal);
    const barraEstabilizadoraTraseira = formula(barraTraseiraMax, barraTraseiraMin, pesoTraseiro);
    
    const molasDianteiras = formula(molaDianteiraMax, molaDianteiraMin, pesoFrontal);
    const molasTraseiras = formula(molaTraseiraMax, molaTraseiraMin, pesoTraseiro);
    
    document.getElementById('resultados').innerHTML = `
        <p>Rigidez de Retorno Dianteira: <strong>${rigidezRetornoDianteira.toFixed(2)}</strong></p>
        <p>Rigidez de Retorno Traseira: <strong>${rigidezRetornoTraseira.toFixed(2)}</strong></p>
        <p>Rigidez de Compressão Dianteira: <strong>${rigidezCompressaoDianteira.toFixed(2)}</strong></p>
        <p>Rigidez de Compressão Traseira: <strong>${rigidezCompressaoTraseira.toFixed(2)}</strong></p>
        <p>Barras Estabilizadoras Dianteira: <strong>${barraEstabilizadoraDianteira.toFixed(2)}</strong></p>
        <p>Barras Estabilizadoras Traseira: <strong>${barraEstabilizadoraTraseira.toFixed(2)}</strong></p>
        <p>Molas Dianteiras: <strong>${molasDianteiras.toFixed(2)}</strong></p>
        <p>Molas Traseiras: <strong>${molasTraseiras.toFixed(2)}</strong></p>
    `;
}