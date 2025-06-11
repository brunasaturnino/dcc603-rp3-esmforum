const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

// … seus imports, beforeEach e testes existentes …

test('get_pergunta retorna o objeto de pergunta correto', () => {
  // cadastra uma pergunta e obtém o id
  const idPerg = modelo.cadastrar_pergunta('Qual é a cor do céu?');
  
  // get_pergunta deve retornar exatamente esse objeto
  const pergunta = modelo.get_pergunta(idPerg);
  expect(pergunta).toMatchObject({
    id_pergunta: idPerg,
    texto: 'Qual é a cor do céu?',
    id_usuario: 1
  });
});

test('get_respostas retorna todas as respostas cadastradas', () => {
  // prepara tudo
  const idPerg = modelo.cadastrar_pergunta('P?');
  const idRes1 = modelo.cadastrar_resposta(idPerg, 'Azul');
  const idRes2 = modelo.cadastrar_resposta(idPerg, 'Verde');

  // get_respostas deve trazer exatamente as duas
  const respostas = modelo.get_respostas(idPerg);
  expect(respostas).toHaveLength(2);
  expect(respostas[0]).toMatchObject({
    id_resposta: idRes1,
    id_pergunta: idPerg,
    texto: 'Azul'
  });
  expect(respostas[1]).toMatchObject({
    id_resposta: idRes2,
    id_pergunta: idPerg,
    texto: 'Verde'
  });
});

test('get_num_respostas retorna a contagem correta', () => {
  const idPerg = modelo.cadastrar_pergunta('P?');
  // insere 3 respostas
  modelo.cadastrar_resposta(idPerg, 'R1');
  modelo.cadastrar_resposta(idPerg, 'R2');
  modelo.cadastrar_resposta(idPerg, 'R3');

  // o contador deve ser exatamente 3
  const count = modelo.get_num_respostas(idPerg);
  expect(count).toBe(3);
});
