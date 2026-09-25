/*
  "MAS DOUTOR, O QUE SERÁ QUE EU TENHO?"

  Os nomes dos sintomas vivem no HTML (a nuvem é conteúdo, não decoração,
  e precisa existir para quem chega pelo Google). Aqui ficam só os dados
  que não aparecem até o clique: sinônimos de busca, o resumo, as causas
  agrupadas pelas áreas da lista do Caio e o sinal de alerta.

  As causas usam os termos técnicos exatamente como estão no documento —
  é ali que mora a busca do paciente ("médico que trata enxaqueca").

  Comportamento pedido: clicou numa palavra, desce a ficha; clicou em
  outra, a ficha se remonta na mesma altura (recolhe e abre em um gesto
  só); tem botão de recolher para seguir rolando o site.
*/
(function () {
  const secao = document.querySelector('[data-sintomas]');
  if (!secao) return;

  /* ----------------------------------------------------------
     Dados
     ---------------------------------------------------------- */
  const FICHAS = {
    'dor-de-cabeca': {
      sin: ['cefaleia', 'enxaqueca', 'migranea', 'cabeca doendo', 'dor na cabeca', 'dor na nuca'],
      resumo: 'A maior parte das dores de cabeça é <strong>primária</strong> — não tem uma doença por trás, e sim um padrão próprio, que se trata. O trabalho da consulta é separar essas do grupo menor em que a dor é sinal de outra coisa: sono, pressão, seios da face, uso excessivo de analgésico.',
      grupos: [
        { area: 'Neurologia', causas: ['Cefaleia tensional', 'Enxaqueca (migrânea)'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno de ansiedade generalizada (TAG)', 'Insônia e outros distúrbios do sono', 'Esgotamento profissional (burnout)', 'Episódios de estresse agudo'] },
        { area: 'Saúde respiratória', causas: ['Rinossinusite aguda e crônica', 'Rinite alérgica'] },
        { area: 'Cardiovascular', causas: ['Hipertensão arterial sistêmica'] },
        { area: 'Oftalmologia e otorrino', causas: ['Labirintite', 'Cerúmen impactado'] }
      ],
      alerta: 'Dor súbita e explosiva ("a pior da vida"), com febre alta e rigidez de nuca, depois de trauma na cabeça, ou junto de fraqueza, fala enrolada e alteração da visão: isso é <strong>urgência</strong>, não é consulta agendada.'
    },

    'cansaco': {
      sin: ['fadiga', 'fraqueza', 'sem energia', 'indisposicao', 'moleza', 'canseira', 'sem disposicao'],
      resumo: 'Cansaço é o sintoma mais inespecífico da medicina — e por isso mesmo é onde o olhar de quem enxerga a pessoa inteira rende mais. Tireoide, sono, humor, vitaminas e coração entram na mesma conversa, e a investigação se dirige pelo que a história aponta, não por um pacote de exames.',
      grupos: [
        { area: 'Endocrinologia e metabolismo', causas: ['Hipotireoidismo', 'Hipertireoidismo', 'Diabetes mellitus tipo 2', 'Obesidade e sobrepeso', 'Deficiências vitamínicas (vitamina D e B12)', 'Desnutrição'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno depressivo maior', 'Distimia', 'Transtorno de ansiedade generalizada (TAG)', 'Insônia e outros distúrbios do sono', 'Esgotamento profissional (burnout)', 'Transtorno por uso de álcool'] },
        { area: 'Saúde respiratória', causas: ['Apneia obstrutiva do sono', 'Doença pulmonar obstrutiva crônica (DPOC)'] },
        { area: 'Cardiovascular', causas: ['Insuficiência cardíaca (fases iniciais)', 'Doença isquêmica do coração'] },
        { area: 'Doenças infecciosas', causas: ['Hepatites virais (B e C)', 'Infecção pelo HIV', 'Tuberculose'] }
      ],
      alerta: 'Cansaço que vem com emagrecimento sem explicação, febre que não passa ou suor noturno merece investigação <strong>sem esperar</strong>.'
    },

    'ansiedade': {
      sin: ['nervosismo', 'angustia', 'crise de ansiedade', 'preocupacao', 'aflicao', 'panico', 'nervoso'],
      resumo: 'Ansiedade é uma reação normal que vira diagnóstico quando toma conta da rotina. Boa parte é tratada na atenção primária, do começo ao fim — e quando o caso pede psiquiatra, o encaminhamento é direcionado, não genérico. Vale checar tireoide antes de fechar o diagnóstico.',
      grupos: [
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno de ansiedade generalizada (TAG)', 'Síndrome do pânico', 'Transtorno de ansiedade social', 'Fobias específicas', 'Episódios de estresse agudo', 'Insônia e outros distúrbios do sono', 'Esgotamento profissional (burnout)', 'Transtorno por uso de álcool', 'Transtorno de déficit de atenção e hiperatividade (TDAH)'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipertireoidismo'] },
        { area: 'Cardiovascular', causas: ['Arritmias benignas'] }
      ],
      alerta: 'Se aparecerem pensamentos de morte ou de se machucar, procure ajuda <strong>hoje</strong>. O CVV atende 24 horas no 188, de graça.'
    },

    'dor-nas-costas': {
      sin: ['lombalgia', 'dor lombar', 'coluna', 'dor na coluna', 'cervicalgia', 'dor no pescoco', 'ciatica', 'nervo ciatico'],
      resumo: 'Mais de 90% das dores lombares são <strong>mecânicas</strong> e melhoram em semanas, sem exame de imagem nenhum. Pedir ressonância cedo demais costuma atrapalhar: acha achado que não é a causa. O que muda o rumo é a história e o exame físico.',
      grupos: [
        { area: 'Ortopedia e reumatologia', causas: ['Lombalgia aguda e crônica', 'Cervicalgia', 'Ciatalgia', 'Osteoartrite (artrose)', 'Contraturas e espasmos musculares', 'Fibromialgia'] },
        { area: 'Urologia', causas: ['Litíase renal (cólica nefrética não complicada)', 'Infecção do trato urinário'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Osteoporose e osteopenia'] },
        { area: 'Ginecologia', causas: ['Dismenorreia (cólica menstrual)', 'Doença inflamatória pélvica'] }
      ],
      alerta: 'Perda de força nas pernas, dificuldade para segurar urina ou fezes, dormência na região da sela, febre ou emagrecimento junto da dor: procure avaliação <strong>imediata</strong>.'
    },

    'falta-de-ar': {
      sin: ['dispneia', 'cansaco para respirar', 'respiracao curta', 'ofego', 'sufoco', 'chiado no peito'],
      resumo: 'A pergunta que organiza tudo é: falta de ar de quando para cá, e em qual esforço? Súbita puxa para o pulmão e o coração; de meses, para asma, DPOC, peso e condicionamento. Um teste simples de função pulmonar resolve boa parte no consultório.',
      grupos: [
        { area: 'Saúde respiratória', causas: ['Asma', 'Doença pulmonar obstrutiva crônica (DPOC)', 'Pneumonias adquiridas na comunidade', 'Bronquite aguda', 'COVID-19', 'Apneia obstrutiva do sono', 'Tabagismo'] },
        { area: 'Cardiovascular', causas: ['Insuficiência cardíaca (fases iniciais e pacientes estáveis)', 'Doença isquêmica do coração', 'Arritmias benignas'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Síndrome do pânico', 'Transtorno de ansiedade generalizada (TAG)'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Obesidade e sobrepeso', 'Deficiências vitamínicas', 'Hipertireoidismo'] }
      ],
      alerta: 'Falta de ar que começa de repente, com dor no peito, lábios ou unhas arroxeados, ou que impede falar uma frase inteira: <strong>emergência, ligue 192</strong>.'
    },

    'dor-no-peito': {
      sin: ['aperto no peito', 'dor toracica', 'peito doendo', 'pontada no peito', 'coracao doendo'],
      resumo: 'Dor no peito não é sinônimo de coração — a maioria vem de estômago, musculatura da parede torácica ou ansiedade. Mas a conduta começa sempre descartando o que é grave, e essa triagem é rápida.',
      grupos: [
        { area: 'Cardiovascular', causas: ['Doença isquêmica do coração (acompanhamento e prevenção secundária)', 'Hipertensão arterial sistêmica', 'Arritmias benignas'] },
        { area: 'Gastroenterologia', causas: ['Doença do refluxo gastroesofágico (DRGE)', 'Gastrite', 'Dispepsia', 'Úlcera péptica'] },
        { area: 'Ortopedia e reumatologia', causas: ['Contraturas e espasmos musculares', 'Tendinopatias', 'Cervicalgia'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Síndrome do pânico', 'Transtorno de ansiedade generalizada (TAG)'] },
        { area: 'Saúde respiratória / pele', causas: ['Pneumonias adquiridas na comunidade', 'Herpes zoster'] }
      ],
      alerta: 'Dor em aperto no meio do peito que irradia para braço, pescoço ou mandíbula, com suor frio, enjoo ou falta de ar: <strong>ligue 192 agora</strong>. Não dirija até o hospital.'
    },

    'tontura': {
      sin: ['vertigem', 'labirintite', 'cabeca rodando', 'desequilibrio', 'zonzo', 'tonteira', 'escurecimento da vista'],
      resumo: 'Tontura tem três famílias bem diferentes, e separá-las é metade do diagnóstico: o mundo rodando (labirinto), a sensação de desmaio (pressão e coração) e o desequilíbrio ao andar (neurológico). Manobras simples no consultório já tratam a causa mais comum.',
      grupos: [
        { area: 'Neurologia', causas: ['Vertigem posicional paroxística benigna (VPPB)', 'Enxaqueca (migrânea)', 'Neuropatia periférica', 'Tremores essenciais'] },
        { area: 'Oftalmologia e otorrino', causas: ['Labirintite', 'Cerúmen impactado (rolha de cera)', 'Otite externa'] },
        { area: 'Cardiovascular', causas: ['Hipotensão ortostática', 'Arritmias benignas', 'Hipertensão arterial sistêmica'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Diabetes mellitus tipo 2', 'Deficiências vitamínicas (vitamina B12)'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Síndrome do pânico', 'Transtorno de ansiedade generalizada (TAG)'] }
      ],
      alerta: 'Tontura com fala enrolada, visão dupla, fraqueza de um lado do corpo ou dificuldade de andar pode ser <strong>AVC</strong>: 192, sem esperar passar.'
    },

    'insonia': {
      sin: ['nao consigo dormir', 'sono ruim', 'acordo de madrugada', 'dormir mal', 'sem sono', 'sono picado'],
      resumo: 'Antes do remédio vem a pergunta de por que o sono quebrou — e a resposta quase nunca é "falta de indutor". Ansiedade, álcool, apneia, próstata, menopausa e o próprio horário das telas explicam a maior parte. O tratamento de primeira linha é comportamental, e funciona.',
      grupos: [
        { area: 'Saúde mental e psiquiatria', causas: ['Insônia e outros distúrbios do sono', 'Transtorno depressivo maior', 'Transtorno de ansiedade generalizada (TAG)', 'Transtorno por uso de álcool', 'Esgotamento profissional (burnout)'] },
        { area: 'Saúde respiratória', causas: ['Apneia obstrutiva do sono', 'Rinite alérgica', 'Asma'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipertireoidismo', 'Obesidade e sobrepeso'] },
        { area: 'Ginecologia', causas: ['Menopausa e climatério', 'Síndrome da tensão pré-menstrual (SPM e TDPM)'] },
        { area: 'Urologia', causas: ['Hiperplasia prostática benigna (HPB)', 'Incontinência urinária'] }
      ]
    },

    'desanimo': {
      sin: ['tristeza', 'depressao', 'sem vontade', 'choro facil', 'vazio', 'anedonia', 'desesperanca'],
      resumo: 'Desânimo que dura mais de duas semanas e tira o prazer das coisas tem nome e tem tratamento. O médico de família acompanha a maior parte dos casos do início ao fim, com ou sem medicação, e chama o psiquiatra quando o caso pede — não por não saber, e sim por complexidade.',
      grupos: [
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno depressivo maior', 'Distimia', 'Luto complicado', 'Esgotamento profissional (burnout)', 'Transtorno por uso de álcool', 'Dependência de tabaco e outras drogas', 'Transtorno de déficit de atenção e hiperatividade (TDAH)'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipotireoidismo', 'Deficiências vitamínicas (vitamina D e B12)', 'Diabetes mellitus tipo 2'] },
        { area: 'Ginecologia', causas: ['Síndrome da tensão pré-menstrual (SPM e TDPM)', 'Menopausa e climatério'] },
        { area: 'Neurologia', causas: ['Rastreio e acompanhamento inicial de demências'] }
      ],
      alerta: 'Pensamentos de morte, de sumir ou de se machucar pedem ajuda <strong>imediata</strong>. O CVV atende de graça, 24 horas, no 188.'
    },

    'dor-de-barriga': {
      sin: ['dor abdominal', 'barriga doendo', 'colica intestinal', 'estomago doendo', 'dor no abdomen'],
      resumo: 'A localização e o ritmo da dor dizem quase tudo: em cima e ligada à comida, pensa-se em estômago e vesícula; embaixo e ligada ao intestino ou ao ciclo, muda a rota. A maioria é benigna e resolve no consultório.',
      grupos: [
        { area: 'Gastroenterologia', causas: ['Gastrite', 'Dispepsia', 'Úlcera péptica', 'Gastroenterite aguda', 'Intoxicação alimentar', 'Síndrome do intestino irritável', 'Constipação intestinal', 'Parasitoses intestinais (verminoses)', 'Intolerância à lactose', 'Colelitíase (pedra na vesícula)'] },
        { area: 'Ginecologia', causas: ['Dismenorreia (cólica menstrual)', 'Doença inflamatória pélvica', 'Síndrome dos ovários policísticos (SOP)'] },
        { area: 'Urologia', causas: ['Infecção do trato urinário', 'Litíase renal (cólica nefrética)'] }
      ],
      alerta: 'Dor forte que não passa, barriga endurecida, vômito que não para, febre, fezes escuras ou com sangue: avaliação <strong>de urgência</strong>.'
    },

    'azia': {
      sin: ['refluxo', 'queimacao no estomago', 'pirose', 'ma digestao', 'acidez', 'estomago queimando', 'empachamento'],
      resumo: 'Refluxo e gastrite são dois dos motivos mais comuns de consulta — e dois dos mais medicados por conta própria. Vale identificar o gatilho antes de cronificar o omeprazol: peso, horário das refeições, álcool, anti-inflamatório.',
      grupos: [
        { area: 'Gastroenterologia', causas: ['Doença do refluxo gastroesofágico (DRGE)', 'Gastrite', 'Dispepsia', 'Úlcera péptica', 'Esteatose hepática (gordura no fígado)', 'Colelitíase (pedra na vesícula)', 'Intolerância à lactose'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Obesidade e sobrepeso', 'Síndrome metabólica'] }
      ],
      alerta: 'Dificuldade ou dor para engolir, vômito com sangue, fezes pretas ou emagrecimento junto da queimação: investigar <strong>rápido</strong>.'
    },

    'intestino-preso': {
      sin: ['constipacao', 'prisao de ventre', 'nao consigo evacuar', 'fezes ressecadas', 'intestino travado'],
      resumo: 'Antes de laxante, checa-se o básico: água, fibra, rotina, medicações em uso e tireoide. E se o funcionamento mudou de repente depois dos 45, o rastreio de intestino entra na conversa.',
      grupos: [
        { area: 'Gastroenterologia', causas: ['Constipação intestinal', 'Síndrome do intestino irritável', 'Hemorroidas', 'Fissura anal'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipotireoidismo', 'Diabetes mellitus tipo 2', 'Desnutrição'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno depressivo maior'] }
      ],
      alerta: 'Mudança recente e persistente do hábito intestinal, sangue nas fezes ou emagrecimento: <strong>não espere</strong> para investigar.'
    },

    'diarreia': {
      sin: ['intestino solto', 'disenteria', 'evacuacao liquida', 'desarranjo', 'barriga solta'],
      resumo: 'Diarreia aguda quase sempre é viral e se resolve sozinha — o que salva é hidratar, não é antibiótico. Quando passa de quatro semanas, a lógica vira outra e a investigação começa.',
      grupos: [
        { area: 'Gastroenterologia', causas: ['Gastroenterite aguda', 'Intoxicação alimentar', 'Diarreia aguda e crônica', 'Síndrome do intestino irritável', 'Intolerância à lactose', 'Parasitoses intestinais (verminoses)'] },
        { area: 'Pediatria', causas: ['Diarreia aguda infantil', 'Parasitoses'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipertireoidismo', 'Diabetes mellitus tipo 2'] }
      ],
      alerta: 'Sinais de desidratação (boca seca, urina escura, moleza), sangue nas fezes ou febre alta — sobretudo em crianças e idosos — pedem <strong>avaliação no mesmo dia</strong>.'
    },

    'febre': {
      sin: ['temperatura alta', 'calafrios', 'febril', 'corpo quente', 'tremedeira'],
      resumo: 'Febre é resposta, não doença. O que importa é onde está a infecção e se há sinal de gravidade — e isso se descobre pelo exame, não pelo número do termômetro.',
      grupos: [
        { area: 'Saúde respiratória', causas: ['Gripe (influenza)', 'COVID-19', 'Resfriado comum', 'Faringite', 'Amigdalite', 'Rinossinusite aguda', 'Pneumonias adquiridas na comunidade'] },
        { area: 'Doenças infecciosas', causas: ['Dengue', 'Zika', 'Chikungunya', 'Tuberculose', 'Hepatites virais (B e C)', 'Toxoplasmose', 'Infecção pelo HIV'] },
        { area: 'Urologia e ginecologia', causas: ['Infecção do trato urinário', 'Prostatite', 'Doença inflamatória pélvica'] },
        { area: 'Dermatologia', causas: ['Erisipela', 'Celulite', 'Furunculose'] },
        { area: 'Pediatria', causas: ['Febre a esclarecer em crianças', 'Otite média aguda', 'Doenças exantemáticas da infância', 'Bronquiolite'] }
      ],
      alerta: 'Febre com manchas roxas na pele, rigidez de nuca, confusão, falta de ar, ou em <strong>bebê com menos de 3 meses</strong>: pronto-socorro, sem esperar.'
    },

    'tosse': {
      sin: ['tosse seca', 'tosse com catarro', 'pigarro', 'tossindo', 'tosse persistente'],
      resumo: 'Tosse de até três semanas quase sempre é infecção que passa. Depois disso, as três causas campeãs são outras: gotejamento pós-nasal, asma e refluxo — e nenhuma delas melhora com xarope.',
      grupos: [
        { area: 'Saúde respiratória', causas: ['Resfriado comum', 'Gripe (influenza)', 'COVID-19', 'Bronquite aguda', 'Asma', 'Doença pulmonar obstrutiva crônica (DPOC)', 'Pneumonias adquiridas na comunidade', 'Rinite alérgica', 'Rinossinusite crônica', 'Tabagismo (cessação)'] },
        { area: 'Gastroenterologia', causas: ['Doença do refluxo gastroesofágico (DRGE)'] },
        { area: 'Doenças infecciosas', causas: ['Tuberculose'] },
        { area: 'Cardiovascular', causas: ['Insuficiência cardíaca'] },
        { area: 'Pediatria', causas: ['Bronquiolite', 'Crupe (laringotraqueobronquite)', 'Asma infantil'] }
      ],
      alerta: 'Tosse por mais de três semanas, com sangue, febre à tarde, suor noturno ou emagrecimento: investigar <strong>tuberculose</strong> e outras causas sem demora.'
    },

    'dor-de-garganta': {
      sin: ['garganta inflamada', 'dor para engolir', 'amigdalite', 'garganta doendo', 'placas na garganta'],
      resumo: 'A maioria é viral e não precisa de antibiótico — existem critérios clínicos simples para decidir isso, e usá-los evita tanto o antibiótico desnecessário quanto o atraso quando ele é preciso.',
      grupos: [
        { area: 'Saúde respiratória', causas: ['Faringite', 'Amigdalite', 'Laringite', 'Resfriado comum', 'Gripe (influenza)', 'COVID-19', 'Rinossinusite aguda'] },
        { area: 'Gastroenterologia', causas: ['Doença do refluxo gastroesofágico (DRGE)'] },
        { area: 'Doenças infecciosas', causas: ['Sífilis', 'Infecção pelo HIV (fase aguda)', 'Gonorreia'] }
      ],
      alerta: 'Dificuldade para respirar, para abrir a boca ou para engolir a própria saliva, voz abafada e inchaço no pescoço: <strong>pronto-socorro</strong>.'
    },

    'nariz-entupido': {
      sin: ['coriza', 'congestao nasal', 'espirros', 'alergia no nariz', 'sinusite', 'rinite', 'nariz escorrendo'],
      resumo: 'Nariz entupido o ano inteiro raramente é "sinusite de repetição" — costuma ser rinite alérgica mal controlada. Identificar o alérgeno e usar o spray do jeito certo muda o ano da pessoa.',
      grupos: [
        { area: 'Saúde respiratória', causas: ['Rinite alérgica', 'Rinossinusite aguda e crônica', 'Resfriado comum', 'Gripe (influenza)', 'COVID-19'] },
        { area: 'Oftalmologia e otorrino', causas: ['Epistaxe (sangramento nasal simples)'] },
        { area: 'Dermatologia', causas: ['Dermatite de contato'] }
      ]
    },

    'manchas-na-pele': {
      sin: ['pintas', 'mancha', 'lesao de pele', 'pano branco', 'pinta nova', 'sinal na pele', 'vermelhidao'],
      resumo: 'Boa parte das manchas tem diagnóstico à vista, sem biópsia. O papel do médico de família aqui é duplo: resolver o comum e reconhecer cedo o que não pode esperar — melanoma e hanseníase entram nessa lista.',
      grupos: [
        { area: 'Dermatologia', causas: ['Pitiríase versicolor', 'Tínea', 'Dermatite seborreica', 'Dermatite de contato', 'Psoríase (casos leves a moderados)', 'Rosácea', 'Rastreio de câncer de pele (melanoma e não melanoma)'] },
        { area: 'Doenças infecciosas', causas: ['Hanseníase (diagnóstico e tratamento)', 'Sífilis', 'Dengue', 'Zika'] },
        { area: 'Pediatria', causas: ['Doenças exantemáticas da infância (sarampo, rubéola, roséola, eritema infeccioso, varicela)'] }
      ],
      alerta: 'Pinta que muda de cor, formato ou tamanho, tem bordas irregulares, coça ou sangra — e mancha com <strong>perda de sensibilidade</strong>, que sugere hanseníase — devem ser avaliadas logo.'
    },

    'coceira': {
      sin: ['prurido', 'pele cocando', 'urticaria', 'alergia na pele', 'cocando muito', 'pele irritada'],
      resumo: 'Coceira sem lesão nenhuma na pele é uma pista diferente de coceira com lesão: a primeira manda olhar fígado, tireoide, rim e ferro; a segunda é dermatológica de fato.',
      grupos: [
        { area: 'Dermatologia', causas: ['Dermatite atópica', 'Dermatite de contato', 'Urticária', 'Escabiose (sarna)', 'Pediculose (piolho)', 'Infecções fúngicas (tínea, candidíase cutânea, onicomicose)', 'Psoríase'] },
        { area: 'Doenças infecciosas', causas: ['Hepatites virais (B e C)'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Diabetes mellitus tipo 2', 'Hipotireoidismo', 'Deficiências vitamínicas'] },
        { area: 'Ginecologia', causas: ['Candidíase vaginal', 'Vaginose bacteriana'] }
      ]
    },

    'queda-de-cabelo': {
      sin: ['calvicie', 'cabelo caindo', 'alopecia', 'falha no cabelo', 'cabelo ralo'],
      resumo: 'Cabelo caindo em volume, uns três meses depois de um evento forte (parto, cirurgia, dieta, COVID, luto), costuma ser um susto reversível. O que muda a conduta é diferenciar isso de calvície, de falha localizada e de causa hormonal.',
      grupos: [
        { area: 'Dermatologia', causas: ['Alopecia areata e androgenética', 'Dermatite seborreica', 'Tínea do couro cabeludo', 'Psoríase'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipotireoidismo', 'Hipertireoidismo', 'Deficiências vitamínicas (vitamina D e B12)', 'Desnutrição'] },
        { area: 'Ginecologia', causas: ['Síndrome dos ovários policísticos (SOP)', 'Menopausa e climatério'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Episódios de estresse agudo', 'Transtorno depressivo maior'] }
      ]
    },

    'dor-nas-juntas': {
      sin: ['dor nas articulacoes', 'artrite', 'artrose', 'juntas doendo', 'reumatismo', 'juntas inchadas'],
      resumo: 'Junta que dói ao usar e melhora ao descansar aponta para desgaste; junta que amanhece dura por mais de meia hora aponta para inflamação. Essa única pergunta separa artrose de artrite e define os exames.',
      grupos: [
        { area: 'Ortopedia e reumatologia', causas: ['Osteoartrite (artrose)', 'Artrite reumatoide (suspeição e acompanhamento conjunto)', 'Tendinopatias (tendinite, bursite)', 'Fibromialgia', 'Entorses leves a moderados', 'Síndrome do túnel do carpo', 'Dedo em gatilho', 'Epicondilite (tennis elbow)'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Gota e hiperuricemia', 'Obesidade e sobrepeso', 'Hipotireoidismo'] },
        { area: 'Doenças infecciosas', causas: ['Chikungunya', 'Dengue', 'Zika'] }
      ],
      alerta: 'Uma única junta muito inchada, quente e vermelha, com febre, pode ser <strong>artrite séptica</strong>: avaliação no mesmo dia.'
    },

    'dor-no-joelho': {
      sin: ['joelho doendo', 'joelho inchado', 'joelho travando', 'dor ao subir escada'],
      resumo: 'Joelho é a junta que mais responde a tratamento conservador bem feito — fortalecimento, controle de peso e analgesia na dose certa resolvem a maioria dos casos antes de qualquer cirurgia.',
      grupos: [
        { area: 'Ortopedia e reumatologia', causas: ['Osteoartrite (artrose)', 'Tendinopatias (tendinite, bursite)', 'Entorses leves a moderados (joelho)', 'Contraturas e espasmos musculares', 'Fibromialgia'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Gota e hiperuricemia', 'Obesidade e sobrepeso'] },
        { area: 'Cardiovascular', causas: ['Insuficiência venosa crônica'] }
      ]
    },

    'formigamento': {
      sin: ['dormencia', 'agulhadas', 'adormece a mao', 'parestesia', 'mao dormente', 'pe formigando'],
      resumo: 'O desenho do formigamento é o diagnóstico: só nos dedos da mão à noite fala de túnel do carpo; nos dois pés, de forma simétrica, fala de diabetes e vitamina B12; descendo por uma perna só, de nervo comprimido na coluna.',
      grupos: [
        { area: 'Neurologia', causas: ['Neuropatia periférica', 'Enxaqueca (migrânea) com aura'] },
        { area: 'Ortopedia e reumatologia', causas: ['Síndrome do túnel do carpo', 'Cervicalgia', 'Ciatalgia'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Diabetes mellitus tipo 1 e tipo 2', 'Deficiências vitamínicas (vitamina B12)', 'Hipotireoidismo'] },
        { area: 'Doenças infecciosas', causas: ['Hanseníase', 'Infecção pelo HIV'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Síndrome do pânico'] }
      ],
      alerta: 'Dormência que aparece de repente em um lado do corpo, com fraqueza, boca torta ou fala enrolada: <strong>AVC — ligue 192</strong>. Tempo é cérebro.'
    },

    'palpitacao': {
      sin: ['coracao acelerado', 'taquicardia', 'batedeira', 'coracao disparado', 'coracao falhando'],
      resumo: 'A maioria das palpitações é benigna, mas duas perguntas mudam tudo: começa e termina de repente, ou vai e vem devagar? E vem com desmaio? Um Holter bem indicado costuma encerrar a dúvida.',
      grupos: [
        { area: 'Cardiovascular', causas: ['Arritmias benignas', 'Hipertensão arterial sistêmica', 'Doença isquêmica do coração', 'Hipotensão ortostática'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipertireoidismo', 'Diabetes mellitus (episódios de hipoglicemia)', 'Deficiências vitamínicas'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Síndrome do pânico', 'Transtorno de ansiedade generalizada (TAG)', 'Transtorno por uso de álcool'] }
      ],
      alerta: 'Palpitação com desmaio, dor no peito ou falta de ar importante: <strong>avaliação de urgência</strong>.'
    },

    'pressao-alta': {
      sin: ['hipertensao', 'pressao nas alturas', 'pressao subiu', '14 por 9', 'pressao descontrolada'],
      resumo: 'Pressão alta quase nunca dói — por isso a medida em casa vale mais que a do consultório, e o diagnóstico não se faz com uma aferição só. Tratar bem é menos sobre o remédio e mais sobre o conjunto: sono, sal, álcool, peso e risco cardiovascular somado.',
      grupos: [
        { area: 'Cardiovascular', causas: ['Hipertensão arterial sistêmica', 'Doença isquêmica do coração', 'Insuficiência cardíaca', 'Dislipidemias'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Obesidade e sobrepeso', 'Síndrome metabólica', 'Diabetes mellitus tipo 2', 'Hipertireoidismo'] },
        { area: 'Saúde respiratória', causas: ['Apneia obstrutiva do sono'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno por uso de álcool', 'Episódios de estresse agudo', 'Insônia'] }
      ],
      alerta: 'Pressão muito alta <strong>com</strong> dor no peito, falta de ar, dor de cabeça intensa, alteração da visão ou da fala: emergência. Sem sintomas, não é caso de correr ao pronto-socorro — é caso de consulta.'
    },

    'colesterol-alto': {
      sin: ['dislipidemia', 'trigliceridios', 'ldl alto', 'gordura no sangue', 'colesterol'],
      resumo: 'Colesterol não se trata por um número isolado: trata-se pelo risco cardiovascular somado da pessoa. Dois pacientes com o mesmo LDL podem ter condutas completamente diferentes — e é isso que a consulta define.',
      grupos: [
        { area: 'Endocrinologia e metabolismo', causas: ['Dislipidemias (colesterol e triglicerídeos altos)', 'Síndrome metabólica', 'Obesidade e sobrepeso', 'Hipotireoidismo', 'Diabetes mellitus tipo 2'] },
        { area: 'Gastroenterologia', causas: ['Esteatose hepática (gordura no fígado)'] },
        { area: 'Cardiovascular', causas: ['Doença isquêmica do coração (prevenção)', 'Hipertensão arterial sistêmica'] }
      ]
    },

    'acucar-alto': {
      sin: ['glicemia', 'diabetes', 'glicose alta', 'pre diabetes', 'hemoglobina glicada', 'sede excessiva'],
      resumo: 'Entre a glicemia normal e o diabetes existe uma faixa larga em que dá para mudar o desfecho — e é ali que o acompanhamento longitudinal, aquele que vê a pessoa ano após ano, vale mais do que qualquer exame isolado.',
      grupos: [
        { area: 'Endocrinologia e metabolismo', causas: ['Diabetes mellitus tipo 2', 'Diabetes mellitus tipo 1 (acompanhamento conjunto)', 'Síndrome metabólica', 'Obesidade e sobrepeso'] },
        { area: 'Ginecologia', causas: ['Síndrome dos ovários policísticos (SOP)'] },
        { area: 'Gastroenterologia', causas: ['Esteatose hepática (gordura no fígado)'] }
      ],
      alerta: 'Sede e urina em excesso, emagrecimento rápido, visão borrada e muito cansaço juntos pedem <strong>avaliação no mesmo dia</strong>.'
    },

    'ganho-de-peso': {
      sin: ['engordei', 'obesidade', 'barriga', 'emagrecer', 'nao consigo emagrecer', 'sobrepeso'],
      resumo: 'Peso é assunto clínico, não moral. A consulta olha o que sustenta o ganho — sono, medicação em uso, tireoide, humor, hormônios — e trata obesidade como a doença crônica que ela é, com plano de longo prazo.',
      grupos: [
        { area: 'Endocrinologia e metabolismo', causas: ['Obesidade', 'Sobrepeso', 'Síndrome metabólica', 'Hipotireoidismo', 'Diabetes mellitus tipo 2'] },
        { area: 'Ginecologia', causas: ['Síndrome dos ovários policísticos (SOP)', 'Menopausa e climatério'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno depressivo maior', 'Insônia e outros distúrbios do sono', 'Transtorno por uso de álcool', 'Esgotamento profissional (burnout)'] },
        { area: 'Saúde respiratória', causas: ['Apneia obstrutiva do sono', 'Tabagismo (cessação)'] }
      ]
    },

    'colica-menstrual': {
      sin: ['dismenorreia', 'colica', 'menstruacao dolorida', 'tpm', 'menstruacao irregular', 'sangramento'],
      resumo: 'Cólica que impede trabalhar ou estudar não é "normal de mulher": é sintoma a ser investigado e tratado. E ciclo irregular tem uma lista curta de causas que a consulta dá conta de percorrer.',
      grupos: [
        { area: 'Ginecologia e saúde da mulher', causas: ['Dismenorreia (cólica menstrual)', 'Síndrome da tensão pré-menstrual (SPM e TDPM)', 'Irregularidades do ciclo menstrual', 'Sangramento uterino anormal', 'Amenorreia', 'Síndrome dos ovários policísticos (SOP)', 'Doença inflamatória pélvica', 'Planejamento familiar (anticoncepcionais, inserção de DIU)'] },
        { area: 'Gastroenterologia', causas: ['Síndrome do intestino irritável', 'Constipação intestinal'] },
        { area: 'Urologia', causas: ['Infecção do trato urinário inferior (cistite)'] }
      ]
    },

    'corrimento': {
      sin: ['corrimento vaginal', 'secrecao', 'odor vaginal', 'coceira vaginal', 'ardencia vaginal'],
      resumo: 'Três quadros explicam quase todos os corrimentos, e o tratamento de cada um é diferente — por isso o autotratamento de farmácia erra tanto. Dá para diagnosticar e tratar na mesma consulta, e testar ISTs junto quando faz sentido.',
      grupos: [
        { area: 'Ginecologia e saúde da mulher', causas: ['Candidíase vaginal', 'Vaginose bacteriana', 'Tricomoníase', 'Doença inflamatória pélvica', 'Rastreamento de câncer de colo de útero (papanicolau)'] },
        { area: 'Doenças infecciosas', causas: ['Gonorreia', 'Clamídia', 'Sífilis', 'Infecção pelo HIV (diagnóstico, aconselhamento, PrEP e PEP)'] }
      ],
      alerta: 'Corrimento com febre, dor pélvica forte ou dor durante a relação pode ser <strong>doença inflamatória pélvica</strong>: tratar cedo protege a fertilidade.'
    },

    'ardencia-para-urinar': {
      sin: ['dor para urinar', 'infeccao urinaria', 'cistite', 'urina ardendo', 'urinar muito', 'vontade de urinar', 'sangue na urina'],
      resumo: 'Cistite em mulher jovem e sem complicadores pode ser diagnosticada e tratada na própria consulta, sem exame de urina. Em homem, criança ou nas repetições, a regra muda — e a investigação vai além da bexiga.',
      grupos: [
        { area: 'Urologia e saúde do homem', causas: ['Infecção do trato urinário', 'Prostatite', 'Hiperplasia prostática benigna (HPB)', 'Litíase renal (cólica nefrética não complicada)', 'Incontinência urinária', 'Balanopostite'] },
        { area: 'Ginecologia', causas: ['Infecção do trato urinário inferior (cistite)', 'Candidíase vaginal', 'Vaginose bacteriana', 'Menopausa e climatério'] },
        { area: 'Doenças infecciosas', causas: ['Gonorreia', 'Clamídia', 'Tricomoníase'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Diabetes mellitus tipo 2'] }
      ],
      alerta: 'Febre alta, dor nas costas e vômito junto da ardência sugerem infecção que subiu para o rim: <strong>avaliação no mesmo dia</strong>.'
    },

    'dificuldade-de-erecao': {
      sin: ['disfuncao eretil', 'impotencia', 'libido baixa', 'ejaculacao precoce', 'sem desejo', 'brochar'],
      resumo: 'Disfunção erétil é, com frequência, o <strong>primeiro aviso</strong> de um problema vascular — as artérias do pênis são mais finas que as do coração e reclamam antes. É um dos assuntos em que a consulta rende mais do que a pessoa espera.',
      grupos: [
        { area: 'Urologia e saúde do homem', causas: ['Disfunção erétil', 'Ejaculação precoce', 'Hiperplasia prostática benigna (HPB)', 'Prostatite', 'Varicocele (diagnóstico inicial)'] },
        { area: 'Cardiovascular', causas: ['Doença isquêmica do coração', 'Hipertensão arterial sistêmica', 'Dislipidemias'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Diabetes mellitus tipo 2', 'Obesidade e sobrepeso', 'Síndrome metabólica', 'Hipotireoidismo'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno depressivo maior', 'Transtorno de ansiedade generalizada (TAG)', 'Transtorno por uso de álcool', 'Dependência de tabaco e outras drogas'] }
      ]
    },

    'esquecimento': {
      sin: ['memoria', 'esquecendo as coisas', 'demencia', 'falta de concentracao', 'tdah', 'desatencao', 'memoria fraca'],
      resumo: 'Esquecer onde deixou a chave é diferente de esquecer para que serve a chave. A consulta aplica testes simples que separam queixa de memória por ansiedade, depressão e sono do declínio cognitivo de verdade — e trata as causas reversíveis primeiro.',
      grupos: [
        { area: 'Neurologia', causas: ['Rastreio e acompanhamento inicial de demências', 'Doença de Alzheimer (diagnóstico inicial e suporte à família)', 'Doença de Parkinson', 'Acidente vascular cerebral (prevenção e reabilitação)'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Transtorno de déficit de atenção e hiperatividade (TDAH)', 'Transtorno depressivo maior', 'Transtorno de ansiedade generalizada (TAG)', 'Insônia e outros distúrbios do sono', 'Esgotamento profissional (burnout)', 'Transtorno por uso de álcool'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipotireoidismo', 'Deficiências vitamínicas (vitamina B12)'] },
        { area: 'Saúde respiratória', causas: ['Apneia obstrutiva do sono'] }
      ]
    },

    'dor-de-ouvido': {
      sin: ['ouvido', 'zumbido', 'ouvido entupido', 'otite', 'cera no ouvido', 'ouvido tampado', 'surdez'],
      resumo: 'Ouvido entupido com cera se resolve na hora, no consultório, com lavagem. Dor de ouvido em adulto, sem alteração no exame, costuma vir de outro lugar — garganta, mandíbula ou dente.',
      grupos: [
        { area: 'Oftalmologia e otorrino', causas: ['Otite externa', 'Cerúmen impactado (rolha de cera — inclui a lavagem de ouvido)', 'Labirintite'] },
        { area: 'Pediatria', causas: ['Otite média aguda'] },
        { area: 'Saúde respiratória', causas: ['Rinossinusite aguda e crônica', 'Rinite alérgica', 'Faringite', 'Amigdalite'] },
        { area: 'Cardiovascular', causas: ['Hipertensão arterial sistêmica'] }
      ],
      alerta: 'Perda súbita de audição de um ouvido só é <strong>urgência</strong> otorrinolaringológica — o tratamento precoce muda o resultado.'
    },

    'olho-vermelho': {
      sin: ['conjuntivite', 'tercol', 'olho irritado', 'olho seco', 'olho lacrimejando', 'olho inchado'],
      resumo: 'Olho vermelho sem dor e sem queda de visão é quase sempre benigno e se resolve com medida simples. A combinação vermelho + dor + visão embaçada é que acende a luz e pede oftalmologista rápido.',
      grupos: [
        { area: 'Oftalmologia e otorrino', causas: ['Conjuntivite (viral, bacteriana, alérgica)', 'Hordéolo (terçol)', 'Calázio', 'Olho seco', 'Blefarite'] },
        { area: 'Dermatologia', causas: ['Dermatite seborreica', 'Herpes simples', 'Herpes zoster', 'Rosácea'] },
        { area: 'Saúde respiratória', causas: ['Rinite alérgica'] }
      ],
      alerta: 'Olho vermelho <strong>com dor forte, queda da visão ou sensibilidade à luz</strong> precisa de avaliação oftalmológica no mesmo dia.'
    },

    'pernas-inchadas': {
      sin: ['edema', 'perna inchada', 'pe inchado', 'varizes', 'inchaco', 'tornozelo inchado'],
      resumo: 'Inchaço nas duas pernas, que piora ao fim do dia, costuma ser circulação venosa, peso ou medicação. Em uma perna só, a lógica é outra e a pressa é maior.',
      grupos: [
        { area: 'Cardiovascular', causas: ['Insuficiência venosa crônica', 'Varizes dos membros inferiores', 'Insuficiência cardíaca (fases iniciais e pacientes estáveis)', 'Hipertensão arterial sistêmica'] },
        { area: 'Dermatologia', causas: ['Erisipela', 'Celulite'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Hipotireoidismo', 'Obesidade e sobrepeso', 'Desnutrição'] }
      ],
      alerta: 'Inchaço em <strong>uma perna só</strong>, com dor na panturrilha, calor e vermelhidão, pode ser trombose: avaliação de urgência.'
    },

    'ronco': {
      sin: ['apneia', 'ronco alto', 'para de respirar dormindo', 'sono nao descansa', 'sonolencia de dia'],
      resumo: 'Ronco alto com pausas na respiração e sono que não descansa é apneia até prova em contrário — e apneia não tratada puxa pressão alta, arritmia e acidente de trânsito atrás dela. O rastreio é feito em consulta, com questionário validado.',
      grupos: [
        { area: 'Saúde respiratória', causas: ['Apneia obstrutiva do sono (rastreio e manejo inicial)', 'Rinite alérgica', 'Rinossinusite crônica', 'Tabagismo (cessação)'] },
        { area: 'Endocrinologia e metabolismo', causas: ['Obesidade e sobrepeso', 'Hipotireoidismo', 'Síndrome metabólica'] },
        { area: 'Saúde mental e psiquiatria', causas: ['Insônia e outros distúrbios do sono', 'Transtorno por uso de álcool'] },
        { area: 'Cardiovascular', causas: ['Hipertensão arterial sistêmica', 'Arritmias benignas'] }
      ]
    },

    'crianca-doente': {
      sin: ['meu filho', 'bebe', 'crianca com febre', 'puericultura', 'vacina', 'pediatria', 'crianca doente'],
      resumo: 'O médico de família acompanha a criança desde o nascimento — crescimento, vacina, alimentação — e é quem conhece a casa inteira. Isso muda a conversa quando a criança adoece: não se começa do zero a cada consulta.',
      grupos: [
        { area: 'Pediatria (saúde da criança)', causas: ['Acompanhamento de crescimento e desenvolvimento (puericultura)', 'Orientações de amamentação e introdução alimentar', 'Calendário vacinal', 'Febre a esclarecer em crianças', 'Otite média aguda', 'Bronquiolite', 'Crupe (laringotraqueobronquite)', 'Diarreia aguda infantil', 'Asma infantil', 'Dermatite das fraldas', 'Parasitoses'] },
        { area: 'Doenças exantemáticas', causas: ['Sarampo', 'Rubéola', 'Roséola', 'Eritema infeccioso', 'Varicela'] }
      ],
      alerta: 'Bebê com menos de 3 meses e febre, criança gemente, que não acorda direito, com manchas roxas, dificuldade para respirar ou sem urinar: <strong>pronto-socorro</strong>.'
    }
  };

  /* ----------------------------------------------------------
     Elementos
     ---------------------------------------------------------- */
  const nuvem = secao.querySelector('[data-nuvem]');
  const palavras = Array.from(secao.querySelectorAll('.sint-palavra'));
  const campo = secao.querySelector('[data-busca]');
  const limpar = secao.querySelector('[data-limpar]');
  const resultados = secao.querySelector('[data-resultados]');
  const painel = secao.querySelector('[data-painel]');
  if (!palavras.length || !campo || !painel) return;

  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // no celular o exemplo do placeholder não cabe e fica cortado pela metade
  const estreito = window.matchMedia('(max-width: 640px)');
  const ajustarDica = () => {
    campo.placeholder = estreito.matches
      ? 'Pesquise o que você está sentindo'
      : 'Pesquise o que você está sentindo — ex.: dor de cabeça';
  };
  ajustarDica();
  estreito.addEventListener('change', ajustarDica);

  // índice de busca: nome visível + sinônimos
  const CATALOGO = palavras.map((btn) => {
    const id = btn.dataset.sintoma;
    const ficha = FICHAS[id] || {};
    return {
      id: id,
      nome: btn.textContent.trim(),
      botao: btn,
      chaves: [btn.textContent.trim()].concat(ficha.sin || []).map(normalizar)
    };
  });

  function normalizar(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function escapar(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ----------------------------------------------------------
     Painel — monta, abre, remonta e recolhe
     ---------------------------------------------------------- */
  let aberto = null;     // id do sintoma aberto
  let trocando = false;
  // palavra clicada enquanto uma troca estava em andamento (ver abrir())
  let pedido = null;

  function montar(id) {
    const ficha = FICHAS[id];
    const alvo = CATALOGO.find((c) => c.id === id);
    if (!ficha || !alvo) return '';

    const grupos = ficha.grupos.map((g) => (
      '<div class="sint-grupo">' +
      '<span class="sint-grupo__area">' + escapar(g.area) + '</span>' +
      '<ul>' + g.causas.map((c) => '<li>' + escapar(c) + '</li>').join('') + '</ul>' +
      '</div>'
    )).join('');

    const alerta = ficha.alerta
      ? '<div class="sint-alerta">' +
        '<span class="sint-alerta__icone"><i data-lucide="triangle-alert" style="width:19px;height:19px"></i></span>' +
        '<p><strong>Sinais de alerta.</strong> ' + ficha.alerta + '</p>' +
        '</div>'
      : '';

    return (
      '<div class="sint-ficha">' +
        '<div class="sint-ficha__topo">' +
          '<div>' +
            '<span class="sint-ficha__rotulo"><i data-lucide="search-check" style="width:13px;height:13px"></i>Possíveis causas</span>' +
            '<h3 class="h3 sint-ficha__nome">' + escapar(alvo.nome) + '</h3>' +
          '</div>' +
          '<button class="sint-ficha__recolher" type="button" data-recolher>' +
            '<i data-lucide="chevron-up" style="width:15px;height:15px"></i>Recolher' +
          '</button>' +
        '</div>' +
        '<p class="sint-ficha__resumo">' + ficha.resumo + '</p>' +
        '<div class="sint-grupos">' + grupos + '</div>' +
        alerta +
        '<div class="sint-ficha__pe">' +
          '<p>Esta lista mostra o que costuma estar por trás do sintoma — não é diagnóstico. Quem fecha o diagnóstico é a consulta, com a sua história inteira.</p>' +
          '<a class="btn btn--primary" href="https://calendly.com/caio-melki" target="_blank" rel="noopener">' +
            '<span class="btn__shine"></span>Agendar consulta' +
            '<i data-lucide="arrow-right" class="btn__arrow" style="width:15px;height:15px"></i>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function caixa() {
    let c = painel.querySelector('.sint-painel__caixa');
    if (!c) {
      c = document.createElement('div');
      c.className = 'sint-painel__caixa';
      painel.appendChild(c);
    }
    return c;
  }

  function icones() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  // cursor.js só varre a página uma vez, no load; o que nasce depois
  // (a ficha, os resultados) precisa se apresentar ao anel
  const anel = document.querySelector('.cursor-outline');
  function armarCursor(raiz) {
    if (!anel) return;
    raiz.querySelectorAll('a, button').forEach((el) => {
      if (el.dataset.anel) return;
      el.dataset.anel = '1';
      el.addEventListener('mouseenter', () => anel.classList.add('hovered'));
      el.addEventListener('mouseleave', () => anel.classList.remove('hovered'));
    });
  }

  function medir() {
    const c = caixa();
    return c.getBoundingClientRect().height;
  }

  function marcar(id) {
    palavras.forEach((p) => {
      const ativa = p.dataset.sintoma === id;
      p.classList.toggle('is-ativa', ativa);
      p.setAttribute('aria-expanded', ativa ? 'true' : 'false');
    });
  }

  function abrir(id, origem) {
    // Durante a troca (200ms) o clique era simplesmente descartado: quem
    // navegava clicando de palavra em palavra via a ficha parar numa que
    // nao era a que clicou. Agora o ultimo pedido fica guardado e e
    // atendido assim que a troca em curso termina.
    if (trocando) { pedido = { id: id, origem: origem }; return; }

    // mesma palavra: funciona como toggle
    if (aberto === id) { recolher(); return; }

    const c = caixa();
    const jaAberto = aberto !== null;

    const pintar = () => {
      c.innerHTML = montar(id);
      icones();
      armarCursor(c);
      aberto = id;
      marcar(id);
      painel.setAttribute('aria-hidden', 'false');
      painel.classList.add('is-open');
      // altura explícita para a transição e depois solta, para o conteúdo
      // poder crescer sozinho (imagem, quebra de linha em outro zoom)
      painel.style.height = medir() + 'px';
      let soltou = false;
      const soltar = () => {
        if (soltou) return;
        soltou = true;
        painel.removeEventListener('transitionend', aoTransicionar);
        if (aberto === id) painel.style.height = 'auto';
      };
      const aoTransicionar = (e) => {
        // opacity da caixa também borbulha até aqui; só a altura interessa
        if (e.propertyName !== 'height' || e.target !== painel) return;
        soltar();
      };
      if (semMovimento) { painel.style.height = 'auto'; }
      else {
        painel.addEventListener('transitionend', aoTransicionar);
        // Rede de segurança: se o transitionend não disparar por qualquer
        // motivo (troca rápida de palavra, aba em segundo plano, o que
        // for), a altura ficava travada num valor medido só naquele
        // instante — e qualquer coisa que mude a altura de verdade depois
        // (a fonte do Google terminando de trocar, um ícone carregando)
        // deixava uma sobra de espaço em branco embaixo da ficha, sem
        // nunca mais se corrigir sozinha. Isso soltava para 'auto' de
        // qualquer jeito, um pouco depois da duração da transição.
        window.setTimeout(soltar, 550);
      }

      if (origem === 'busca') fecharResultados();
      if (origem !== 'scroll-off') aproximar();
      trocando = false;

      // atende o clique que chegou no meio da troca, se houve
      if (pedido) {
        const proximo = pedido;
        pedido = null;
        abrir(proximo.id, proximo.origem);
      }
    };

    if (!jaAberto) { pintar(); return; }

    // já havia uma ficha: recolhe e abre a nova no mesmo gesto —
    // trava a altura atual, apaga o conteúdo, troca e mede de novo
    trocando = true;
    painel.style.height = medir() + 'px';
    painel.classList.remove('is-open');
    void painel.offsetHeight;
    window.setTimeout(pintar, semMovimento ? 0 : 200);
  }

  function recolher() {
    if (aberto === null) return;
    painel.style.height = medir() + 'px';
    void painel.offsetHeight;
    painel.classList.remove('is-open');
    painel.style.height = '0px';
    painel.setAttribute('aria-hidden', 'true');
    aberto = null;
    marcar(null);
    window.setTimeout(() => { if (aberto === null) caixa().innerHTML = ''; }, semMovimento ? 0 : 480);
  }

  function aproximar() {
    const topo = painel.getBoundingClientRect().top;
    // "fora de vista" em cima = escondido atras da barra fixa, nao so acima
    // da janela. Por isso o limite e a borda de baixo real da barra, medida
    // na hora: ela nao tem altura fixa (ja medi 83px e 105px na mesma pagina).
    const barra = document.querySelector('.navbar');
    const limite = barra ? barra.getBoundingClientRect().bottom : 0;

    // A secao esta sempre com overflow:hidden (recorta as auroras de fundo),
    // e isso a torna uma area rolavel: "hidden" esconde a barra de rolagem,
    // mas o navegador ainda rola por programa. Se ela tiver sido rolada por
    // dentro alguma vez, o conteudo fica escorregado pra cima e sobra um
    // vazio embaixo. Desfaz isso antes de qualquer conta de posicao.
    if (secao.scrollTop) secao.scrollTop = 0;

    const fora = topo < limite || topo > window.innerHeight - 160;
    if (!fora) return;

    // NAO usar scrollIntoView aqui. Ele sobe pela arvore e rola TODOS os
    // ancestrais rolaveis — inclusive a propria secao, pelo overflow:hidden
    // acima. Era exatamente isso que fazia o titulo sumir e aparecer um
    // espaco grande no fim da secao, piorando a cada clique. Rolando a
    // janela pela posicao calculada, so a pagina se move.
    const alvo = window.scrollY + painel.getBoundingClientRect().top - (limite + 16);
    window.scrollTo({ top: Math.max(0, alvo), behavior: semMovimento ? 'auto' : 'smooth' });
  }

  /* ----------------------------------------------------------
     Nuvem
     ---------------------------------------------------------- */
  palavras.forEach((btn) => {
    btn.addEventListener('click', () => abrir(btn.dataset.sintoma, 'nuvem'));
  });

  painel.addEventListener('click', (e) => {
    if (e.target.closest('[data-recolher]')) recolher();
  });

  /* ----------------------------------------------------------
     Busca
     ---------------------------------------------------------- */
  let achados = [];
  let foco = -1;

  function filtrarNuvem(termo) {
    if (!nuvem) return;
    if (!termo) {
      nuvem.classList.remove('is-filtrando');
      palavras.forEach((p) => p.classList.remove('is-achada'));
      return;
    }
    nuvem.classList.add('is-filtrando');
    const ids = new Set(achados.map((a) => a.id));
    palavras.forEach((p) => p.classList.toggle('is-achada', ids.has(p.dataset.sintoma)));
  }

  function grifar(nome, termo) {
    const alvo = normalizar(nome);
    const i = alvo.indexOf(termo);
    if (i < 0) return escapar(nome);
    return escapar(nome.slice(0, i)) + '<mark>' + escapar(nome.slice(i, i + termo.length)) + '</mark>' + escapar(nome.slice(i + termo.length));
  }

  function buscar(termoCru) {
    const termo = normalizar(termoCru);
    if (termo.length < 2) { achados = []; return achados; }

    achados = CATALOGO
      .map((item) => {
        const direto = item.chaves[0].indexOf(termo);
        if (direto === 0) return { item: item, nota: 0, via: null };
        if (direto > 0) return { item: item, nota: 1, via: null };
        // casou por sinônimo: mostra qual palavra levou até ali
        const sin = item.chaves.slice(1).find((k) => k.indexOf(termo) >= 0);
        if (sin) return { item: item, nota: 2, via: sin };
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.nota - b.nota)
      .slice(0, 8)
      .map((r) => ({ id: r.item.id, nome: r.item.nome, via: r.via, termo: termo }));

    return achados;
  }

  function pintarResultados(termoCru) {
    if (!resultados) return;
    const termo = normalizar(termoCru);

    if (termo.length < 2) { fecharResultados(); return; }

    if (!achados.length) {
      resultados.innerHTML =
        '<div class="sint-vazio">' +
        '<p>Não achei esse termo na lista — o que não quer dizer que não seja comigo.</p>' +
        '<p>A medicina de família cobre cerca de 90% dos problemas de saúde do dia a dia. Se está sentindo algo, vale a consulta.</p>' +
        '</div>';
    } else {
      resultados.innerHTML = achados.map((r, i) => (
        '<button class="sint-res" type="button" role="option" data-ir="' + r.id + '" data-i="' + i + '">' +
        '<span class="sint-res__nome">' + grifar(r.nome, termo) + '</span>' +
        (r.via ? '<span class="sint-res__via">via "' + escapar(r.via) + '"</span>' : '') +
        '</button>'
      )).join('');
    }

    icones();
    armarCursor(resultados);
    resultados.classList.add('is-open');
    campo.setAttribute('aria-expanded', 'true');
    foco = -1;
  }

  function fecharResultados() {
    if (!resultados) return;
    resultados.classList.remove('is-open');
    campo.setAttribute('aria-expanded', 'false');
    foco = -1;
  }

  function moverFoco(passo) {
    const itens = Array.from(resultados.querySelectorAll('.sint-res'));
    if (!itens.length) return;
    foco = (foco + passo + itens.length) % itens.length;
    itens.forEach((el, i) => el.classList.toggle('is-active', i === foco));
    itens[foco].scrollIntoView({ block: 'nearest' });
  }

  campo.addEventListener('input', () => {
    const v = campo.value;
    if (limpar) limpar.classList.toggle('is-visivel', v.length > 0);
    buscar(v);
    filtrarNuvem(normalizar(v).length >= 2 ? normalizar(v) : '');
    pintarResultados(v);
  });

  campo.addEventListener('focus', () => { if (achados.length) pintarResultados(campo.value); });

  campo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moverFoco(1); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); moverFoco(-1); return; }
    if (e.key === 'Escape') { fecharResultados(); campo.blur(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      const itens = Array.from(resultados.querySelectorAll('.sint-res'));
      const alvo = foco >= 0 ? itens[foco] : itens[0];
      if (alvo) abrir(alvo.dataset.ir, 'busca');
    }
  });

  if (resultados) {
    resultados.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-ir]');
      if (btn) abrir(btn.dataset.ir, 'busca');
    });
  }

  if (limpar) {
    limpar.addEventListener('click', () => {
      campo.value = '';
      limpar.classList.remove('is-visivel');
      achados = [];
      filtrarNuvem('');
      fecharResultados();
      campo.focus();
    });
  }

  document.addEventListener('click', (e) => {
    if (!secao.contains(e.target)) fecharResultados();
    else if (!e.target.closest('.sint-busca')) fecharResultados();
  });

  /* ----------------------------------------------------------
     Aura que segue o mouse
     Mesmo lerp da referência: a cada quadro a luz anda 10% da
     distância que falta, o que dá o arrasto em vez de grudar no
     cursor. O laço só roda enquanto há distância a percorrer.
     ---------------------------------------------------------- */
  (function () {
    const luz = secao.querySelector('[data-aura]');
    if (!luz) return;

    let alvoX = null, alvoY = null, x = null, y = null, quadro = null;

    function pintar() {
      // a coordenada vive no <section>: a camada de luz e a das palavras
      // escondidas leem a mesma variavel e nunca se desencontram
      secao.style.setProperty('--aura-mx', x.toFixed(1) + 'px');
      secao.style.setProperty('--aura-my', y.toFixed(1) + 'px');
    }

    function passo() {
      x += (alvoX - x) * 0.1;
      y += (alvoY - y) * 0.1;
      pintar();
      quadro = (Math.abs(alvoX - x) > 0.5 || Math.abs(alvoY - y) > 0.5)
        ? requestAnimationFrame(passo)
        : null;
    }

    secao.addEventListener('mousemove', (e) => {
      const r = secao.getBoundingClientRect();
      alvoX = e.clientX - r.left;
      alvoY = e.clientY - r.top;
      // quem pediu menos movimento não quer um facho perseguindo o cursor:
      // a luz vai direto para o ponto, sem o arrasto
      if (semMovimento) { x = alvoX; y = alvoY; pintar(); return; }
      if (x === null) { x = alvoX; y = alvoY; }
      if (quadro === null) quadro = requestAnimationFrame(passo);
    }, { passive: true });

    secao.addEventListener('mouseenter', () => secao.classList.add('is-aura'));
    secao.addEventListener('mouseleave', () => secao.classList.remove('is-aura'));
  })();

  // o painel fica com height: auto depois de aberto; se a janela muda de
  // largura o conteúdo se reorganiza sozinho, sem precisar remedir
  window.addEventListener('resize', () => {
    if (aberto !== null) painel.style.height = 'auto';
  }, { passive: true });
})();
