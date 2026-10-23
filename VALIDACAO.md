# Validação — 23/10/2026

## Automatizada

`npm test`: **41 testes aprovados, 0 falhas**. Fixtures fictícias estão identificadas no arquivo de testes e não alimentam o catálogo comercial.

Cobertura: custo unitário, custo de geração, arredondamento, limites por clipe, duração acima de 60s, tarifas de blocos/predefinidas, três execuções, capacidade, saldo/déficit, planos diferentes, dados incompletos, câmbio, validade e origem de créditos, uso ilimitado não linear, contratação versus consumo econômico, assinatura já paga, recargas inteiras, liberação mensal de planos anuais, cenas heterogêneas, reserva percentual/execuções, custos fixos/por cena/por hora, markup, margem, provisão, validação de percentuais, comparação equivalente, indisponibilidade e promoção vencida.

`npm run check`: sintaxe dos três módulos aprovada. Servidor local respondeu HTTP 200.

Preparação para GitHub/Vercel: `npm run build` incorpora a checagem de sintaxe, os testes financeiros e a validação dos arquivos de `dist/` e das importações locais. `vercel.json` declara saída estática e dispensa instalação e variáveis de ambiente. O deploy na conta Vercel será realizado pelo usuário; não foi apresentado como executado nesta entrega.

## Navegador

Validado no navegador embutido, em viewport desktop de 1440×1000, tablet na largura padrão e celular de 390×844 (área útil de 375px). Nenhuma rolagem horizontal observada no projeto móvel. Capturas desktop e celular acompanham a entrega.

Controles exercitados:

- Os seis seletores de modelo; mudança de resolução; duração personalizada de 125s e rejeição de 3s na calculadora principal.
- Filtro mensal/todos; ordenação por pagamento/custo; exclusão de estimativas e estado sem tarifas completas.
- Expansão dos resultados com fontes, custo por crédito, saldo, déficit e capacidade.
- Saldo previamente pago de 10 mil créditos: pagamento extra de uma execução = R$ 0, com custo econômico preservado; três execuções insuficientes passam a “a confirmar” quando não há recarga pública confirmada.
- Cadastro de tarifa de teste manual Krea, cálculo com selo manual e posterior remoção. O catálogo original não foi alterado por esse teste.
- Projeto com dois modelos, cena de 125s e múltiplas tentativas; custos fixos de R$ 1.000 e três horas a R$ 50, total operacional R$ 1.150.
- Markup e provisão; cenário margem 90% + provisão 10% bloqueado com mensagem visível.
- Salvamento local e reabertura; exportação CSV baixada e conteúdo financeiro conferido.
- Câmbio Frankfurter consultado com sucesso: referência retornada em 23/10/2026, taxa USD/BRL 5,0465. É uma referência de teste da consulta, não taxa fixa do aplicativo.

A impressão/PDF usa o diálogo nativo do navegador. A geração do PDF pelo usuário não foi concluída durante a validação. O CSV foi validado; a serialização JSON está implementada, mas o download JSON não foi exercitado no navegador. Nem todas as combinações de foco/teclado e leitores de tela foram testadas. Não foi feita auditoria externa de acessibilidade, carga ou segurança.

## Confiabilidade comercial

Foram consultadas páginas oficiais de Magnific, Runway e sua Academy/central de ajuda, Higgsfield, Krea e SJinn. Divergências, indisponibilidade do conteúdo dinâmico ou ausência da tarifa exata permanecem identificadas. Não foi possível confirmar condições dentro das contas autenticadas nem no checkout de contratação. Os valores são planejamento e não constituem consulta a saldo ou proposta comercial garantida.
