# Runway — correção 1.1.2

O problema persistia porque a revisão anterior havia corrigido principalmente a Magnific. O cadastro Runway mantinha Wan sem regra de duração, não possuía Kling 3, Kling 4 ou Wan Prime, e uma mensagem de dados faltantes podia ser entendida como incompatibilidade do modelo.

## Comportamento corrigido

Kling 3, Kling 4, Wan 3 e Wan Prime têm regras para assinatura Runway, reutilizadas por geração e projeto. Plataforma e ciclo ficam no plano escolhido. Quando uma resolução não possui tarifa, a troca de modelo/plano seleciona uma resolução tarifada e informa o ajuste. Dados de consumo faltantes são identificados como tarifa não cadastrada, e não como incompatibilidade.

A digitação já corrigida foi preservada: dist/live-render.mjs não foi modificado. Áudio do Kling 3 agora possui seletor em geração e por grupo de cenas. Essa escolha também segue ao transformar uma geração em projeto. Projetos antigos sem o campo continuam na variante sem áudio.

## Tarifas e evidência

| Modelo Runway | Resolução / variante | Consumo | Duração por clipe |
| --- | --- | --- | --- |
| Kling 3 | Standard 720p | 9 cr./s sem áudio; 13 com áudio | 3–15s |
| Kling 3 | Pro 1080p | 12 cr./s sem áudio; 17 com áudio | 3–15s |
| Kling 4 | 1080p, sem vídeo de entrada | Curva descrita abaixo | 3–30s |
| Wan 3 | 480p / 720p / 1080p | 5 / 10 / 20 cr./s | 2–30s |
| Wan Prime | 480p / 720p / 1080p | 6,8 / 14 / 28 cr./s | 2–30s |

Kling 3 e Wan 3 usam [tarifas da assinatura na Academy](https://academy.runwayml.com/models-pricing). Para Kling 3, a [documentação técnica Runway](https://docs.dev.runwayml.com/assets/inputs/) identifica variantes e duração; não foi usado preço em dólares nem saldo da API como preço de assinatura.

No [app Runway Creative](https://app.runwayml.com), em modo visitante → Tool → Video, sem executar geração, foram conferidos limites e preços: Wan e Prime permitem 2–30s; Prime de 5s mostra 34/70/140 créditos nas três resoluções. Os preços equivalem a 6,8/14/28 por segundo. A precisão fracionária da taxa é preservada; o indicador nativo arredonda sua apresentação.

### Kling 4: derivação explícita da curva nativa

Kling 4 aparece na interface Runway, embora ainda não esteja na tabela Academy consultada. O seletor nativo permite 3–30s e áudio é nativo. Em 1080p, foram registradas todas as 27 cotações de 3 a 29 segundos: 3s=71, 4s=94, 5s=118, 8s=188, 15s=353, 29s=682 créditos, entre outras.

**Derivação:** a expressão round(segundos × 23,5) reproduz as 27 cotações observadas. Essa regra calcula cada clipe antes de multiplicar tentativas e também é usada no planejamento de 30s ou segmentos compostos. Assim, 3 clipes de 5s usam 118 × 3 = 354, em vez de arredondar um total de 352,5.

A interface anunciava 25% de desconto até 30/11/2026. A curva já usa os números exibidos: não se aplica outro desconto. A tarifa vence nessa data e passa a exigir atualização tanto para assinatura nova quanto para saldo já pago. Acesso ilimitado promocional condicionado à conta não foi convertido em custo zero.

Os registros literais estão em [docs/runway-native-quotes-2026-10-23.json](docs/runway-native-quotes-2026-10-23.json). Não houve compra ou geração de conteúdo. A consulta nativa foi encerrada quando o Runway apresentou um aviso de automação; não foi tentado contornar esse aviso.

**Limitação:** Kling 4/720p está disponível no Runway, mas seu preço não foi confirmado nesta consulta. O cálculo confirmado usa 1080p; 720p aparece como preço pendente. Não foi copiada a tarifa da API ou de outra resolução para preencher essa lacuna.

## Exemplos testados no navegador

Runway Pro mensal, US$ 35 / 2.250 créditos, 8s por execução:

| Configuração | Créditos | Custo econômico |
| --- | --- | --- |
| Kling 3 Standard 720p sem áudio | 72 | US$ 1,12 |
| Kling 3 Standard 720p com áudio | 104 | US$ 1,62 |
| Kling 4 1080p | 188 | US$ 2,92 |
| Wan 3 720p | 80 | US$ 1,24 |
| Wan Prime 720p | 112 | US$ 1,74 |

A contratação mensal continua US$ 35, separada do rateio. No Pro anual, a cobrança é US$ 336 e a liberação permanece 2.250 créditos por mês. Cenas longas são compostas em clipes, respeitando o limite de cada modelo.

94 testes aprovados: 14 novos testes Runway, incluindo todos os planos mensais/anuais, quatro modelos, cenas até 125s, áudio, custo de projeto, validade promocional e reprodução das cotações capturadas. O rodapé exibe Versão 1.1.2 para conferir a publicação do commit na Vercel.
