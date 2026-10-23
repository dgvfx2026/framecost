# Validação — revisão 2, 23/10/2026

## Testes automatizados

npm run build: **80 testes aprovados, zero falhas**, sintaxe de sete módulos aprovada e arquivos/importações de dist verificados. O teste nativo roda diretamente em Node, sem subprocesso de teste.

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
