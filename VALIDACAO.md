# Validação — revisão 2, 23/10/2026

## Testes automatizados

npm run build: **94 testes aprovados, zero falhas**, sintaxe de sete módulos aprovada e arquivos/importações de dist verificados. O teste nativo roda diretamente em Node, sem subprocesso de teste.

Os 41 testes de motor cobrem custo, lotes, validade, saldo/déficit, planos mensais/anuais, recargas, cenas, reservas, operação, markup, margem, provisão e câmbio. Os 39 novos casos de regressão cobrem também preços e créditos reais do catálogo, isolamento de ciclos, plano em foco fixo, resolução, duração, cotações de referência, prioridade manual e ordenação pelo pagamento exibido.

Casos centrais: Magnific Premium mensal/Seedance 2.5/8s = R$ 6,40, R$ 14,08 e R$ 35,20 em 480p/720p/1080p; cena de 31s = 27s + 4s; 61s = 30s + 27s + 4s. Monotonicidade verificada para cada plano auditado Magnific/Runway, dois modelos, cinco durações e uma/três execuções. Asserções sobre dados comerciais são regressões do snapshot auditado, não substituem a consulta das fontes.

## Navegador local

Prévia HTTP 200. Verificações nos endereços locais 127.0.0.1:4173 e localhost:4173. O segundo foi usado com dados de teste separados para conferir o projeto padrão sem remover o estado persistente existente no primeiro.

- Troca 480p → 1080p mantém Magnific Premium mensal. Cartões de resolução mostram exatamente os três valores acima.
- Troca mensal → anual mantém família/plataforma e mostra R$ 29,50/mês equivalente, R$ 354/ano e 240.000 créditos anuais; retorno mensal mostra R$ 80 e 20.000 mensais.
- Runway Pro mensal/Seedance 2.5/8s em USD: 480p US$ 2,49; 720p US$ 3,73; 1080p US$ 8,46; o plano continua selecionado.
- Kling 4/8s no plano Runway continua pendente, sem fallback para outro fornecedor. Higgsfield Plus/5s/720p calcula 25 créditos e US$ 1,23.
- Cena 31s na interface gera 31s, custa R$ 54,56 e sinaliza o custo estimado de três execuções além do saldo.
- Projeto padrão novo: 8 cenas, 40 execuções, 320s gerados, 168.960 créditos com reserva, custo por rateio R$ 675,84 e venda R$ 1.126,40 com margem 40%. Pagamento de IA a confirmar e aviso de estimativa além do saldo presentes.
- Navegação das quatro seções funciona. Tabelas de assinaturas mostram separadamente ambos os ciclos, incluindo SJinn Standard mensal US$ 19,90 e Krea Basic anual US$ 5,25/mês equivalente.
- Migração do estado anterior apresenta aviso de revisão, preserva histórico e muda configuração ativa para mensal. Histórico salvo deve ser revisado pelo usuário.
- Console da prévia: nenhuma mensagem de erro ou aviso capturada durante os cenários executados. Câmbio Frankfurter retornou referência de 23/10/2026, 5,0465 BRL/USD; não é valor fixo do app.

Geração e projeto conferidos em viewports 1440×1000, 768×1000 e 375×1000 (áreas úteis 1425, 753 e 360 px pela barra de rolagem). Nenhuma rolagem horizontal do documento nos seis cenários. Capturas salvas na entrega. Comparação visual automatizada com baseline: **INCONCLUSIVA**, pois não há baseline versionada equivalente. Não foi feita medição de Core Web Vitals, auditoria axe/WCAG nem teste completo de teclado/leitor de tela.

## Escopo e publicação

Veredito funcional desta correção: **SHIP**, para os cenários descritos e com pendências comerciais explicitamente bloqueadas. A verificação visual de regressão permanece inconclusiva. Não representa auditoria completa de acessibilidade ou de todas as jornadas.

Exportação CSV/JSON e impressão permanecem implementadas. O CSV foi conferido na versão anterior; os downloads não foram repetidos nesta revisão. O indicador de custo estimado foi incluído no CSV. Não foram realizados compras, login nas plataformas, checkout, consulta de saldo real ou deploy na conta Vercel.

Preços de assinatura foram confrontados com páginas oficiais carregadas, incluindo alternância mensal/anual. Consumo e limites possuem fontes específicas. Quando a evidência é incompleta, o cálculo fica pendente; aproximações exigem ativação explícita. Veja AUDITORIA.md.

Vercel: npm run build valida a saída estática dist; configuração versionada, sem instalação/variáveis de ambiente. Publicação real depende da integração/configuração do projeto Vercel do usuário.

## Correção 1.1.1: Kling, Wan e digitação

Oito regressões automatizadas adicionais cobrem opções por plano, mudança de modelo, durações publicadas de Kling 4, acesso Higgsfield, tarifas e segmentação de Wan Prime. No navegador, digitação tecla a tecla validou 15 na duração, 15 no contador de execuções, edição intermediária 15 → 125, 15 na quantidade de cenas e 15.5 no valor operacional. Campos limpos permanecem presentes e focados durante a edição. Conferidos Kling 3 (8s/720p = 560 créditos), Wan 3 (8s/780p = 960), Wan Prime (8s/780p = 1.600) e Kling 4 Magnific (3s/1080p = 840), sempre no Premium mensal. Nenhum erro ou aviso capturado no console desses cenários. Veja CORRECOES-1.1.1.md para fontes e limites.

## Runway — versão 1.1.2

94 testes aprovados, incluindo 14 novos testes dedicados ao Runway. Asserções percorrem os quatro modelos, os seis planos mensais/anuais e durações de 4 a 125s; também conferem todas as 27 cotações nativas capturadas para Kling 4/1080p. A rotina que preserva digitação não foi modificada.

Na prévia isolada HTTP 200 (porta 4178), os quatro modelos foram selecionados no Runway Pro mensal, sem trocar de plataforma. Para 8s: Kling 3/720p sem áudio = 72 cr., US$ 1,12; Kling 4/1080p = 188 cr., US$ 2,92; Wan 3/720p = 80 cr., US$ 1,24; Prime/720p = 112 cr., US$ 1,74. Áudio em Kling 3 alterou os consumos para 104 e 136 créditos em 720p/1080p. Anual Pro manteve 2.250 créditos mensais e mostrou cobrança integral de US$ 336. Projeto com 8 cenas de Kling 4/8s, 3 tentativas, 20% de reserva e margem 40%: 5.414,4 créditos, custo US$ 66,64, venda US$ 111,07 e pagamento simulado US$ 75 com pacotes inteiros. Nenhum erro/aviso no console durante esses cenários.

As fontes e a limitação de preço 720p do Kling 4 estão em CORRECOES-1.1.2.md. O rodapé mostra a versão para conferir o novo deploy.

Após recarregar a versão final, a digitação sequencial de 15 manteve o campo focado e exibiu 15s no cálculo. Kling 4/8s/1080p foi conferido novamente no Runway Pro: 188 créditos e US$ 2,92 por execução, com três execuções por US$ 8,77. Registro visual salvo junto aos arquivos de entrega em framecost-runway-kling4-corrigido.png.

## Design 1.2.0

Tema atualizado a partir da referência enviada, nas quatro telas e nos diálogos. Conferência das quatro telas em 375, 768 e 1440px sem rolagem horizontal. Digitação sequencial de 15, seleção de modelos, áudio do Kling 3, moeda, plano e passagem de geração para projeto continuam funcionando. Os quatro modelos Runway mantiveram os custos da versão 1.1.2 no cenário testado. Acesso por teclado apresentou contorno de foco de 2px. O indicador circular usa o consumo real do mesmo cálculo da barra de saldo. Console sem erros ou avisos nos cenários observados. Detalhes e limites da verificação estão em DESIGN-1.2.0.md.

## Animações automáticas 1.3.0

Entradas, rolagem e vidro líquido funcionam automaticamente, sem botão ou leitura de preferência de ativação. Conferidas 12 combinações entre as quatro telas e as larguras 375/768/1440px, sem rolagem horizontal. Na abertura, alvos visíveis passaram a playing enquanto os elementos abaixo da tela permaneceram pending; ao rolar até o fim, nenhum alvo permaneceu pending. A navegação fixa no celular foi conferida visível após sua entrada. Digitar 15 manteve o foco em gen.duration, com o cabeçalho e os seis modelos em done e nenhum elemento repetindo a entrada naquele cenário. Os dois cards gravados na prévia apresentaram liquid-active ao receber o mouse. Diálogo de saldo abriu e fechou normalmente. Console sem erros/avisos nos cenários observados. O build valida oito módulos, os arquivos de motion e os 94 testes existentes. Ver ANIMACOES-1.3.0.md.
