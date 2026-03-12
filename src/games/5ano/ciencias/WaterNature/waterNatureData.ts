import type { Difficulty } from '../../../../data/models';

export interface NatureConcept {
  name: string;
  emoji: string;
  category: string;
  description: string;
  funFact: string;
}

export interface NatureQuestion {
  question: string;
  options: string[];
  correct: string;
  hint?: string;
  conceptRelated?: string;
}

// ── Conceitos para exibição visual ─────────────────────────────────────
export const CONCEPTS: NatureConcept[] = [
  {
    name: 'Ciclo da Água',
    emoji: '💧',
    category: 'Água',
    description: 'A água evapora, forma nuvens, chove e volta para rios e mares.',
    funFact: 'A água que bebemos hoje é a mesma que existia na época dos dinossauros!',
  },
  {
    name: 'Evaporação',
    emoji: '☀️',
    category: 'Estados da Matéria',
    description: 'Quando a água líquida se transforma em vapor pela ação do calor.',
    funFact: 'Quando você seca a roupa no varal, a água evapora com o calor do sol!',
  },
  {
    name: 'Condensação',
    emoji: '☁️',
    category: 'Estados da Matéria',
    description: 'Quando o vapor de água se resfria e volta a ser líquido, formando nuvens.',
    funFact: 'O espelho embaçado do banheiro é condensação: o vapor quente vira gotinhas!',
  },
  {
    name: 'Solidificação',
    emoji: '🧊',
    category: 'Estados da Matéria',
    description: 'Quando a água líquida se transforma em gelo pelo resfriamento.',
    funFact: 'A água é uma das poucas substâncias que se expande ao congelar!',
  },
  {
    name: 'Fusão',
    emoji: '🫠',
    category: 'Estados da Matéria',
    description: 'Quando o gelo derrete e se transforma em água líquida.',
    funFact: 'O gelo derrete a 0°C. Acima dessa temperatura, ele começa a virar água!',
  },
  {
    name: 'Vegetação',
    emoji: '🌳',
    category: 'Conservação',
    description: 'As plantas ajudam a manter o ciclo da água, proteger o solo e purificar o ar.',
    funFact: 'Uma única árvore grande pode liberar até 400 litros de água por dia pela transpiração!',
  },
  {
    name: 'Sustentabilidade',
    emoji: '♻️',
    category: 'Recursos',
    description: 'Usar os recursos naturais de forma consciente para que não acabem.',
    funFact: 'Reciclar uma lata de alumínio economiza energia suficiente para assistir TV por 3 horas!',
  },
  {
    name: 'Água Potável',
    emoji: '🚰',
    category: 'Água',
    description: 'Água tratada e própria para beber, livre de contaminação.',
    funFact: 'Apenas 3% de toda a água do planeta é doce, e menos de 1% está disponível para uso!',
  },
];

// ── FÁCIL ──────────────────────────────────────────────────────────────
// Temas: estados da matéria, ciclo da água básico, água no dia a dia
const EASY_QUESTIONS: NatureQuestion[] = [
  // --- Estados da matéria ---
  { question: 'Quais são os três estados físicos da água?', options: ['Sólido, líquido e gasoso', 'Quente, morno e frio', 'Doce, salgada e mineral', 'Limpa, suja e poluída'], correct: 'Sólido, líquido e gasoso', conceptRelated: 'Ciclo da Água' },
  { question: 'Em qual estado físico a água está quando vira gelo?', options: ['Sólido', 'Líquido', 'Gasoso', 'Pastoso'], correct: 'Sólido', conceptRelated: 'Solidificação' },
  { question: 'O vapor que sai da panela quente é a água no estado...', options: ['Gasoso', 'Sólido', 'Líquido', 'Congelado'], correct: 'Gasoso', conceptRelated: 'Evaporação' },
  { question: 'A água que bebemos está em qual estado físico?', options: ['Líquido', 'Sólido', 'Gasoso', 'Plasma'], correct: 'Líquido' },
  { question: 'O que acontece quando colocamos água no freezer?', options: ['Ela congela e vira gelo', 'Ela evapora e vira vapor', 'Ela desaparece por completo', 'Ela fica quente e ferve'], correct: 'Ela congela e vira gelo', conceptRelated: 'Solidificação', hint: 'O freezer deixa a temperatura abaixo de 0°C' },
  { question: 'Quando o gelo derrete, ele se transforma em...', options: ['Água líquida', 'Vapor', 'Neve', 'Nada'], correct: 'Água líquida', conceptRelated: 'Fusão' },
  { question: 'A transformação do gelo em água líquida se chama...', options: ['Fusão', 'Evaporação', 'Condensação', 'Sublimação'], correct: 'Fusão', conceptRelated: 'Fusão' },
  { question: 'A transformação da água líquida em vapor se chama...', options: ['Evaporação', 'Fusão', 'Solidificação', 'Condensação'], correct: 'Evaporação', conceptRelated: 'Evaporação' },

  // --- Ciclo da água básico ---
  { question: 'De onde vem a chuva?', options: ['Das nuvens', 'Do sol', 'Das estrelas', 'Do vento'], correct: 'Das nuvens', conceptRelated: 'Condensação', hint: 'As nuvens são formadas por gotinhas de água' },
  { question: 'O sol aquece a água dos rios e mares. O que acontece?', options: ['A água evapora e sobe para o céu', 'A água congela e forma gelo', 'A água some e desaparece do rio', 'A água fica mais pesada e afunda'], correct: 'A água evapora e sobe para o céu', conceptRelated: 'Evaporação' },
  { question: 'As nuvens são formadas por...', options: ['Gotinhas de água ou cristais de gelo', 'Pedaços de algodão e espuma', 'Fumaça das fábricas e chaminés', 'Poeira e areia levadas pelo vento'], correct: 'Gotinhas de água ou cristais de gelo', conceptRelated: 'Condensação' },
  { question: 'Depois que chove, para onde vai a água?', options: ['Para rios, lagos e lençóis subterrâneos', 'Para o espaço junto com o vento', 'Desaparece e nunca mais volta', 'Fica parada no ar sem cair mais'], correct: 'Para rios, lagos e lençóis subterrâneos', conceptRelated: 'Ciclo da Água' },
  { question: 'O ciclo da água é...', options: ['O caminho que a água percorre na natureza', 'O nome dado a um rio muito grande', 'Um tipo especial de chuva no verão', 'O movimento das ondas do oceano'], correct: 'O caminho que a água percorre na natureza', conceptRelated: 'Ciclo da Água' },

  // --- Água no dia a dia ---
  { question: 'Para que usamos a água no dia a dia?', options: ['Beber, cozinhar, tomar banho e limpar', 'Apenas para beber', 'Apenas para nadar', 'Apenas para regar plantas'], correct: 'Beber, cozinhar, tomar banho e limpar', conceptRelated: 'Água Potável' },
  { question: 'Qual destes é um exemplo de economia de água?', options: ['Fechar a torneira ao escovar os dentes', 'Deixar a torneira aberta o dia todo', 'Tomar banhos de 1 hora', 'Lavar a calçada com mangueira'], correct: 'Fechar a torneira ao escovar os dentes', conceptRelated: 'Sustentabilidade' },
  { question: 'A água que sai da torneira precisa ser...', options: ['Tratada antes de beber', 'Fervida sempre', 'Congelada', 'Misturada com açúcar'], correct: 'Tratada antes de beber', conceptRelated: 'Água Potável', hint: 'A estação de tratamento limpa a água' },
];

// ── MÉDIO ──────────────────────────────────────────────────────────────
// Temas: ciclo da água detalhado, propriedades dos materiais, vegetação e conservação, reciclagem
const MEDIUM_QUESTIONS: NatureQuestion[] = [
  // --- Ciclo da água detalhado ---
  { question: 'Qual é a ordem correta do ciclo da água?', options: ['Evaporação → Condensação → Precipitação', 'Precipitação → Solidificação → Fusão', 'Condensação → Fusão → Evaporação', 'Solidificação → Evaporação → Condensação'], correct: 'Evaporação → Condensação → Precipitação', conceptRelated: 'Ciclo da Água' },
  { question: 'O que é precipitação?', options: ['A queda de água das nuvens como chuva ou neve', 'A transformação da água em vapor pelo calor', 'O derretimento do gelo nos polos e geleiras', 'O congelamento da água durante o inverno'], correct: 'A queda de água das nuvens como chuva ou neve', conceptRelated: 'Ciclo da Água', hint: 'É a etapa da chuva no ciclo da água' },
  { question: 'O espelho do banheiro fica embaçado após o banho quente porque...', options: ['O vapor de água se condensou no espelho frio', 'O espelho está sujo', 'A água do chuveiro espirrou', 'O espelho esquentou'], correct: 'O vapor de água se condensou no espelho frio', conceptRelated: 'Condensação' },
  { question: 'O que são lençóis freáticos?', options: ['Reservas de água no subsolo', 'Lençóis de cama', 'Rios muito grandes', 'Nuvens muito baixas'], correct: 'Reservas de água no subsolo', conceptRelated: 'Ciclo da Água', hint: 'São depósitos de água debaixo da terra' },
  { question: 'A transpiração das plantas contribui para...', options: ['O ciclo da água, liberando vapor para o ar', 'A poluição do ar nas grandes cidades', 'O aquecimento global no planeta Terra', 'A diminuição das chuvas na região'], correct: 'O ciclo da água, liberando vapor para o ar', conceptRelated: 'Vegetação' },

  // --- Propriedades dos materiais ---
  { question: 'Qual material é bom condutor de calor?', options: ['Metal', 'Madeira', 'Plástico', 'Borracha'], correct: 'Metal', hint: 'Por isso a panela de metal esquenta rápido!' },
  { question: 'Qual material é bom isolante térmico (não conduz bem o calor)?', options: ['Isopor', 'Alumínio', 'Ferro', 'Cobre'], correct: 'Isopor', hint: 'Por isso usamos caixas de isopor para manter as coisas frias' },
  { question: 'Qual material é atraído pelo ímã?', options: ['Ferro', 'Madeira', 'Plástico', 'Vidro'], correct: 'Ferro', hint: 'Nem todos os metais são magnéticos' },
  { question: 'O que significa dizer que um material é solúvel em água?', options: ['Ele se dissolve na água', 'Ele flutua na água', 'Ele afunda na água', 'Ele congela na água'], correct: 'Ele se dissolve na água', hint: 'O sal e o açúcar são solúveis em água' },
  { question: 'Qual destes materiais é solúvel em água?', options: ['Sal', 'Areia', 'Pedra', 'Óleo'], correct: 'Sal', hint: 'Coloque sal na água e mexa: ele desaparece!' },
  { question: 'O óleo e a água não se misturam porque...', options: ['O óleo não é solúvel em água', 'O óleo é mais quente', 'A água é mais pesada', 'O óleo evapora'], correct: 'O óleo não é solúvel em água' },
  { question: 'Qual propriedade faz o ferro ser mais duro que a borracha?', options: ['Dureza', 'Elasticidade', 'Solubilidade', 'Cor'], correct: 'Dureza' },
  { question: 'A elasticidade é a propriedade que permite ao material...', options: ['Voltar à forma original após ser esticado', 'Conduzir eletricidade', 'Dissolver na água', 'Mudar de cor'], correct: 'Voltar à forma original após ser esticado', hint: 'A borracha é um bom exemplo!' },

  // --- Vegetação e conservação ---
  { question: 'As florestas ajudam a manter o ciclo da água porque...', options: ['As raízes absorvem água e as folhas liberam vapor', 'As árvores bloqueiam a passagem da chuva', 'As florestas secam os rios ao seu redor', 'As folhas grandes produzem vento e brisa'], correct: 'As raízes absorvem água e as folhas liberam vapor', conceptRelated: 'Vegetação' },
  { question: 'O desmatamento pode causar...', options: ['Erosão do solo, menos chuva e perda de nascentes', 'Mais chuvas e surgimento de novos rios', 'Solo mais fértil e melhor para plantar', 'Aumento da biodiversidade e das matas'], correct: 'Erosão do solo, menos chuva e perda de nascentes', conceptRelated: 'Vegetação' },
  { question: 'O que acontece com o solo quando não tem vegetação?', options: ['A chuva leva a terra embora (erosão)', 'O solo fica mais forte e resistente', 'Nascem mais plantas espontaneamente', 'O solo congela e endurece rapidamente'], correct: 'A chuva leva a terra embora (erosão)', conceptRelated: 'Vegetação', hint: 'As raízes das plantas seguram o solo' },
  { question: 'As árvores ajudam a melhorar a qualidade do ar porque...', options: ['Absorvem gás carbônico e liberam oxigênio', 'Produzem fumaça e partículas no ar', 'Absorvem oxigênio e liberam nitrogênio', 'Bloqueiam o vento e filtram a poeira'], correct: 'Absorvem gás carbônico e liberam oxigênio', conceptRelated: 'Vegetação' },

  // --- Reciclagem e sustentabilidade ---
  { question: 'Qual é a cor da lixeira de reciclagem para plástico?', options: ['Vermelha', 'Azul', 'Verde', 'Amarela'], correct: 'Vermelha', conceptRelated: 'Sustentabilidade' },
  { question: 'Qual é a cor da lixeira de reciclagem para papel?', options: ['Azul', 'Vermelha', 'Amarela', 'Verde'], correct: 'Azul', conceptRelated: 'Sustentabilidade' },
  { question: 'Os 3 Rs da sustentabilidade são...', options: ['Reduzir, Reutilizar e Reciclar', 'Rir, Rezar e Relaxar', 'Reaproveitar, Refazer e Repintar', 'Rachar, Rasgar e Reformar'], correct: 'Reduzir, Reutilizar e Reciclar', conceptRelated: 'Sustentabilidade' },
  { question: 'Quanto tempo uma garrafa de plástico leva para se decompor na natureza?', options: ['Mais de 400 anos', '1 mês', '5 anos', '2 semanas'], correct: 'Mais de 400 anos', conceptRelated: 'Sustentabilidade', hint: 'O plástico é um grande problema ambiental' },
];

// ── DIFÍCIL ────────────────────────────────────────────────────────────
// Temas: ciclo da água e agricultura/energia, propriedades avançadas, impacto ambiental, soluções sustentáveis
const HARD_QUESTIONS: NatureQuestion[] = [
  // --- Ciclo da água e impacto ---
  { question: 'O ciclo da água é essencial para a agricultura porque...', options: ['A chuva irriga as plantações naturalmente', 'A água do mar chega às fazendas', 'As plantas não precisam de água', 'O gelo fertiliza o solo'], correct: 'A chuva irriga as plantações naturalmente', conceptRelated: 'Ciclo da Água' },
  { question: 'Como o desmatamento afeta o ciclo da água?', options: ['Reduz a evapotranspiração e diminui as chuvas', 'Aumenta as chuvas na região desmatada', 'Não causa nenhum efeito significativo', 'Cria mais rios e nascentes de água'], correct: 'Reduz a evapotranspiração e diminui as chuvas', conceptRelated: 'Vegetação' },
  { question: 'As usinas hidrelétricas usam a água para...', options: ['Gerar energia elétrica com a força da água', 'Fabricar água potável', 'Congelar alimentos', 'Fazer chuva artificial'], correct: 'Gerar energia elétrica com a força da água', conceptRelated: 'Ciclo da Água', hint: 'A água cai de uma barragem e gira turbinas' },
  { question: 'A seca prolongada no Nordeste está relacionada a...', options: ['Clima semiárido e irregularidade das chuvas', 'Excesso de florestas', 'Muita água nos rios', 'Neve constante'], correct: 'Clima semiárido e irregularidade das chuvas', conceptRelated: 'Ciclo da Água' },
  { question: 'A poluição dos rios pode tornar a água...', options: ['Imprópria para consumo e prejudicial à vida', 'Mais limpa e própria para consumo', 'Mais potável e saudável para todos', 'Mais nutritiva e boa para os peixes'], correct: 'Imprópria para consumo e prejudicial à vida', conceptRelated: 'Água Potável' },

  // --- Propriedades dos materiais avançadas ---
  { question: 'Por que a panela é feita de metal e o cabo é de plástico?', options: ['O metal conduz calor para cozinhar, o plástico protege a mão', 'É mais bonito assim', 'O metal é mais barato', 'O plástico esquenta mais'], correct: 'O metal conduz calor para cozinhar, o plástico protege a mão', hint: 'Cada material tem propriedades diferentes' },
  { question: 'Por que usamos fios de cobre para conduzir eletricidade?', options: ['Porque o cobre é um excelente condutor elétrico', 'Porque o cobre é bonito', 'Porque é o metal mais leve', 'Porque é o metal mais duro'], correct: 'Porque o cobre é um excelente condutor elétrico' },
  { question: 'A densidade determina se um objeto...', options: ['Flutua ou afunda na água', 'É colorido ou não', 'É grande ou pequeno', 'É quente ou frio'], correct: 'Flutua ou afunda na água', hint: 'Objetos menos densos que a água flutuam' },
  { question: 'Por que o gelo flutua na água líquida?', options: ['Porque o gelo é menos denso que a água líquida', 'Porque o gelo é mais pesado', 'Porque a água empurra o gelo', 'Porque o gelo é quente'], correct: 'Porque o gelo é menos denso que a água líquida', conceptRelated: 'Solidificação', hint: 'A água se expande ao congelar' },
  { question: 'Qual material seria melhor para fazer uma garrafa térmica?', options: ['Isopor (isolante térmico)', 'Alumínio', 'Ferro', 'Vidro fino'], correct: 'Isopor (isolante térmico)', hint: 'Precisamos de um material que não deixe o calor passar' },
  { question: 'O que acontece com a maioria dos metais quando aquecidos?', options: ['Eles se expandem (dilatam)', 'Eles encolhem', 'Eles desaparecem', 'Eles ficam mais duros'], correct: 'Eles se expandem (dilatam)', hint: 'Chamamos isso de dilatação térmica' },

  // --- Impacto ambiental ---
  { question: 'O efeito estufa é...', options: ['O aquecimento da Terra por gases que retêm calor na atmosfera', 'Um tipo de estufa para plantas', 'O resfriamento do planeta', 'Uma estação do ano'], correct: 'O aquecimento da Terra por gases que retêm calor na atmosfera', hint: 'O CO₂ é um dos principais gases do efeito estufa' },
  { question: 'Queimar combustíveis fósseis (gasolina, diesel) contribui para...', options: ['O aquecimento global e a poluição do ar', 'A limpeza do ar', 'O aumento das florestas', 'A purificação da água'], correct: 'O aquecimento global e a poluição do ar' },
  { question: 'As nascentes dos rios precisam de vegetação ao redor para...', options: ['Proteger a fonte de água e evitar que seque', 'Tornar a água mais escura', 'Bloquear a passagem da água', 'Fazer sombra para os peixes'], correct: 'Proteger a fonte de água e evitar que seque', conceptRelated: 'Vegetação' },
  { question: 'O lixo jogado nos rios pode causar...', options: ['Inundações, poluição e morte de animais', 'Rios mais bonitos e cheios de vida', 'Aumento dos peixes e crustáceos', 'Água mais limpa e cristalina'], correct: 'Inundações, poluição e morte de animais' },

  // --- Soluções sustentáveis ---
  { question: 'A água da chuva pode ser captada e usada para...', options: ['Regar plantas, lavar o chão e descargas', 'Beber diretamente', 'Fazer comida', 'Tomar banho'], correct: 'Regar plantas, lavar o chão e descargas', conceptRelated: 'Sustentabilidade', hint: 'Mas não é indicada para beber sem tratamento' },
  { question: 'A compostagem transforma restos de comida em...', options: ['Adubo para plantas', 'Plástico', 'Água limpa', 'Energia elétrica'], correct: 'Adubo para plantas', conceptRelated: 'Sustentabilidade' },
  { question: 'Qual energia é considerada mais sustentável?', options: ['Solar e eólica', 'Carvão e petróleo', 'Nuclear', 'Gasolina'], correct: 'Solar e eólica', conceptRelated: 'Sustentabilidade', hint: 'São energias renováveis que não poluem' },
  { question: 'Reutilizar materiais é melhor que reciclar porque...', options: ['Gasta menos energia e recursos', 'É mais caro', 'Polui mais', 'Não faz diferença'], correct: 'Gasta menos energia e recursos', conceptRelated: 'Sustentabilidade' },
  { question: 'Uma das soluções para a crise de água é...', options: ['Reduzir o desperdício e tratar o esgoto', 'Construir represas em todos os rios', 'Usar mais água subterrânea dos poços', 'Transportar água do oceano sem tratar'], correct: 'Reduzir o desperdício e tratar o esgoto', conceptRelated: 'Água Potável' },

  // --- Mistura de conceitos ---
  { question: 'A crise hídrica acontece quando...', options: ['A demanda por água é maior que a oferta disponível', 'Chove demais', 'Os rios estão muito cheios', 'Há muitas florestas'], correct: 'A demanda por água é maior que a oferta disponível', conceptRelated: 'Água Potável' },
  { question: 'Se não houvesse o ciclo da água, o que aconteceria?', options: ['Não haveria chuva, rios secariam e a vida seria impossível', 'Nada mudaria', 'Teria mais água', 'Os oceanos congelariam'], correct: 'Não haveria chuva, rios secariam e a vida seria impossível', conceptRelated: 'Ciclo da Água' },
  { question: 'Verdadeiro ou Falso: A água que evaporou do mar pode cair como chuva em outro continente.', options: ['Verdadeiro', 'Falso'], correct: 'Verdadeiro', conceptRelated: 'Ciclo da Água', hint: 'O vento carrega as nuvens por grandes distâncias' },
  { question: 'Qual a diferença entre água doce e água salgada?', options: ['A água doce tem pouco sal, a salgada tem muito', 'A doce é mais quente', 'A salgada é mais limpa', 'Não há diferença'], correct: 'A água doce tem pouco sal, a salgada tem muito', conceptRelated: 'Água Potável' },
];

export const QUESTIONS_BY_DIFFICULTY: Record<Difficulty, NatureQuestion[]> = {
  easy: EASY_QUESTIONS,
  medium: MEDIUM_QUESTIONS,
  hard: HARD_QUESTIONS,
};

export function getQuestionsForDifficulty(difficulty: Difficulty, count: number): NatureQuestion[] {
  const pool = [...QUESTIONS_BY_DIFFICULTY[difficulty]];
  const shuffled: NatureQuestion[] = [];
  while (shuffled.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    shuffled.push(pool.splice(idx, 1)[0]);
  }
  return shuffled;
}

export function getConceptByName(name: string): NatureConcept | undefined {
  return CONCEPTS.find((c) => c.name === name);
}
