document.getElementById('botao').addEventListener ('click', function(){
    DOM.style.color= 'red';
    
});

function adicionarLinha() {

    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const cidade = document.getElementById('cidade').value;

    const tableBody = document.getElementById('table-body');

    const newRow = tableBody.insertRow();

    newRow.insertCell(0).innerText = nome;
    newRow.insertCell(1).innerText = idade;
    newRow.insertCell(2).innerText = cidade;
};
function adicionarTere(){

    const tableBody = document.getElementById('table-body');

    const newRow = tableBody.insertRow();

    newRow.insertCell(0).innerText = "Tere";
    newRow.insertCell(1).innerText = "29";
    newRow.insertCell(2).innerText = "Naviraí";
}
