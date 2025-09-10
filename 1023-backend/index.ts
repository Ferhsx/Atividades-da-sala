
// let variavel = 10
// let numero:number = 10
// let string:string = "Isso é uma string"
// const boleano = true //false
// const vetor:number[] = [1]
// let vetorString:string[] = []


// vetor.push(6)
// vetorString.push("teste")

// vetor.length

// let nomeMateria:string = "eu tenho"
// console.log(nomeMateria)

// const obj = {
//     nome: "teste",
//     idade: 10
// }

// //um vetor com 2 objetos de estudantes com idade, nome e cpf mostra console.log

// const VetorObj2Estudantes =[
//     { 
//             nome: "rfefw",
//             idade: 10,
//             cpf: "098.765.432-10"
//         },
//         {
//             nome: "fwee",
//             idade: 20,
//             cpf: "123.456.789-10"
//         }
// ]

// type PesssoaType = {
//     nome: string;
//     idade: number;
// }

// const objpessoa:PesssoaType = {
//     nome: "tere",
//     idade: 10
// }

// console.log(VetorObj2Estudantes)


// let numString:string|number = 10
// numString = "10";

// type TypeMaisDeUmTipo = {nome:string|number;}
// const objComMaisDeumTipo:TypeMaisDeUmTipo = {
//     nome:"guilherme"
// }

// function soma(a,b){
//     return a+b;
// }

// const resultado = soma(12,233)
// console.log (`Resultado é ${resultado}`)

// function somaB(a:number,b:number):number{
//     return a+b;
// }
//  const somaC = function(a:number,b:number):number|undefined{
//     return a+b;
//  }
//  const somaD = (a:number,b:number): number[]=>{
//     return [a+b];
// }

// const somaA = (a:number,b:number) => a+b;

// //crie uma função que receba um vetor de numeros e retorne a some os numeros do vetor

// //quando vetor for vazio retornar unferined

// function somaNumeros(){
//     let vetor = [1,2,3,4]
//     let resul = 0

//     if (vetor.length === 0){
//         return undefined
//     }

//     for (let i = 0; i < vetor.length; i++){
//         const ele = vetor[i]
//         resul = resul+ele
//     } 
//     return resul

// }
// console.log(somaNumeros())

// const vetor1=[1,2,3,4]

// //cria uma função que receba um vetor e um numero
// //sua função deve somar as numero do vetor elevado ao numero recivido por parametro

// //exemplo => somaEvento ([2,2,2],2) //12

// //se vetor nada devolva undefined

/* let vetor3 = [3,5,21,5,2]
let num = 5
function somaEvento(a,b){
    
    let soma1 = 0

    if(a.length === 0){
        return undefined
    }

    for (let i = 0; i < a.length; i++) {
        soma1 += Math.pow(a[i],b)
        
    }
    return soma1
}
console.log(somaEvento(vetor3,num))*/


//faça uma função q recebe 2 numeros e devolve em vetor da sequencia de numeros
//Ex (10,16) // [10,11,12,13,14,15,16]

/*
function sequenciaN (c,d){
    let inicio = c<d ? c : d;
    let fim = c<d ? d : c;
    let vetor:number []= [];

    for (let i = inicio; i<=fim; i++){
        vetor.push(i);
    }
    return vetor
}
console.log(sequenciaN(1,5))
*/

/*
const vetor = [1,2,3,4,5]
function predicado(a){
    if(a == 3){
        return true
    }else{
        return false
    }
}
console.log (vetor.find(predicado))
*/

/*
assincronidade -> caraceteristica
tbm do javascript
não executar as linhas de codigo
*/
//promises
/*function demora (){
    const pro = new Promise((resolve, reject) => {
        setTimeout(()=> {
            if(Math.random()> .5){
                resolve ("demorou")
            }else{
                reject ("deu erro")
            }
             
        },1000)
    })
    return pro
}
console.log("antes da demora")

//then/catch
const resultado = demora()
resultado.then((dados)=>{
    console.log("Resultado Promessa: "+dados)
})
.catch((erro)=>{
    console.log(erro)
})

console.log("executou isso")

//async/await

async function aux(){
    try{
        const resultado = await demora()
        console.log("dados apos o await"+resultado)
    }
    catch(erro){
        console.log("Erro no try/catch"+erro)
    }
}
*/
import mysql, { Connection, ConnectionOptions , QueryError } from 'mysql2/promise';
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'

const app = fastify()
app.register(cors)

app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.send("Fastify Funcionando!")
})
app.get("/estudantes", async (request: FastifyRequest, reply: FastifyReply) => {

    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'banco1023b',
            port: 3306
        });
        const resultado = await conn.query("SELECT * FROM estudantes")
        const [dados,estruturaTabela] = resultado
        reply.status(200).send(dados)
        
    } catch (erro:any) {
        if (erro.code === "ECONNREFUSED") {
            console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!")
            reply.status(400).send({mensagem:"ERRO: LIGUE O LARAGÃO!!! CABEÇA!"})
        } else if (erro.code === "ER_BAD_DB_ERROR") {
            console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO"})
        } else if (erro.code === "ER_ACCESS_DENIED_ERROR") {
            console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO"})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem:"ERRO DESCONHECIDO OLHE O TERMINAL"})
        }
    }
})

app.post("/estudantes", async (request: FastifyRequest, reply: FastifyReply) => {
    const {id, nome} = request.body as any;


    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'banco1023b',
            port: 3306
        });
        const resultado = await conn.query("insert into estudantes (id, nome) values (?,?)", [id,nome])
        const [dados,estruturaTabela] = resultado
        reply.status(200).send(dados)
        
    } catch (erro:any) {
       switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGÃO!!! CABEÇA!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO" });
                break;
            case "ER_DUP_ENTRY":
                console.log("ERRO: ID DUPLICADO");
                reply.status(400).send({ mensagem: "ERRO: ID DUPLICADO" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "ERRO DESCONHECIDO OLHE O TERMINAL" });
                break;
        }
    }
})
app.listen({ port: 8000 }, (erro, endereco) => {
    if (erro) {
        console.log("ERRO: Fastify não iniciou")
    }
    console.log(`Fastify iniciado na porta: ${endereco}`)
})
//estou vendo vc me ver...