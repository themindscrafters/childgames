export interface TextQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  type: 'literal' | 'inference' | 'vocabulary';
}

export interface TextPassage {
  title: string;
  passage: string;
  questions: TextQuestion[];
}

export const EASY_PASSAGES: TextPassage[] = [
  {
    title: 'O Boto-Rosa',
    passage:
      'O boto-rosa e um golfinho que vive nos rios da Amazonia. Ele e um dos poucos golfinhos de agua doce do mundo. Segundo a lenda, o boto se transforma em um homem bonito durante as festas juninas.',
    questions: [
      {
        question: 'Onde vive o boto-rosa?',
        options: ['Nos rios da Amazonia', 'No oceano Atlantico', 'Nas lagoas do Sul', 'No mar do Nordeste'],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'O que o boto faz segundo a lenda?',
        options: [
          'Transforma-se em homem bonito',
          'Canta musicas bonitas',
          'Voa durante a noite',
          'Brilha no escuro',
        ],
        correctIndex: 0,
        type: 'literal',
      },
    ],
  },
  {
    title: 'O Cachorro Fiel',
    passage:
      'Rex era um cachorro muito fiel ao seu dono, Pedro. Todos os dias, Rex esperava Pedro voltar da escola na porta de casa. Quando Pedro chegava, Rex abanava o rabo e pulava de alegria.',
    questions: [
      {
        question: 'Quem era o dono de Rex?',
        options: ['Pedro', 'Joao', 'Carlos', 'Lucas'],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'O que Rex fazia quando Pedro chegava?',
        options: [
          'Abanava o rabo e pulava',
          'Dormia no sofa',
          'Saia correndo para a rua',
          'Latia com raiva',
        ],
        correctIndex: 0,
        type: 'literal',
      },
    ],
  },
  {
    title: 'A Chuva na Floresta',
    passage:
      'Na floresta tropical, chove quase todos os dias. A chuva e muito importante para as plantas e os animais. Sem a chuva, as arvores nao cresceriam e os rios ficariam secos.',
    questions: [
      {
        question: 'Com que frequencia chove na floresta tropical?',
        options: ['Quase todos os dias', 'Uma vez por mes', 'Somente no verao', 'Nunca chove'],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'O que aconteceria sem a chuva?',
        options: [
          'As arvores nao cresceriam',
          'Os animais ficariam felizes',
          'A floresta ficaria maior',
          'Nada mudaria',
        ],
        correctIndex: 0,
        type: 'literal',
      },
    ],
  },
  {
    title: 'O Futebol no Recreio',
    passage:
      'Na hora do recreio, as criancas adoram jogar futebol no patio da escola. Cada time tem cinco jogadores. O jogo dura ate o sinal tocar para voltar a aula.',
    questions: [
      {
        question: 'Onde as criancas jogam futebol?',
        options: ['No patio da escola', 'No estadio', 'Na praia', 'No parque'],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'Quantos jogadores tem cada time?',
        options: ['Cinco', 'Onze', 'Tres', 'Sete'],
        correctIndex: 0,
        type: 'literal',
      },
    ],
  },
  {
    title: 'As Borboletas',
    passage:
      'As borboletas nascem como lagartas pequenas. Depois de comer muitas folhas, a lagarta faz um casulo. Dentro do casulo, ela se transforma em uma borboleta colorida.',
    questions: [
      {
        question: 'Como as borboletas nascem?',
        options: ['Como lagartas', 'Como ovos voadores', 'Ja como borboletas', 'Como formigas'],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'O que a lagarta faz antes de virar borboleta?',
        options: [
          'Faz um casulo',
          'Aprende a voar',
          'Pinta suas asas',
          'Nada no rio',
        ],
        correctIndex: 0,
        type: 'literal',
      },
    ],
  },
  {
    title: 'O Papagaio Tagarela',
    passage:
      'O papagaio Louro vivia na casa da vovo Maria. Ele sabia falar muitas palavras e adorava repetir o que as pessoas diziam. Sua frase favorita era "Bom dia, bonito!".',
    questions: [
      {
        question: 'Onde vivia o papagaio Louro?',
        options: ['Na casa da vovo Maria', 'Na floresta', 'No zoologico', 'Na escola'],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'Qual era a frase favorita do Louro?',
        options: ['"Bom dia, bonito!"', '"Boa noite!"', '"Eu quero comer!"', '"Vamos brincar!"'],
        correctIndex: 0,
        type: 'literal',
      },
    ],
  },
  {
    title: 'A Horta da Escola',
    passage:
      'Os alunos do quinto ano plantaram uma horta na escola. Eles plantaram tomates, alface e cenoura. Todos os dias, os alunos regavam as plantas e tiravam as ervas daninhas.',
    questions: [
      {
        question: 'O que os alunos plantaram na horta?',
        options: [
          'Tomates, alface e cenoura',
          'Flores e rosas',
          'Arvores frutiferas',
          'Milho e feijao',
        ],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'O que os alunos faziam todos os dias?',
        options: [
          'Regavam as plantas',
          'Colhiam os frutos',
          'Brincavam na horta',
          'Desenhavam as plantas',
        ],
        correctIndex: 0,
        type: 'literal',
      },
    ],
  },
];

export const MEDIUM_PASSAGES: TextPassage[] = [
  {
    title: 'O Cerrado Brasileiro',
    passage:
      'O Cerrado e o segundo maior bioma do Brasil, ocupando quase um quarto do territorio nacional. Ele e conhecido como a "savana brasileira" por ter arvores baixas e retorcidas. Apesar de parecer seco, o Cerrado tem muitas nascentes de rios importantes. Infelizmente, grande parte do Cerrado ja foi desmatada para a agricultura.',
    questions: [
      {
        question: 'Por que o Cerrado e chamado de "savana brasileira"?',
        options: [
          'Por ter arvores baixas e retorcidas',
          'Por ser muito quente',
          'Por ter muitos animais selvagens',
          'Por ficar no centro do Brasil',
        ],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'O que podemos concluir sobre a importancia do Cerrado para os rios?',
        options: [
          'O Cerrado e importante porque tem nascentes de rios',
          'O Cerrado nao tem relacao com os rios',
          'Os rios do Cerrado estao todos secos',
          'O Cerrado so tem rios pequenos',
        ],
        correctIndex: 0,
        type: 'inference',
      },
    ],
  },
  {
    title: 'A Festa Junina',
    passage:
      'As festas juninas sao comemoradas em junho e julho no Brasil. Elas homenageiam santos catolicos como Santo Antonio, Sao Joao e Sao Pedro. Nessas festas, as pessoas dancam quadrilha, comem milho cozido, pipoca e canjica. As festas juninas sao mais tradicionais na regiao Nordeste, onde acontecem grandes festivais.',
    questions: [
      {
        question: 'Quais santos sao homenageados nas festas juninas?',
        options: [
          'Santo Antonio, Sao Joao e Sao Pedro',
          'Sao Francisco e Santa Clara',
          'Nossa Senhora e Sao Jorge',
          'Sao Paulo e Sao Lucas',
        ],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'Por que o texto diz que as festas juninas sao mais tradicionais no Nordeste?',
        options: [
          'Porque la acontecem grandes festivais',
          'Porque so existe festa junina no Nordeste',
          'Porque o Nordeste e mais frio',
          'Porque no Nordeste nao chove em junho',
        ],
        correctIndex: 0,
        type: 'inference',
      },
    ],
  },
  {
    title: 'A Agua no Planeta',
    passage:
      'Cerca de 70% da superficie da Terra e coberta por agua. Porem, apenas 3% dessa agua e doce, e a maior parte esta congelada nas geleiras. A agua potavel, que podemos beber, e ainda mais rara. Por isso, e muito importante economizar agua e nao polui-la.',
    questions: [
      {
        question: 'Qual porcentagem da agua da Terra e doce?',
        options: ['3%', '70%', '50%', '30%'],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'Por que devemos economizar agua segundo o texto?',
        options: [
          'Porque a agua potavel e muito rara',
          'Porque a agua vai acabar amanha',
          'Porque agua e cara',
          'Porque so existe agua no Brasil',
        ],
        correctIndex: 0,
        type: 'inference',
      },
    ],
  },
  {
    title: 'Os Dinossauros',
    passage:
      'Os dinossauros viveram na Terra ha milhoes de anos. Existiam dinossauros de todos os tamanhos: alguns eram pequenos como galinhas, outros eram enormes como predios. Os cientistas estudam os fosseis para descobrir como os dinossauros viviam. Um asteroide gigante pode ter causado a extincao dos dinossauros ha cerca de 65 milhoes de anos.',
    questions: [
      {
        question: 'Como os cientistas estudam os dinossauros?',
        options: [
          'Estudando fosseis',
          'Observando-os na natureza',
          'Lendo livros antigos',
          'Visitando zoologicos',
        ],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'O que podemos entender sobre o tamanho dos dinossauros?',
        options: [
          'Havia grande variedade de tamanhos',
          'Todos eram gigantes',
          'Todos eram pequenos',
          'Todos tinham o mesmo tamanho',
        ],
        correctIndex: 0,
        type: 'inference',
      },
    ],
  },
  {
    title: 'O Sistema Solar',
    passage:
      'O Sistema Solar e formado pelo Sol e oito planetas que giram ao seu redor. A Terra e o terceiro planeta mais proximo do Sol. Marte, nosso vizinho, e chamado de "planeta vermelho" por causa da cor do seu solo. Jupiter e o maior planeta do Sistema Solar e tem uma mancha vermelha que e, na verdade, uma tempestade gigante.',
    questions: [
      {
        question: 'Qual e a posicao da Terra em relacao ao Sol?',
        options: [
          'Terceiro planeta mais proximo',
          'Primeiro planeta',
          'Quinto planeta',
          'Ultimo planeta',
        ],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'O que a "mancha vermelha" de Jupiter nos mostra sobre o planeta?',
        options: [
          'Que Jupiter tem tempestades muito grandes',
          'Que Jupiter e vermelho como Marte',
          'Que Jupiter e pequeno',
          'Que Jupiter esta perto do Sol',
        ],
        correctIndex: 0,
        type: 'inference',
      },
    ],
  },
  {
    title: 'A Capoeira',
    passage:
      'A capoeira e uma expressao cultural brasileira que mistura luta, danca e musica. Ela foi criada pelos africanos escravizados no Brasil como forma de resistencia. Os movimentos da capoeira imitam golpes de luta, mas sao feitos dentro de uma roda ao som do berimbau. Hoje, a capoeira e reconhecida como Patrimonio Cultural do Brasil.',
    questions: [
      {
        question: 'Quem criou a capoeira?',
        options: [
          'Os africanos escravizados',
          'Os indigenas brasileiros',
          'Os portugueses colonizadores',
          'Os imigrantes italianos',
        ],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'Por que a capoeira era uma forma de "resistencia"?',
        options: [
          'Porque os escravizados disfarçavam a luta de danca',
          'Porque era um esporte muito dificil',
          'Porque precisava de muita forca',
          'Porque so era praticada a noite',
        ],
        correctIndex: 0,
        type: 'inference',
      },
    ],
  },
  {
    title: 'O Lixo e a Reciclagem',
    passage:
      'Todos os dias, cada pessoa produz em media 1 quilo de lixo. Grande parte desse lixo pode ser reciclada, como papel, plastico, vidro e metal. A reciclagem ajuda a diminuir a poluicao e economizar recursos naturais. Separar o lixo em casa e o primeiro passo para ajudar o meio ambiente.',
    questions: [
      {
        question: 'Quais materiais podem ser reciclados segundo o texto?',
        options: [
          'Papel, plastico, vidro e metal',
          'Comida e restos organicos',
          'Somente papel e plastico',
          'Nenhum material pode ser reciclado',
        ],
        correctIndex: 0,
        type: 'literal',
      },
      {
        question: 'Qual e o primeiro passo para ajudar o meio ambiente com a reciclagem?',
        options: [
          'Separar o lixo em casa',
          'Comprar produtos reciclados',
          'Nao produzir nenhum lixo',
          'Jogar tudo no mesmo lixo',
        ],
        correctIndex: 0,
        type: 'inference',
      },
    ],
  },
];

export const HARD_PASSAGES: TextPassage[] = [
  {
    title: 'A Revolucao Digital',
    passage:
      'A internet transformou a forma como as pessoas se comunicam e aprendem. Antes, para fazer uma pesquisa escolar, era preciso ir a biblioteca e consultar enciclopedias. Hoje, com poucos cliques, encontramos informacoes sobre qualquer assunto. Porem, nem tudo que esta na internet e verdadeiro, e precisamos aprender a verificar as fontes das informacoes. O pensamento critico se tornou uma habilidade essencial na era digital.',
    questions: [
      {
        question: 'O que o texto quer dizer com "pensamento critico na era digital"?',
        options: [
          'Saber avaliar se uma informacao e verdadeira',
          'Criticar tudo que encontramos na internet',
          'Usar o computador com cuidado',
          'Pensar sobre tecnologia',
        ],
        correctIndex: 0,
        type: 'inference',
      },
      {
        question: 'Qual e o significado de "consultar" no contexto do texto?',
        options: [
          'Pesquisar, buscar informacoes',
          'Comprar livros',
          'Conversar com amigos',
          'Ir ao medico',
        ],
        correctIndex: 0,
        type: 'vocabulary',
      },
    ],
  },
  {
    title: 'A Floresta Amazonica em Perigo',
    passage:
      'A Floresta Amazonica e a maior floresta tropical do mundo e abriga milhoes de especies de animais e plantas. Ela e tao importante que e chamada de "pulmao do mundo" porque produz grande quantidade de oxigenio. No entanto, o desmatamento ameaca esse bioma todos os anos. Quando as arvores sao derrubadas, muitos animais perdem suas casas e o equilibrio do clima e afetado. Cientistas alertam que proteger a Amazonia e urgente para o futuro do planeta.',
    questions: [
      {
        question: 'Por que a Amazonia e chamada de "pulmao do mundo"?',
        options: [
          'Porque produz grande quantidade de oxigenio',
          'Porque tem formato de pulmao',
          'Porque fica no centro do Brasil',
          'Porque e muito grande',
        ],
        correctIndex: 0,
        type: 'inference',
      },
      {
        question: 'O que significa "equilibrio do clima" no texto?',
        options: [
          'O funcionamento normal das condicoes climaticas',
          'A temperatura ser sempre a mesma',
          'Nao ter chuva nem sol',
          'O clima ser sempre quente',
        ],
        correctIndex: 0,
        type: 'vocabulary',
      },
    ],
  },
  {
    title: 'Santos Dumont e o Aviao',
    passage:
      'Alberto Santos Dumont foi um inventor brasileiro que ficou famoso por seus voos com baloes e dirigiveis em Paris. Em 1906, ele realizou o primeiro voo publico com um aparelho mais pesado que o ar, o 14-Bis. Esse voo foi testemunhado por jornalistas e observadores oficiais, o que comprovou seu feito. Para os brasileiros, Santos Dumont e considerado o "pai da aviacao". Sua contribuicao para a historia da humanidade foi imensa e inspirou geracoes de cientistas.',
    questions: [
      {
        question: 'Por que o voo do 14-Bis e considerado especial?',
        options: [
          'Porque foi testemunhado publicamente por jornalistas',
          'Porque foi o voo mais longo da historia',
          'Porque voou mais alto que todos',
          'Porque foi feito sem motor',
        ],
        correctIndex: 0,
        type: 'inference',
      },
      {
        question: 'O que significa "testemunhado" no texto?',
        options: [
          'Visto e comprovado por pessoas presentes',
          'Filmado por cameras',
          'Feito em segredo',
          'Registrado em livro',
        ],
        correctIndex: 0,
        type: 'vocabulary',
      },
    ],
  },
  {
    title: 'Os Povos Indigenas',
    passage:
      'Antes da chegada dos portugueses, o Brasil era habitado por milhoes de indigenas de diversas etnias. Cada povo tinha sua propria lingua, cultura e forma de organizacao social. Os indigenas possuiam profundo conhecimento sobre as plantas medicinais da floresta e tecnicas de agricultura sustentavel. Infelizmente, muitos povos foram dizimados pela colonizacao, mas os que resistiram continuam lutando pela preservacao de suas terras e culturas. Hoje, existem mais de 300 etnias indigenas no Brasil.',
    questions: [
      {
        question: 'O que o texto nos ensina sobre o conhecimento dos povos indigenas?',
        options: [
          'Conheciam plantas medicinais e agricultura sustentavel',
          'Nao sabiam nada sobre a natureza',
          'So sabiam cacar e pescar',
          'Aprenderam tudo com os portugueses',
        ],
        correctIndex: 0,
        type: 'inference',
      },
      {
        question: 'O que significa "dizimados" no contexto do texto?',
        options: [
          'Mortos em grande numero',
          'Mudados de lugar',
          'Ensinados pelos europeus',
          'Batizados pelos padres',
        ],
        correctIndex: 0,
        type: 'vocabulary',
      },
    ],
  },
  {
    title: 'A Energia Renovavel',
    passage:
      'O Brasil e um dos paises que mais utilizam energias renovaveis no mundo. A maior parte da energia eletrica brasileira vem das usinas hidreletricas, que usam a forca da agua para gerar eletricidade. Alem disso, o pais tem investido em energia solar e eolica, que usam o sol e o vento. Essas fontes de energia sao chamadas de "limpas" porque nao poluem o ar como o petroleo e o carvao. O desafio e continuar diversificando a matriz energetica para nao depender de uma unica fonte.',
    questions: [
      {
        question: 'Por que as energias renovaveis sao chamadas de "limpas"?',
        options: [
          'Porque nao poluem o ar',
          'Porque usam agua limpa',
          'Porque sao mais baratas',
          'Porque foram inventadas recentemente',
        ],
        correctIndex: 0,
        type: 'inference',
      },
      {
        question: 'O que significa "diversificando a matriz energetica"?',
        options: [
          'Usando diferentes fontes de energia',
          'Gastando menos energia',
          'Produzindo mais petroleo',
          'Fechando usinas hidreletricas',
        ],
        correctIndex: 0,
        type: 'vocabulary',
      },
    ],
  },
  {
    title: 'O Sertao Nordestino',
    passage:
      'O sertao e a regiao do interior do Nordeste brasileiro com clima semiarido. As chuvas sao escassas e irregulares, tornando a vida dos sertanejos bastante desafiadora. Apesar das dificuldades, o povo sertanejo e conhecido por sua resiliencia e criatividade. Tecnologias como as cisternas de captacao de agua da chuva tem ajudado muitas familias a enfrentar os periodos de seca. A cultura do sertao e rica em literatura, musica e artesanato.',
    questions: [
      {
        question: 'O que a palavra "resiliencia" quer dizer no contexto do texto?',
        options: [
          'Capacidade de superar dificuldades',
          'Ser muito forte fisicamente',
          'Nao ter medo de nada',
          'Gostar de morar no sertao',
        ],
        correctIndex: 0,
        type: 'vocabulary',
      },
      {
        question: 'Como as cisternas ajudam os sertanejos?',
        options: [
          'Guardando agua da chuva para os periodos secos',
          'Produzindo chuva artificial',
          'Trazendo agua de outros estados',
          'Resfriando o clima da regiao',
        ],
        correctIndex: 0,
        type: 'inference',
      },
    ],
  },
  {
    title: 'A Biodiversidade Brasileira',
    passage:
      'O Brasil e o pais com a maior biodiversidade do planeta, abrigando cerca de 20% de todas as especies conhecidas. Sao mais de 100 mil especies de animais e 40 mil de plantas. Essa riqueza biologica esta distribuida em biomas como a Amazonia, o Cerrado, a Mata Atlantica, a Caatinga, o Pantanal e os Pampas. Porem, muitas dessas especies estao ameacadas de extincao por causa do desmatamento e da poluicao. Preservar essa biodiversidade e essencial para o equilibrio dos ecossistemas e para o desenvolvimento de novos medicamentos.',
    questions: [
      {
        question: 'Por que preservar a biodiversidade e importante para a medicina?',
        options: [
          'Porque especies podem ajudar a desenvolver novos medicamentos',
          'Porque medicos vivem na floresta',
          'Porque os hospitais ficam perto das matas',
          'Porque animais nao ficam doentes',
        ],
        correctIndex: 0,
        type: 'inference',
      },
      {
        question: 'O que significa "biodiversidade"?',
        options: [
          'A variedade de seres vivos de um lugar',
          'A beleza da natureza',
          'A quantidade de arvores',
          'O tamanho das florestas',
        ],
        correctIndex: 0,
        type: 'vocabulary',
      },
    ],
  },
];

export function getPassages(difficulty: 'easy' | 'medium' | 'hard', count: number): TextPassage[] {
  let pool: TextPassage[];
  switch (difficulty) {
    case 'easy':
      pool = EASY_PASSAGES;
      break;
    case 'medium':
      pool = MEDIUM_PASSAGES;
      break;
    case 'hard':
      pool = HARD_PASSAGES;
      break;
  }

  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
