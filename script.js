document.addEventListener('DOMContentLoaded', function () {
    atualizarCamposTraseiros();
});

document.getElementById('toggleTraseiro').addEventListener('change', atualizarCamposTraseiros);

function atualizarCamposTraseiros() {
    const usarTraseiro = document.getElementById('toggleTraseiro').checked;
    const camposTraseiros = document.getElementById('camposTraseira');

    if (usarTraseiro) {
        camposTraseiros.style.display = 'block';
    } else {
        camposTraseiros.style.display = 'none';
    }
}

function formula(max, min, peso) {
    return (max - min) * peso + min;
}

function ajustesTunagem() {
    const pesoFrontalInt = document.getElementById('pesoFrontal').value;
    const pesoFrontal = parseFloat(pesoFrontalInt) / 100;
    const pesoTraseiro = parseFloat(100 - pesoFrontalInt) / 100;

    const retornoDianteiraMin = parseFloat(document.getElementById('retornoDianteiraMin').value);
    const retornoDianteiraMax = parseFloat(document.getElementById('retornoDianteiraMax').value);
    const retornoTraseiraMin = document.getElementById('toggleTraseiro').checked
        ? parseFloat(document.getElementById('retornoTraseiraMin').value)
        : retornoDianteiraMin;
    const retornoTraseiraMax = document.getElementById('toggleTraseiro').checked
        ? parseFloat(document.getElementById('retornoTraseiraMax').value)
        : retornoDianteiraMax;

    const compressaoPct = parseFloat(document.getElementById('compressao').value) / 100;

    const barraDianteiraMin = parseFloat(document.getElementById('barraDianteiraMin').value);
    const barraDianteiraMax = parseFloat(document.getElementById('barraDianteiraMax').value);
    const barraTraseiraMin = document.getElementById('toggleTraseiro').checked
        ? parseFloat(document.getElementById('barraTraseiraMin').value)
        : barraDianteiraMin;
    const barraTraseiraMax = document.getElementById('toggleTraseiro').checked
        ? parseFloat(document.getElementById('barraTraseiraMax').value)
        : barraDianteiraMax;

    const molaDianteiraMin = parseFloat(document.getElementById('molaDianteiraMin').value);
    const molaDianteiraMax = parseFloat(document.getElementById('molaDianteiraMax').value);
    const molaTraseiraMin = document.getElementById('toggleTraseiro').checked
        ? parseFloat(document.getElementById('molaTraseiraMin').value)
        : molaDianteiraMin;
    const molaTraseiraMax = document.getElementById('toggleTraseiro').checked
        ? parseFloat(document.getElementById('molaTraseiraMax').value)
        : molaDianteiraMax;

    const rigidezRetornoDianteira = formula(retornoDianteiraMax, retornoDianteiraMin, pesoFrontal);
    const rigidezRetornoTraseira = formula(retornoTraseiraMax, retornoTraseiraMin, pesoTraseiro);

    const rigidezCompressaoDianteira = rigidezRetornoDianteira * compressaoPct;
    const rigidezCompressaoTraseira = rigidezRetornoTraseira * compressaoPct;

    const barraEstabilizadoraDianteira = formula(barraDianteiraMax, barraDianteiraMin, pesoFrontal);
    const barraEstabilizadoraTraseira = formula(barraTraseiraMax, barraTraseiraMin, pesoTraseiro);

    const molasDianteiras = formula(molaDianteiraMax, molaDianteiraMin, pesoFrontal);
    const molasTraseiras = formula(molaTraseiraMax, molaTraseiraMin, pesoTraseiro);

    const resultado = `
        <p>Rigidez de Retorno Dianteira: <strong>${rigidezRetornoDianteira.toFixed(2)}</strong></p>
        <p>Rigidez de Retorno Traseira: <strong>${rigidezRetornoTraseira.toFixed(2)}</strong></p>
        <p>Rigidez de Compressão Dianteira: <strong>${rigidezCompressaoDianteira.toFixed(2)}</strong></p>
        <p>Rigidez de Compressão Traseira: <strong>${rigidezCompressaoTraseira.toFixed(2)}</strong></p>
        <p>Barras Estabilizadoras Dianteira: <strong>${barraEstabilizadoraDianteira.toFixed(2)}</strong></p>
        <p>Barras Estabilizadoras Traseira: <strong>${barraEstabilizadoraTraseira.toFixed(2)}</strong></p>
        <p>Molas Dianteiras: <strong>${molasDianteiras.toFixed(2)}</strong></p>
        <p>Molas Traseiras: <strong>${molasTraseiras.toFixed(2)}</strong></p>
    `;

    document.getElementById('resultados').innerHTML = resultado;

    document.getElementById('resultadosModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('resultadosModal').classList.add('hidden');
}