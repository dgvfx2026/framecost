# Framecost — AI Video Cost Calculator

Aplicação funcional de planejamento de geração de vídeo com IA e precificação de produção audiovisual. Interface em português, tema escuro, responsiva, sem cadastro obrigatório e sem dependências de infraestrutura paga.

## Executar

Requer Node.js 22 ou superior. Na pasta deste arquivo:

```sh
npm start
```

Acesse `http://127.0.0.1:4173`. Não é necessário instalar pacotes. Para validar:

```sh
npm test
npm run check
```

O comando de testes executa diretamente o runner nativo do Node, evitando a criação de subprocessos restrita em alguns ambientes Windows.

## Funcionalidades implementadas

- Calculadora de gerações com os seis modelos solicitados, duração personalizada, resolução e comparação por plataforma/plano.
- Custo econômico de uma, três e uma quantidade personalizada de execuções completas.
- Composição de conteúdos longos em segmentos com tarifas por segundo, blocos ou durações predefinidas.
- Capacidade do plano, saldo, déficit, consumo percentual e pagamento adicional separados.
- Contas simuladas por plano: assinatura já paga, créditos comprados e bônus; custo de origem, prioridade e validade dos lotes.
- Contratação de planos inteiros, liberação mensal versus anual e estratégia de recargas Runway em pacotes de 1.000 créditos.
- Filtros de ciclo e status, ordenação por custo, capacidade e desembolso. Selos de melhor custo restritos a grupos equivalentes.
- Calculadora de projetos com grupos de cenas distintos, modelos, durações, resoluções e tentativas por cena.
- Reserva percentual de consumo ou execuções extras; custos fixos, por cena e por hora.
- Precificação por markup ou margem de lucro sobre a venda, com provisão proporcional opcional.
- Comparação do mesmo projeto em planos compatíveis com todas as cenas.
- Salvamento de projetos no navegador, exportação CSV do orçamento, exportação JSON das gerações e impressão/PDF pelo navegador.
- Tarifas manuais identificadas, fontes oficiais, datas de consulta e metodologia visível.
- USD/BRL com taxa de referência Frankfurter ou taxa manual, ambas datadas. Valores nativos preservados.

## Tecnologias e organização

JavaScript modular ES, HTML semântico, CSS responsivo, armazenamento local do navegador, Node.js e seu runner de testes nativo. O frontend estático pode ser hospedado sem servidor de aplicação. O pequeno servidor local usa somente módulos nativos do Node.

| Arquivo | Responsabilidade |
| --- | --- |
| `dist/data.mjs` | Catálogo comercial e fontes |
| `dist/engine.mjs` | Cálculos puros compartilhados pelas duas calculadoras |
| `dist/app.mjs` | Interface, validação, estado, câmbio e exportação |
| `dist/styles.css` | Tema, acessibilidade e adaptação de tela |
| `tests/engine.test.mjs` | 41 testes automatizados com fixtures fictícias identificadas |
| `VALIDACAO.md` | Evidências dos testes e limites conhecidos |

## Regras financeiras

1. Custo unitário = custo atribuível ao saldo / créditos originais do saldo.
2. Na assinatura anual com créditos mensais, o custo atribuível ao mês é o preço anual / 12; o desembolso de contratação continua sendo o preço anual integral.
3. Cada execução cobre a duração solicitada usando clipes permitidos. Em tarifas predefinidas, não interpolamos custos: a composição busca o menor consumo entre os clipes cadastrados e mostra a duração gerada, inclusive excesso.
4. Três execuções repetem o conteúdo completo. Quando os lotes têm valores diferentes, o custo de três pode diferir do triplo do custo de uma.
5. Lotes expirados não são consumidos. A assinatura tem prioridade, seguida de créditos comprados e bônus, conforme o cenário informado.
6. O saldo nunca fica negativo: exibimos separadamente o déficit. Recargas não confirmadas resultam em pagamento “a confirmar”.
7. Para créditos além do saldo, o custo econômico usa a tarifa do pacote conhecido ou o rateio do plano como estimativa explicitamente sinalizada.
8. Reserva percentual acrescenta uma provisão de consumo uma única vez. Execuções extras alternam os grupos de cenas, incluindo todos os segmentos de cada execução.
9. Markup: `preço = custo × (1 + markup) / (1 − provisão)`.
10. Margem: `preço = custo / (1 − margem − provisão)`. Lucro = preço − custo − provisão sobre a venda. A soma de margem e provisão deve ser menor que 100%.
11. Não são aplicados impostos, IOF nem taxas de cartão automaticamente. Valores são arredondados para apresentação, preservando precisão intermediária.

## Dados confirmados em 23/10/2026

Os links estão no catálogo e na área “Fontes e metodologia”. Não representam garantia de preço futuro.

- **Magnific:** Premium promocional de R$ 354/ano por 240 mil créditos anuais, Premium+ de R$ 1.620/ano por 600 mil e Pro Starter de R$ 3.960/ano por 1,5 milhão. Créditos válidos por um ano, sem reset mensal. Promoção Premium anunciada até 26/10/2026. Oferta vencida deixa de participar de novas contratações.
- **Magnific, tarifas de clipes publicadas:** Seedance 2 Pro 720p, 1.120 créditos/4s; Seedance 2.5, 1.760/4s em 720p e 4.400/4s em 1080p; Kling 3 Pro 1080p, 450/5s; Kling 4 1080p sem vídeo de entrada, 840/3s. Estas são composições conservadoras de clipes documentados, não uma alegação de que a plataforma só oferece essa duração.
- **Runway:** Standard 625, Pro 2.250 e Max 9.500 créditos/mês. Mensalidades US$ 15/35/95; anuais US$ 144/336/912, com liberação mensal dos créditos. Seedance 2.5: 20/30/68 créditos por segundo em 480p/720p/1080p, sem referência de vídeo. Limites próprios do Runway de 4–30s. Recargas a partir de 1.000 créditos por US$ 10; a simulação usa pacotes inteiros de 1.000.
- **Higgsfield:** Kling 4 com 25/37,5 créditos por 5s e 150/225 por 30s em 720p/1080p. O preço do plano Plus citado no artigo oficial é uma referência editorial de US$ 49/1.000 créditos, classificada como estimada diante de divergências com a tabela dinâmica.
- **Krea:** preços e alocações mensais regulares cadastrados, incluindo Basic US$ 9/5 mil units, Pro US$ 35/20 mil, Max US$ 105/60 mil e Business US$ 200/80 mil. Consumo exato não foi inferido da capacidade aproximada publicada.
- **SJinn:** alocações publicadas de 20/60/120 mil e 1,2 milhão de créditos mensais. Periodicidade e pagamento anual inferidos do desconto de 40% são classificados como estimados. A tarifa genérica “seedance” não é atribuída à versão 2.5.

## Lacunas e limitações conhecidas

- Krea e SJinn ficam visíveis no catálogo, mas só entram em cálculos após fornecer uma tarifa manual compatível. Não é apresentada uma falsa comparação completa entre cinco plataformas.
- Wan 3/Prime na Magnific vêm de tabela oficial alternativa divergente da tabela principal atual: estimados. Wan 3 no Runway tem tarifa confirmada, mas limite de duração específico ainda pendente; usa referência do modelo, identificada como estimativa.
- Seedance 2 no Runway tem divergência entre preço de referência de 4s e guia de criação com mínimo de 5s. O cálculo usa 5s de forma conservadora e fica estimado.
- Nenhum acesso ilimitado condicionado é modelado como custo zero. Não há cálculo para limites diários, filas e políticas de uso justo sem dados suficientes.
- O modo implementado é texto/imagem sem vídeo de referência de entrada. Não há cobrança simulada para edição, extensão ou vídeo de referência.
- A tarifa de Kling 3 no Runway está documentada, mas sua variante/resolução não foi consolidada com evidência suficiente nesta versão. Não a adicionamos por suposição.
- No saldo Runway, o lote comprado também pode representar rollover com custo e validade informados. Esta versão não possui um gerenciador ilimitado de categorias de saldo.
- O saldo é declarado pelo usuário. Não existem integração com contas externas, login multiusuário, sincronização de projetos, cobrança de assinaturas ou administração avançada.
- Projetos são locais ao navegador. Limpar dados do site remove o histórico. Exporte para preservar o orçamento.
- Câmbio exige conexão com o serviço externo ou entrada manual. Sem taxa, valores nativos permanecem disponíveis e não há classificação entre moedas diferentes.
- Fontes podem mudar; o catálogo é atualizado pela equipe, sem raspagem automática em produção. Dados faltantes permanecem pendentes.

## Atualizar dados comerciais

Edite `dist/data.mjs`: `sources` registra URL e consulta, `plans` registra preço integral e periodicidade, `rules` registra cada configuração e sua cobrança. Use `verified` apenas para fatos confirmados; `estimated` para inferências ou divergências; valores desconhecidos devem permanecer ausentes. Não converta capacidades aproximadas em tarifas exatas.

Ao adicionar um plano anual, confira `creditPeriod`: `monthly` significa créditos mensais, `annual` significa o saldo anual disponível. Aplique `validUntil` a promoções. Não reutilize créditos da API como se fossem saldo da assinatura.

Após qualquer alteração, execute `npm test` e `npm run check`. Valide manualmente configurações novas, totais, saldo e comparação. Atualize data e fontes. Nenhuma credencial deve entrar no frontend.

## Publicar

Repositório: https://github.com/dgvfx2026/framecost

Para publicar na **Vercel**, importe este repositório mantendo a raiz `./`. O arquivo `vercel.json` configura **Framework: Other**, **Build Command: `npm run build`**, **Output Directory: `dist`** e nenhuma etapa de instalação. O build executa a checagem de sintaxe, os 41 testes e a validação dos arquivos estáticos. Nenhuma variável de ambiente é exigida. O passo a passo completo está em [VERCEL.md](VERCEL.md).

O diretório de publicação é `dist/`. Ele pode ser servido em qualquer hospedagem estática HTTPS com tipos MIME corretos para `.mjs`. Sem etapa de build e sem dependências a instalar. A chamada de câmbio ocorre no navegador; seu provedor deve permitir a política CORS do Frankfurter. Não use o servidor local de desenvolvimento como servidor público.

A configuração local de outras hospedagens (`.openai/`), credenciais (`.env*`) e arquivos locais da Vercel (`.vercel/`) ficam fora do repositório. O controle de acesso da hospedagem é independente do aplicativo, que não exige cadastro próprio.
