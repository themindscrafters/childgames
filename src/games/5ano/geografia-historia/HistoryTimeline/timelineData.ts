import type { Difficulty } from '../../../../data/models';

export interface HistoricalEvent {
  event: string;
  year: number;
  description: string;
  emoji: string;
  period: string;
}

export interface TimelineQuestion {
  question: string;
  options: string[];
  correct: string;
  relatedEvent?: string;
  hint?: string;
}

// ── Eventos históricos para a timeline visual ──────────────────────────
export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    event: 'Descobrimento do Brasil',
    year: 1500,
    description: 'Pedro Álvares Cabral chegou ao Brasil com sua frota portuguesa.',
    emoji: '⛵',
    period: 'Período Colonial',
  },
  {
    event: 'Chegada dos africanos escravizados',
    year: 1538,
    description: 'Os primeiros africanos escravizados chegaram ao Brasil para trabalhar nos engenhos de açúcar.',
    emoji: '⛓️',
    period: 'Período Colonial',
  },
  {
    event: 'Invasão Holandesa',
    year: 1630,
    description: 'Os holandeses invadiram o Nordeste do Brasil e ficaram por 24 anos.',
    emoji: '🏴',
    period: 'Período Colonial',
  },
  {
    event: 'Inconfidência Mineira',
    year: 1789,
    description: 'Movimento liderado por Tiradentes que lutou pela independência de Minas Gerais.',
    emoji: '🗽',
    period: 'Período Colonial',
  },
  {
    event: 'Chegada da Família Real',
    year: 1808,
    description: 'A família real portuguesa fugiu de Napoleão e veio morar no Brasil.',
    emoji: '👑',
    period: 'Período Colonial',
  },
  {
    event: 'Independência do Brasil',
    year: 1822,
    description: 'Dom Pedro I declarou a independência do Brasil às margens do rio Ipiranga.',
    emoji: '🇧🇷',
    period: 'Período Imperial',
  },
  {
    event: 'Abolição da Escravatura',
    year: 1888,
    description: 'A Princesa Isabel assinou a Lei Áurea, libertando todos os escravizados.',
    emoji: '✊',
    period: 'Período Imperial',
  },
  {
    event: 'Proclamação da República',
    year: 1889,
    description: 'Marechal Deodoro da Fonseca proclamou a República, acabando com a monarquia.',
    emoji: '🏛️',
    period: 'Período Republicano',
  },
  {
    event: 'Era Vargas',
    year: 1930,
    description: 'Getúlio Vargas assumiu o poder e governou o Brasil por muitos anos.',
    emoji: '🎩',
    period: 'Período Republicano',
  },
  {
    event: 'Inauguração de Brasília',
    year: 1960,
    description: 'Juscelino Kubitschek inaugurou Brasília como a nova capital do Brasil.',
    emoji: '🏗️',
    period: 'Período Republicano',
  },
];

// ── FÁCIL ──────────────────────────────────────────────────────────────
// Temas: eventos básicos, personagens, povos indígenas, africanos, formação do povo brasileiro
const EASY_QUESTIONS: TimelineQuestion[] = [
  // --- Linha do tempo básica ---
  { question: 'Em que ano o Brasil foi descoberto?', options: ['1500', '1822', '1888', '1889'], correct: '1500', relatedEvent: 'Descobrimento do Brasil', hint: 'Pedro Álvares Cabral chegou ao Brasil' },
  { question: 'O que aconteceu em 1822?', options: ['Independência do Brasil', 'Descobrimento do Brasil', 'Proclamação da República', 'Abolição da Escravatura'], correct: 'Independência do Brasil', relatedEvent: 'Independência do Brasil', hint: 'Dom Pedro I disse "Independência ou morte!"' },
  { question: 'O que aconteceu em 1888?', options: ['Abolição da Escravatura', 'Independência do Brasil', 'Descobrimento do Brasil', 'Proclamação da República'], correct: 'Abolição da Escravatura', relatedEvent: 'Abolição da Escravatura', hint: 'A Lei Áurea foi assinada' },
  { question: 'O que aconteceu em 1889?', options: ['Proclamação da República', 'Abolição da Escravatura', 'Independência do Brasil', 'Era Vargas'], correct: 'Proclamação da República', relatedEvent: 'Proclamação da República', hint: 'A monarquia acabou no Brasil' },
  { question: 'Quem descobriu o Brasil?', options: ['Pedro Álvares Cabral', 'Dom Pedro I', 'Tiradentes', 'Princesa Isabel'], correct: 'Pedro Álvares Cabral', relatedEvent: 'Descobrimento do Brasil' },
  { question: 'Quem declarou a independência do Brasil?', options: ['Dom Pedro I', 'Pedro Álvares Cabral', 'Tiradentes', 'Getúlio Vargas'], correct: 'Dom Pedro I', relatedEvent: 'Independência do Brasil' },
  { question: 'Quem assinou a Lei Áurea?', options: ['Princesa Isabel', 'Dom Pedro I', 'Pedro Álvares Cabral', 'Deodoro da Fonseca'], correct: 'Princesa Isabel', relatedEvent: 'Abolição da Escravatura' },
  { question: 'Qual é a capital do Brasil desde 1960?', options: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'], correct: 'Brasília', relatedEvent: 'Inauguração de Brasília' },
  { question: 'Em que ano Brasília foi inaugurada?', options: ['1960', '1950', '1970', '1930'], correct: '1960', relatedEvent: 'Inauguração de Brasília' },
  { question: 'O que a Lei Áurea fez?', options: ['Libertou os escravizados', 'Declarou a independência', 'Criou a República', 'Descobriu o Brasil'], correct: 'Libertou os escravizados', relatedEvent: 'Abolição da Escravatura' },
  { question: 'Em que ano começou a Era Vargas?', options: ['1930', '1960', '1822', '1500'], correct: '1930', relatedEvent: 'Era Vargas' },
  { question: 'Quem proclamou a República?', options: ['Marechal Deodoro da Fonseca', 'Dom Pedro I', 'Getúlio Vargas', 'Tiradentes'], correct: 'Marechal Deodoro da Fonseca', relatedEvent: 'Proclamação da República' },
  { question: 'De qual país Pedro Álvares Cabral veio?', options: ['Portugal', 'Espanha', 'Inglaterra', 'França'], correct: 'Portugal', relatedEvent: 'Descobrimento do Brasil' },
  { question: 'Quem foi Tiradentes?', options: ['Líder da Inconfidência Mineira', 'Primeiro presidente', 'Descobridor do Brasil', 'Último imperador'], correct: 'Líder da Inconfidência Mineira', relatedEvent: 'Inconfidência Mineira' },

  // --- Povos indígenas ---
  { question: 'Quem já vivia no Brasil antes da chegada dos portugueses?', options: ['Os povos indígenas', 'Os africanos', 'Os holandeses', 'Os espanhóis'], correct: 'Os povos indígenas', hint: 'Eles são os primeiros habitantes do Brasil' },
  { question: 'Os povos indígenas são considerados os...', options: ['Primeiros habitantes do Brasil', 'Descobridores do Brasil', 'Colonizadores do Brasil', 'Imperadores do Brasil'], correct: 'Primeiros habitantes do Brasil' },
  { question: 'Qual alimento de origem indígena faz parte da culinária brasileira?', options: ['Mandioca', 'Trigo', 'Arroz', 'Batata inglesa'], correct: 'Mandioca', hint: 'É usada para fazer farinha, tapioca e beiju' },
  { question: 'Qual costume herdamos dos povos indígenas?', options: ['Tomar banho todos os dias', 'Usar gravata', 'Comer com garfo e faca', 'Dormir em camas'], correct: 'Tomar banho todos os dias', hint: 'Os europeus não tinham esse hábito na época' },
  { question: 'Os povos indígenas viviam em aldeias chamadas de...', options: ['Tabas ou aldeias', 'Cidades', 'Vilas', 'Metrópoles'], correct: 'Tabas ou aldeias' },

  // --- Povos africanos ---
  { question: 'Os africanos foram trazidos ao Brasil para serem...', options: ['Escravizados', 'Turistas', 'Exploradores', 'Comerciantes'], correct: 'Escravizados', relatedEvent: 'Chegada dos africanos escravizados' },
  { question: 'Qual ritmo musical brasileiro tem origem africana?', options: ['Samba', 'Valsa', 'Polca', 'Rock'], correct: 'Samba', hint: 'É o ritmo mais famoso do carnaval' },
  { question: 'A capoeira é uma manifestação cultural de origem...', options: ['Africana', 'Indígena', 'Portuguesa', 'Holandesa'], correct: 'Africana', hint: 'Mistura luta, dança e música' },
  { question: 'Qual palavra do dia a dia tem origem africana?', options: ['Cafuné', 'Abacaxi', 'Jacaré', 'Pipoca'], correct: 'Cafuné', hint: 'Significa carinho na cabeça' },

  // --- Formação do povo brasileiro ---
  { question: 'O povo brasileiro se formou da mistura de quais povos?', options: ['Indígenas, africanos e europeus', 'Apenas europeus', 'Apenas indígenas', 'Apenas africanos'], correct: 'Indígenas, africanos e europeus', hint: 'Três grandes grupos formaram nosso povo' },
  { question: 'Os portugueses vieram ao Brasil para...', options: ['Colonizar e explorar riquezas', 'Visitar os indígenas', 'Fugir da guerra', 'Estudar a natureza'], correct: 'Colonizar e explorar riquezas' },
  { question: 'O pau-brasil era usado pelos portugueses para fazer...', options: ['Tinta vermelha para tecidos', 'Casas de madeira', 'Barcos', 'Papel'], correct: 'Tinta vermelha para tecidos', hint: 'O nome do nosso país vem dessa árvore!' },

  // --- Patrimônio e cidadania ---
  { question: 'O que é patrimônio cultural?', options: ['Tudo que tem valor para a cultura de um povo', 'Apenas prédios antigos', 'Dinheiro guardado', 'Terras do governo'], correct: 'Tudo que tem valor para a cultura de um povo', hint: 'Inclui festas, comidas, músicas e lugares históricos' },
  { question: 'Cidadania significa ter...', options: ['Direitos e deveres na sociedade', 'Muito dinheiro', 'Uma casa grande', 'Um carro novo'], correct: 'Direitos e deveres na sociedade', hint: 'Todo cidadão tem direitos, mas também responsabilidades' },
];

// ── MÉDIO ──────────────────────────────────────────────────────────────
// Temas: cronologia, séculos, herança cultural, cidadania, direitos, religiões
const MEDIUM_QUESTIONS: TimelineQuestion[] = [
  // --- Cronologia comparativa ---
  { question: 'O que veio primeiro: Independência ou Abolição?', options: ['Independência', 'Abolição'], correct: 'Independência', hint: 'A Independência foi 66 anos antes' },
  { question: 'O que veio primeiro: Descobrimento ou Inconfidência Mineira?', options: ['Descobrimento', 'Inconfidência Mineira'], correct: 'Descobrimento' },
  { question: 'O que veio primeiro: Abolição ou Proclamação da República?', options: ['Abolição', 'Proclamação da República'], correct: 'Abolição', hint: 'Aconteceram com apenas 1 ano de diferença!' },
  { question: 'O que veio primeiro: Era Vargas ou Inauguração de Brasília?', options: ['Era Vargas', 'Inauguração de Brasília'], correct: 'Era Vargas' },
  { question: 'Em que século o Brasil foi descoberto?', options: ['Século XVI', 'Século XV', 'Século XVII', 'Século XIX'], correct: 'Século XVI', relatedEvent: 'Descobrimento do Brasil', hint: '1500 pertence ao século XVI' },
  { question: 'A Independência do Brasil aconteceu em que século?', options: ['Século XIX', 'Século XVIII', 'Século XX', 'Século XVI'], correct: 'Século XIX', relatedEvent: 'Independência do Brasil' },
  { question: 'Qual evento está relacionado a Tiradentes?', options: ['Inconfidência Mineira', 'Independência do Brasil', 'Proclamação da República', 'Abolição da Escravatura'], correct: 'Inconfidência Mineira', relatedEvent: 'Inconfidência Mineira' },
  { question: 'Por que a família real portuguesa veio ao Brasil?', options: ['Fugindo de Napoleão', 'Para descobrir ouro', 'Para fundar Brasília', 'Para abolir a escravatura'], correct: 'Fugindo de Napoleão', relatedEvent: 'Chegada da Família Real' },
  { question: 'Os holandeses invadiram qual região do Brasil?', options: ['Nordeste', 'Sudeste', 'Sul', 'Norte'], correct: 'Nordeste', relatedEvent: 'Invasão Holandesa' },
  { question: 'Quem construiu Brasília?', options: ['Juscelino Kubitschek', 'Getúlio Vargas', 'Dom Pedro II', 'Marechal Deodoro'], correct: 'Juscelino Kubitschek', relatedEvent: 'Inauguração de Brasília' },
  { question: 'Qual era o sistema de governo antes da República?', options: ['Monarquia', 'Democracia', 'Ditadura', 'Parlamentarismo'], correct: 'Monarquia' },
  { question: 'Onde Dom Pedro I declarou a independência?', options: ['Às margens do rio Ipiranga', 'No Rio de Janeiro', 'Em Brasília', 'Em Salvador'], correct: 'Às margens do rio Ipiranga', relatedEvent: 'Independência do Brasil' },
  { question: 'Quantos anos o Brasil foi colônia de Portugal (aproximadamente)?', options: ['322 anos', '100 anos', '500 anos', '50 anos'], correct: '322 anos', hint: 'De 1500 até 1822' },
  { question: 'Para que os africanos escravizados foram trazidos ao Brasil?', options: ['Para trabalhar nos engenhos de açúcar', 'Para explorar ouro', 'Para construir Brasília', 'Para lutar guerras'], correct: 'Para trabalhar nos engenhos de açúcar', relatedEvent: 'Chegada dos africanos escravizados' },
  { question: 'A Proclamação da República acabou com o quê?', options: ['A monarquia no Brasil', 'A escravatura', 'O período colonial', 'A Era Vargas'], correct: 'A monarquia no Brasil', relatedEvent: 'Proclamação da República' },

  // --- Povos indígenas (aprofundado) ---
  { question: 'O que os indígenas ensinaram aos portugueses sobre a terra?', options: ['A cultivar mandioca, milho e amendoim', 'A construir castelos', 'A fabricar armas de fogo', 'A navegar pelo oceano'], correct: 'A cultivar mandioca, milho e amendoim', hint: 'Alimentos nativos que já eram cultivados pelos indígenas' },
  { question: 'Qual objeto indígena é usado até hoje no Brasil?', options: ['Rede de dormir', 'Espada', 'Roda de fiar', 'Arado'], correct: 'Rede de dormir', hint: 'Muitos brasileiros dormem nela até hoje!' },
  { question: 'Como os indígenas se comunicavam entre diferentes tribos?', options: ['Cada povo tinha sua própria língua', 'Todos falavam português', 'Usavam telefone', 'Escreviam cartas'], correct: 'Cada povo tinha sua própria língua', hint: 'Existiam centenas de línguas indígenas no Brasil' },
  { question: 'Palavras como "jacaré", "abacaxi" e "pipoca" vêm de qual língua?', options: ['Tupi (indígena)', 'Português', 'Africana', 'Espanhol'], correct: 'Tupi (indígena)', hint: 'O tupi era a língua de muitos povos indígenas do litoral' },

  // --- Herança africana (aprofundado) ---
  { question: 'Qual religião de origem africana faz parte da cultura brasileira?', options: ['Candomblé', 'Budismo', 'Hinduísmo', 'Protestantismo'], correct: 'Candomblé', hint: 'É praticada em terreiros no Brasil' },
  { question: 'O berimbau é um instrumento musical de origem...', options: ['Africana', 'Indígena', 'Europeia', 'Asiática'], correct: 'Africana', hint: 'É usado na capoeira' },
  { question: 'A feijoada, prato típico brasileiro, tem influência de qual povo?', options: ['Africano', 'Indígena', 'Holandês', 'Japonês'], correct: 'Africano', hint: 'Os escravizados aproveitavam as partes do porco que sobravam' },
  { question: 'O que é o Quilombo dos Palmares?', options: ['Um local de resistência dos africanos escravizados', 'Uma cidade portuguesa', 'Uma aldeia indígena', 'Um forte holandês'], correct: 'Um local de resistência dos africanos escravizados', hint: 'Zumbi dos Palmares foi seu líder mais famoso' },
  { question: 'Quem foi Zumbi dos Palmares?', options: ['Líder do maior quilombo do Brasil', 'Um imperador', 'Um navegador português', 'Um presidente da República'], correct: 'Líder do maior quilombo do Brasil', hint: 'Dia 20 de novembro é o Dia da Consciência Negra em sua homenagem' },

  // --- Cidadania e direitos ---
  { question: 'A Constituição é a lei mais importante de um país. A atual do Brasil é de que ano?', options: ['1988', '1500', '1822', '1960'], correct: '1988', hint: 'É chamada de "Constituição Cidadã"' },
  { question: 'Qual direito fundamental toda criança brasileira tem?', options: ['Direito à educação', 'Direito a um carro', 'Direito a um celular', 'Direito a viajar todo ano'], correct: 'Direito à educação', hint: 'Está garantido pela Constituição e pelo ECA' },
  { question: 'O ECA (Estatuto da Criança e do Adolescente) protege os direitos de quem?', options: ['Crianças e adolescentes', 'Apenas adultos', 'Apenas idosos', 'Animais'], correct: 'Crianças e adolescentes', hint: 'Foi criado em 1990' },
  { question: 'O que significa "democracia"?', options: ['O povo escolhe seus governantes', 'Um rei governa sozinho', 'Apenas os ricos decidem', 'Ninguém governa'], correct: 'O povo escolhe seus governantes', hint: 'A palavra vem do grego: "demo" (povo) + "cracia" (governo)' },

  // --- Patrimônio cultural ---
  { question: 'O Carnaval é um exemplo de patrimônio cultural...', options: ['Imaterial (não é um objeto físico)', 'Material (é um objeto físico)', 'Natural', 'Tecnológico'], correct: 'Imaterial (não é um objeto físico)', hint: 'Festas, danças e músicas são patrimônio imaterial' },
  { question: 'As ruínas de São Miguel das Missões no RS são patrimônio...', options: ['Material (construção histórica)', 'Imaterial', 'Natural', 'Particular'], correct: 'Material (construção histórica)', hint: 'Patrimônio material são construções, monumentos e objetos' },
];

// ── DIFÍCIL ────────────────────────────────────────────────────────────
// Temas: ordenação cronológica, análise de consequências, patrimônio, povos e formação, cidadania
const HARD_QUESTIONS: TimelineQuestion[] = [
  // --- Cronologia avançada ---
  { question: 'Coloque em ordem: Independência, Descobrimento, Abolição', options: ['Descobrimento → Independência → Abolição', 'Independência → Descobrimento → Abolição', 'Abolição → Independência → Descobrimento', 'Descobrimento → Abolição → Independência'], correct: 'Descobrimento → Independência → Abolição' },
  { question: 'Coloque em ordem: Proclamação da República, Era Vargas, Brasília', options: ['República → Vargas → Brasília', 'Vargas → República → Brasília', 'Brasília → Vargas → República', 'República → Brasília → Vargas'], correct: 'República → Vargas → Brasília' },
  { question: 'Coloque em ordem: Família Real, Inconfidência, Independência', options: ['Inconfidência → Família Real → Independência', 'Família Real → Inconfidência → Independência', 'Independência → Inconfidência → Família Real', 'Inconfidência → Independência → Família Real'], correct: 'Inconfidência → Família Real → Independência' },
  { question: 'Quantos anos separam a Abolição da Proclamação da República?', options: ['1 ano', '10 anos', '50 anos', '5 anos'], correct: '1 ano', hint: '1888 e 1889' },
  { question: 'Quantos anos separam o Descobrimento da Independência?', options: ['322 anos', '200 anos', '400 anos', '100 anos'], correct: '322 anos', hint: '1500 até 1822' },

  // --- Análise de consequências ---
  { question: 'A Inconfidência Mineira lutava por quê?', options: ['Pela independência de Minas Gerais e contra impostos abusivos', 'Pela abolição da escravatura', 'Pela proclamação da república', 'Pela construção de Brasília'], correct: 'Pela independência de Minas Gerais e contra impostos abusivos', relatedEvent: 'Inconfidência Mineira' },
  { question: 'Por que a chegada da família real foi importante?', options: ['Abriu os portos e trouxe desenvolvimento ao Brasil', 'Descobriu novas terras', 'Acabou com a escravatura', 'Proclamou a república'], correct: 'Abriu os portos e trouxe desenvolvimento ao Brasil', relatedEvent: 'Chegada da Família Real' },
  { question: 'Qual foi a consequência direta da Proclamação da República?', options: ['O Brasil deixou de ser uma monarquia', 'Os escravizados foram libertados', 'O Brasil ficou independente', 'Brasília foi construída'], correct: 'O Brasil deixou de ser uma monarquia', relatedEvent: 'Proclamação da República' },
  { question: 'Qual evento aconteceu entre 1822 e 1889?', options: ['Abolição da Escravatura (1888)', 'Descobrimento do Brasil', 'Era Vargas', 'Inauguração de Brasília'], correct: 'Abolição da Escravatura (1888)' },
  { question: 'A invasão holandesa aconteceu em qual período?', options: ['Período Colonial', 'Período Imperial', 'Período Republicano', 'Era Vargas'], correct: 'Período Colonial', relatedEvent: 'Invasão Holandesa' },
  { question: 'Qual capital do Brasil veio antes de Brasília?', options: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Recife'], correct: 'Rio de Janeiro', hint: 'Foi capital por muitos anos até 1960' },
  { question: 'Os holandeses ficaram no Brasil por aproximadamente quantos anos?', options: ['24 anos', '100 anos', '10 anos', '50 anos'], correct: '24 anos', relatedEvent: 'Invasão Holandesa', hint: 'De 1630 a 1654' },

  // --- Povos indígenas (análise) ---
  { question: 'O que aconteceu com a população indígena após a chegada dos portugueses?', options: ['Diminuiu muito por doenças e conflitos', 'Aumentou rapidamente', 'Ficou igual', 'Todos foram para Portugal'], correct: 'Diminuiu muito por doenças e conflitos', hint: 'Os europeus trouxeram doenças que os indígenas não conheciam' },
  { question: 'Por que muitos nomes de cidades brasileiras são de origem tupi?', options: ['Porque os indígenas já habitavam e nomeavam esses lugares', 'Porque os portugueses falavam tupi', 'Porque foi uma lei do governo', 'Porque o tupi é parecido com o português'], correct: 'Porque os indígenas já habitavam e nomeavam esses lugares', hint: 'Exemplos: Iguaçu, Itapema, Guanabara, Curitiba' },
  { question: 'Os povos indígenas tinham diferentes formas de medir o tempo. Eles usavam...', options: ['Ciclos da natureza como lua, chuvas e colheitas', 'Relógios de parede', 'Calendários de papel', 'Celulares'], correct: 'Ciclos da natureza como lua, chuvas e colheitas', hint: 'Cada povo tinha seu modo de observar a natureza' },

  // --- Herança africana (análise) ---
  { question: 'Por que os quilombos surgiram?', options: ['Como forma de resistência dos escravizados que fugiam', 'Para comércio de açúcar', 'Para construir cidades', 'Para receber a família real'], correct: 'Como forma de resistência dos escravizados que fugiam', hint: 'Os quilombos eram comunidades livres' },
  { question: 'Qual instrumento musical usado na capoeira é de origem africana?', options: ['Berimbau', 'Violão', 'Piano', 'Flauta doce'], correct: 'Berimbau' },
  { question: 'Qual contribuição africana está presente na alimentação brasileira?', options: ['Acarajé, vatapá e quiabo', 'Pizza e macarrão', 'Sushi e sashimi', 'Croissant e baguete'], correct: 'Acarajé, vatapá e quiabo', hint: 'São pratos típicos da Bahia' },
  { question: 'Após a abolição em 1888, os ex-escravizados receberam terras e apoio do governo?', options: ['Não, ficaram sem nenhum apoio', 'Sim, todos ganharam terras', 'Sim, receberam muito dinheiro', 'Sim, voltaram para a África'], correct: 'Não, ficaram sem nenhum apoio', hint: 'Essa falta de apoio gerou desigualdades que existem até hoje' },

  // --- Formação do povo e identidade ---
  { question: 'A formação cultural brasileira é resultado da mistura de culturas. Isso se chama...', options: ['Miscigenação e diversidade cultural', 'Colonização', 'Monarquia', 'Globalização'], correct: 'Miscigenação e diversidade cultural' },
  { question: 'Salvador foi a primeira capital do Brasil. Em que período?', options: ['Período Colonial', 'Período Imperial', 'Período Republicano', 'Era Vargas'], correct: 'Período Colonial', hint: 'Salvador foi capital de 1549 a 1763' },
  { question: 'Coloque em ordem as capitais do Brasil:', options: ['Salvador → Rio de Janeiro → Brasília', 'Rio de Janeiro → Salvador → Brasília', 'Brasília → Salvador → Rio de Janeiro', 'Salvador → Brasília → Rio de Janeiro'], correct: 'Salvador → Rio de Janeiro → Brasília' },

  // --- Cidadania e direitos (análise) ---
  { question: 'A conquista de direitos no Brasil foi um processo...', options: ['Longo, com muitas lutas ao longo dos séculos', 'Rápido e sem conflitos', 'Que aconteceu em um único dia', 'Que veio de outros países'], correct: 'Longo, com muitas lutas ao longo dos séculos', hint: 'Da escravidão até os direitos atuais foram séculos de luta' },
  { question: 'O dia 20 de novembro é celebrado como...', options: ['Dia da Consciência Negra', 'Dia da Independência', 'Dia do Descobrimento', 'Dia da República'], correct: 'Dia da Consciência Negra', hint: 'Homenageia Zumbi dos Palmares' },
  { question: 'O dia 19 de abril é dedicado a quem?', options: ['Aos povos indígenas', 'Aos africanos', 'Aos portugueses', 'Aos holandeses'], correct: 'Aos povos indígenas', hint: 'É o Dia dos Povos Indígenas' },
  { question: 'Verdadeiro ou Falso: A Abolição aconteceu antes da Independência.', options: ['Falso', 'Verdadeiro'], correct: 'Falso', hint: 'Independência: 1822, Abolição: 1888' },
  { question: 'Verdadeiro ou Falso: Getúlio Vargas governou antes da inauguração de Brasília.', options: ['Verdadeiro', 'Falso'], correct: 'Verdadeiro' },
  { question: 'Qual destes eventos pertence ao Período Imperial?', options: ['Abolição da Escravatura', 'Descobrimento do Brasil', 'Era Vargas', 'Invasão Holandesa'], correct: 'Abolição da Escravatura' },

  // --- Patrimônio cultural (análise) ---
  { question: 'A Festa de São João é patrimônio cultural de qual região?', options: ['Nordeste', 'Sul', 'Sudeste', 'Norte'], correct: 'Nordeste', hint: 'É a maior festa junina do Brasil' },
  { question: 'O frevo, patrimônio imaterial do Brasil, surgiu em qual cidade?', options: ['Recife', 'São Paulo', 'Brasília', 'Manaus'], correct: 'Recife', hint: 'É uma dança e música típica do carnaval pernambucano' },
  { question: 'As pinturas rupestres encontradas no Brasil são evidências de que...', options: ['Povos antigos já habitavam o território há milhares de anos', 'Os portugueses fizeram quando chegaram', 'Foram feitas pela natureza', 'São recentes, do século XX'], correct: 'Povos antigos já habitavam o território há milhares de anos', hint: 'As mais antigas têm mais de 10 mil anos!' },
];

export const QUESTIONS_BY_DIFFICULTY: Record<Difficulty, TimelineQuestion[]> = {
  easy: EASY_QUESTIONS,
  medium: MEDIUM_QUESTIONS,
  hard: HARD_QUESTIONS,
};

export function getQuestionsForDifficulty(difficulty: Difficulty, count: number): TimelineQuestion[] {
  const pool = [...QUESTIONS_BY_DIFFICULTY[difficulty]];
  const shuffled: TimelineQuestion[] = [];
  while (shuffled.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    shuffled.push(pool.splice(idx, 1)[0]);
  }
  return shuffled;
}

export function getEventByName(name: string): HistoricalEvent | undefined {
  return HISTORICAL_EVENTS.find((e) => e.event === name);
}
