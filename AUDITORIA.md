# Auditoria de preços e cálculos — revisão 2

Consulta: 23/10/2026. Valores representam as páginas públicas carregadas nessa data. Não foi feito checkout nem verificação de elegibilidade em contas autenticadas. Magnific foi consultada na região brasileira, em BRL; os demais preços estão em USD. Não são garantidos preços futuros ou de outras regiões.

## Erros corrigidos

| Problema | Comportamento corrigido |
| --- | --- |
| O resumo usava o resultado mais barato após cada mudança, trocando plataforma e plano silenciosamente | Plano em foco explícito e fixo; mudança de resolução não muda o fornecedor |
| Planos anuais e mensais apareciam juntos | Um único ciclo por comparação, com equivalente mensal e cobrança integral identificados |
| Faltavam planos mensais Magnific; créditos eram incompletos | Ambos os ciclos cadastrados e alocações auditadas separadamente |
| Higgsfield dependia de referência editorial; SJinn dependia de inferência de desconto | Preços obtidos das páginas dinâmicas após alternar Monthly/Yearly |
| Cotações de 4s/5s eram tratadas como blocos para outras durações | Tarifas por segundo substituem os blocos quando publicadas; cotações isoladas não são extrapoladas |
| Divisão gulosa 31s → 30s + 4s cobrava duração desnecessária | 31s → 27s + 4s; 61s → 30s + 27s + 4s |
| Tarifa manual podia herdar uma regra nativa de outro plano | A regra do plano manual tem prioridade e exige correspondência exata |
| Ordenar pagamento usava tentativas personalizadas, embora a coluna mostrasse 1x | Ordenação usa o pagamento da mesma execução exibida |
| Custo projetado além do saldo parecia confirmado | ≈ visível, pagamento pendente sem recarga auditada e ausência de selo de menor custo |

## Assinaturas conferidas

| Plataforma / plano | Mensal: cobrança | Anual: equivalente por mês | Cobrança anual integral | Créditos: mensal / anual |
| --- | --- | --- | --- | --- |
| magnific / Premium | R$ 80,00 | R$ 29,50 | R$ 354,00 | 20.000/mês / 240.000/ano |
| magnific / Premium+ | R$ 180,00 | R$ 135,00 | R$ 1.620,00 | 45.000/mês / 600.000/ano |
| magnific / Pro Starter | R$ 440,00 | R$ 330,00 | R$ 3.960,00 | 112.500/mês / 1.500.000/ano |
| runway / Standard | US$ 15,00 | US$ 12,00 | US$ 144,00 | 625/mês / 625/mês |
| runway / Pro | US$ 35,00 | US$ 28,00 | US$ 336,00 | 2.250/mês / 2.250/mês |
| runway / Max | US$ 95,00 | US$ 76,00 | US$ 912,00 | 9.500/mês / 9.500/mês |
| higgsfield / Starter | US$ 15,00 | US$ 15,00 | US$ 180,00 | 200/mês / 200/mês |
| higgsfield / Plus | US$ 49,00 | US$ 39,00 | US$ 468,00 | 1.000/mês / 1.000/mês |
| higgsfield / Ultra | US$ 129,00 | US$ 99,00 | US$ 1.188,00 | 3.000/mês / 3.000/mês |
| krea / Basic | US$ 9,00 | US$ 5,25 | US$ 63,00 | 5.000/mês / 5.000/mês |
| krea / Pro | US$ 35,00 | US$ 21,00 | US$ 252,00 | 20.000/mês / 20.000/mês |
| krea / Max | US$ 105,00 | US$ 63,00 | US$ 756,00 | 60.000/mês / 60.000/mês |
| krea / Business | US$ 200,00 | US$ 160,00 | US$ 1.920,00 | 80.000/mês / 80.000/mês |
| sjinn / Lite | US$ 9,90 | US$ 6,00 | US$ 72,00 | 8.000/mês / 8.000/mês |
| sjinn / Standard | US$ 19,90 | US$ 12,00 | US$ 144,00 | 20.000/mês / 20.000/mês |
| sjinn / Pro | US$ 49,90 | US$ 30,00 | US$ 360,00 | 60.000/mês / 60.000/mês |
| sjinn / Ultra | US$ 99,00 | US$ 60,00 | US$ 720,00 | 120.000/mês / 120.000/mês |
| sjinn / Enterprise | US$ 999,00 | US$ 720,00 | US$ 8.640,00 | 1.200.000/mês / 1.200.000/mês |


O Premium anual Magnific é promoção até **26/10/2026**. Depois disso, deixa de ser elegível para nova contratação com esse preço; assinatura já paga continua utilizável pelo saldo informado. Renovação promocional não confirmada. As alocações anuais Magnific são disponibilizadas no período anual. Nas demais plataformas, créditos continuam mensais mesmo na assinatura anual. A interface usa “créditos” como unidade genérica; Krea chama suas unidades de units.

Fontes: [Magnific](https://www.magnific.com/pricing), [alocações Magnific](https://www.magnific.com/ai/docs/plans-and-pricing), [Runway](https://runway.com/pricing), [Higgsfield](https://higgsfield.ai/pricing), [Krea](https://www.krea.ai/pricing), [SJinn](https://sjinn.ai/pricing). Em Krea, Basic anual usa US$ 5,25/mês da tabela detalhada, apesar do card arredondado para US$ 5.

## Tarifas e durações

| Plataforma / modelo | Créditos por segundo: resolução | Duração e condição |
| --- | --- | --- |
| Magnific Seedance 2 | 480p 145; 720p 280; 1080p 700 | 4–15s; sem vídeo de referência |
| Magnific Seedance 2.5 | 480p 200; 720p 440; 1080p 1.100 | 4–30s; padrão, separado de Draft |
| Magnific Kling 3 | 720p Standard 70; 1080p Pro 90 | Sem áudio; 5–15s auditados; abaixo de 5s fica pendente |
| Magnific Wan 3 | 480p 60; **780p** 120; 1080p 240 | 2–30s; 780p mantido literalmente como publicado |
| Runway Seedance 2 | 480p 36; 720p 36; 1080p 40 | 5–15s; guia e exemplo de 4s divergem, então 4s fica pendente |
| Runway Seedance 2.5 | 480p 20; 720p 30; 1080p 68 | 4–30s; sem vídeo de referência |

Fontes: [créditos Magnific](https://www.magnific.com/ai/docs/ai-video-generator-credits), [limites Magnific](https://www.magnific.com/blog/ai-video-length/), [Seedance 2.5 Magnific](https://www.magnific.com/seedance/seedance-2-5), [Kling e áudio](https://www.magnific.com/ai/kling), [Wan Magnific](https://www.magnific.com/wan-3-0), [Runway Academy](https://academy.runwayml.com/models-pricing), [Runway Seedance 2](https://help.runwayml.com/hc/en-us/articles/50488490233363-Creating-with-Seedance-2-0), [Runway Seedance 2.5](https://help.runwayml.com/hc/en-us/articles/53542207042323-Creating-with-Seedance-2-5).

Higgsfield, nos planos Plus/Ultra: Wan 3 possui cotação de 5s de 5/8,75/17,5 créditos em 480p/720p/1080p; Prime, 7,5/15/30. Kling 4 possui 5s = 25/37,5 e 30s = 150/225 créditos em 720p/1080p. Somente estas durações são calculadas. Acima do máximo de 30s de Kling 4, todos os segmentos devem ter cotação: 35s → 30s + 5s; 34s fica pendente. [Tabela Higgsfield](https://higgsfield.ai/pricing), [Kling 4](https://higgsfield.ai/blog/kling-4-0-on-higgsfield).

## Casos reproduzíveis

Magnific Premium **mensal**, R$ 80 por 20.000 créditos, Seedance 2.5, **8s**, uma execução, sem saldo próprio:

| Resolução | Créditos | Custo atribuído ao vídeo |
| --- | --- | --- |
| 480p | 1.600 | R$ 6,40 |
| 720p | 3.520 | R$ 14,08 |
| 1080p | 8.800 | R$ 35,20 |

Pagamento inicial em cada caso: R$ 80 pela mensalidade inteira, separado do consumo econômico. No Premium anual promocional, os mesmos 8s/720p consomem 3.520 créditos, custam R$ 5,192 por rateio de R$ 354/240.000 e exigem R$ 354 para contratar o ano.

Runway Pro **mensal**, US$ 35/2.250 créditos, Seedance 2.5 de 8s: 480p = 160 créditos e US$ 2,488888…; 1080p = 544 créditos e US$ 8,462222…. O mesmo plano permanece selecionado.

Magnific Premium mensal, Seedance 2.5/720p de **31s**: 27s + 4s, 13.640 créditos, R$ 54,56. A divisão anterior cobrava 34s, 14.960 créditos e R$ 59,84, excesso de R$ 5,28.

Projeto com 8 cenas de 8s, 5 execuções por cena, Seedance 2.5/720p no Premium mensal: base 140.800 créditos, reserva de 20% = 28.160, total 168.960. Custo por rateio R$ 675,84 e venda com margem 40% R$ 1.126,40, sem operação/provisão. **Esse custo além do saldo de 20.000 é estimado; pagamento fica a confirmar porque a recarga Magnific não foi auditada.** Não se apresenta o rateio como um pacote contratável por esse preço.

## Dados pendentes e aproximações

- Krea e SJinn: assinatura confirmada, consumo exato por versão/resolução/duração pendente. Contagens aproximadas de vídeos não viram tarifa.
- Wan Prime Magnific (atualização 1.1.1): automático habilitado em 2–30s. O artigo oficial confirma as mesmas especificações de Wan 3; a página do modelo informa 2–30s. Consumo 100/200/400 créditos/s em 480p/780p/1080p, pela central de créditos atual. O artigo de lançamento possui preços diferentes; essa divergência continua registrada.
- Wan 3 Runway (atualização 1.1.2): 5/10/20 créditos/s em 480p/720p/1080p e duração 2–30s conferida no app; automático habilitado. Prime também habilitado com 6,8/14/28 créditos/s, cotações de 5s e limites conferidos no app.
- Kling 4 Magnific: apenas 840 créditos/3s em 1080p disponíveis como referência. Não extrapolado para 4s, 8s ou outros clipes; a versão 1.1.1 permite calcular a cotação de 3s e exibe um atalho explícito, preservando o plano.
- Higgsfield Seedance 2 e Kling 3: a tabela usa ~ para valores de 5s; são aproximações optativas e não são extrapoladas. Starter não herda compatibilidade do Plus/Ultra.
- Seedance 2.5 Magnific: catálogo de preços lista o modelo, mas a página de lançamento ainda diz Coming soon. A disponibilidade individual permanece sujeita à conta.
- Áudio, qualidade e uso de vídeo de referência são dimensões diferentes. Não inferimos custos de vídeo de entrada nem consideramos acesso ilimitado condicionado como custo zero.
- Preços não são coletados automaticamente em produção. A data da fonte e a condição promocional continuam visíveis; catálogo deve ser atualizado quando mudar.

## Prevenção de recorrência

Testes agora cobrem o catálogo real e a composição, além de fórmulas genéricas: ciclos separados, alocações específicas, mesmo plano em todas as resoluções, monotonicidade por plano, nenhuma substituição por outro fornecedor, cotações isoladas, limites pendentes, preço manual, duração 31s/61s/125s e consistência entre geração e projeto. A revisão deve conferir preços no site carregado com ambos os ciclos selecionados; testar apenas fórmulas não valida dados comerciais.

A versão 1.1.1 também corrige a digitação invertida e a escolha de resolução ao trocar modelo. Evidências e mudanças: [CORRECOES-1.1.1.md](CORRECOES-1.1.1.md).

Atualização Runway 1.1.2: Kling 3 com/sem áudio, Kling 4 em 1080p, Wan e Prime calculáveis nos planos Runway. A curva Kling 4 deriva das cotações nativas conferidas de 3 a 29s, com arredondamento por clipe. Veja [CORRECOES-1.1.2.md](CORRECOES-1.1.2.md).
