# Framecost — AI Video Cost Calculator

Calculadora de consumo de geração de vídeo com IA e orçamento de produção. Interface em português, armazenamento local, exportação JSON/CSV e aplicação estática sem dependências externas de instalação.

**Revisão 2, 23/10/2026:** corrige preços comerciais, separa cobrança mensal/anual e mantém o plano escolhido ao trocar resolução. Consulte [AUDITORIA.md](AUDITORIA.md) para valores, causas e exemplos reproduzíveis. Tarifas sem evidência suficiente ficam pendentes.

## Executar e validar

Requer Node.js 22 ou superior. Na raiz do repositório:

```sh
npm start
npm run build
```

Abra http://127.0.0.1:4173. O build confere sintaxe, executa 72 testes e verifica todos os arquivos estáticos e importações. Não é necessário instalar pacotes. O runner é executado diretamente para compatibilidade com ambientes Windows restritos.

## Uso

1. Escolha modelo, duração, resolução e um único ciclo de assinatura.
2. Escolha o plano em foco. Trocar resolução mantém esse plano; dados ausentes resultam em “A confirmar”. O quadro de resoluções mostra os custos do mesmo plano lado a lado.
3. Compare custo econômico, créditos e pagamento adicional. No anual, o valor por mês é equivalente; a cobrança inicial inclui o ano inteiro.
4. Se já possui assinatura ou créditos comprados, informe o saldo e o custo de origem. Nenhum saldo externo é consultado.
5. Em Projetos, configure cenas, tentativas, reserva, trabalho operacional e margem/markup. Exporte o orçamento para preservar o resultado.

O comparativo filtra mensal e anual separadamente. Selos só comparam mesmo modelo, resolução, qualidade, áudio, duração gerada, ciclo e status da fonte. Consumo estimado além do saldo recebe ≈ e não recebe selo de menor custo.

## Organização

| Arquivo | Responsabilidade |
| --- | --- |
| dist/catalog.mjs | Preços, créditos por ciclo, tarifas, limites e fontes auditadas |
| dist/data.mjs | Entrada pública do catálogo |
| dist/segments.mjs | Composição de clipes e regras de cobrança |
| dist/engine.mjs | Custo econômico, saldo, pagamento, projeto e precificação |
| dist/comparison.mjs | Filtros, plano em foco, ciclo, equivalência e ranking |
| dist/app.mjs | Interface, estado local, migração, câmbio e exportação |
| tests/engine.test.mjs | Testes do motor e entrada da suíte |
| tests/regressions.test.mjs | Casos reais do catálogo e regressões dos erros relatados |
| AUDITORIA.md | Preços revisados, exemplos e limites comerciais |
| VALIDACAO.md | Evidências e escopo dos testes |

## Regras de cálculo

- Valor de origem por crédito = custo atribuível / créditos originais do lote. Anuidade com liberação mensal usa preço anual / 12 e apenas os créditos daquele mês; Magnific anual usa a anuidade e o saldo anual liberado.
- Tarifas por segundo repartem a duração entre clipes permitidos. Exemplo: mínimo 4s, máximo 30s, conteúdo de 31s → 27s + 4s. O passo de cobrança continua explícito.
- Tarifas manuais por blocos ou durações predefinidas buscam a composição de menor consumo. Duração efetivamente gerada aparece na tela.
- Uma cotação de 5s não permite inferir valores de 8s nem obrigar múltiplos de 5s. Cotações de referência calculam somente durações publicadas; composição acima do máximo exige cotação de cada segmento.
- Cada execução repete o conteúdo completo. Custos de três execuções consomem os lotes em sequência; não são necessariamente o triplo quando os lotes têm custos distintos.
- Assinatura já paga afeta o pagamento adicional, não zera o custo econômico. Lotes vencidos são ignorados. Saldo e déficit ficam separados.
- Sem saldo suficiente, somente recarga documentada gera valor de contratação. Sem preço de recarga, o pagamento fica pendente; o rateio de consumo além do saldo é estimado e marcado com ≈.
- Reserva percentual é provisão de consumo aplicada uma vez; não promete um número fracionário de clipes. A reserva por execuções extras alterna os grupos de cenas.
- Markup: preço = custo × (1 + markup) / (1 − provisão). Margem: preço = custo / (1 − margem − provisão). Margem + provisão deve ser menor que 100%.
- Não há imposto, IOF ou taxa de cartão presumidos. Câmbio Frankfurter ou manual é datado; sem taxa, moedas diferentes não recebem ranking comum.

## Limitações

Krea e SJinn têm preços de assinatura auditados, mas não tarifa exata suficiente para os seis modelos. Não entram automaticamente no custo de vídeo. Wan Prime na Magnific e Wan 3 no Runway aguardam limites específicos da plataforma. Higgsfield possui cotações por duração; tarifas com ~ ficam desativadas por padrão. O Starter Higgsfield não herda acesso de outros planos. Detalhes e fontes estão em [AUDITORIA.md](AUDITORIA.md).

Não existe integração com saldos reais, checkout, login multiusuário ou sincronização. Projetos ficam no navegador e domínio onde foram criados. A revisão migra configurações antigas para mensal, desativa aproximações e preserva saldos, tarifas manuais e projetos salvos; estes devem ser revisados pelo usuário.

## Atualizar e publicar

Edite dist/catalog.mjs, registrando fonte, data, preço integral, moeda, ciclo de pagamento, ciclo de liberação de créditos e consumo por configuração. Não deduza mensalidades de descontos promocionais nem tarifas de capacidades aproximadas. Incremente CATALOG_VERSION em revisões comerciais que exijam aviso de migração. Execute npm run build e confira cenários reais no navegador.

Repositório: https://github.com/dgvfx2026/framecost

Na Vercel, importe a raiz do repositório com Framework **Other**, Build **npm run build**, Output **dist**, sem instalação nem variáveis de ambiente. O vercel.json já declara esses parâmetros e o MIME dos módulos. Consulte [VERCEL.md](VERCEL.md). O servidor local não é executado na Vercel. Credenciais, .openai/, .vercel/ e .env* ficam fora do repositório.
