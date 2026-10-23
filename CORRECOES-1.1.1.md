# Correção 1.1.1 — Kling, Wan e digitação

## Erros e comportamento final

O evento de input recriava a aplicação e tentava restaurar a seleção com setSelectionRange. Campos type=number não suportam esse método: o cursor podia voltar ao início e inverter 15 para 51. A atualização agora mantém o próprio campo e todos os seus ancestrais montados. Somente o conteúdo ao redor é substituído, permitindo cálculos ao digitar sem perder cursor, seleção ou parte decimal. Atualizações assíncronas de câmbio usam o mesmo caminho.

O contador de tentativas também permanece na tela quando está temporariamente vazio ou inválido. É possível apagar o conteúdo e digitar um novo valor normalmente. Nenhum cálculo inválido é apresentado como cotação.

As resoluções eram coletadas de todas as plataformas. Assim, Wan podia manter 720p de outra plataforma, embora a tarifa da Magnific estivesse cadastrada como 780p, e Kling podia manter 480p do Seedance. Ao trocar modelo ou plano, a aplicação mantém uma resolução compatível ou escolhe a mais próxima com tarifa no plano em foco. A troca de modelo avisa quando ajusta a resolução. A plataforma e o ciclo não mudam.

Projetos usam as opções do próprio plano. Resolução antiga sem tarifa é mostrada explicitamente em vez de aparentar que outra opção foi selecionada. Mudar de plano ajusta as resoluções das cenas ao plano escolhido, mantendo modelos e durações.

## Modelos e tarifas

- **Kling 3 Magnific:** 70 créditos/s em 720p e 90 em 1080p, sem áudio; 5–15s auditados. Uma configuração de 4s recebe atalho para 5s, em vez de cobrar outra duração silenciosamente.
- **Wan 3 Magnific:** 60/120/240 créditos/s em 480p/**780p**/1080p, 2–30s. A resolução 780p é mantida literalmente conforme a central de créditos. Não foi renomeada para 720p.
- **Wan Prime Magnific:** 100/200/400 créditos/s nas mesmas resoluções, 2–30s. O artigo oficial informa que Prime usa as mesmas especificações de Wan 3. Preços desse artigo de lançamento divergem da central atual; o cálculo continua usando a central de créditos atual, com a divergência documentada na tarifa.
- **Kling 4 Magnific:** apenas 840 créditos/3s em 1080p confirmados na tabela de assinatura. A calculadora permite 3s e mostra o botão “Calcular 3s em 1080p”. Não infere uma tarifa por segundo para 8s ou 15s.
- **Kling 4 Higgsfield:** atalhos explícitos para as cotações confirmadas de 5s e 30s, em 720p e 1080p. A seleção desses atalhos mantém o mesmo plano. Composição acima de 30s continua exigindo cotação de todos os segmentos.

Quando falta cotação, há uma explicação, opções confirmadas no mesmo plano e acesso ao cadastro de tarifa da conta. Planos sem acesso confirmado não recebem os atalhos de outro plano. As regras de Seedance e os preços das assinaturas foram preservados.

Fontes oficiais consultadas em 23/10/2026:

- [Magnific: créditos por segundo](https://www.magnific.com/ai/docs/ai-video-generator-credits)
- [Magnific: Kling e áudio](https://www.magnific.com/ai/kling)
- [Magnific: Wan 3 e duração 2–30s](https://www.magnific.com/wan-3-0)
- [Magnific: Wan Prime com as mesmas especificações](https://www.magnific.com/blog/wan-3-0-generations/)
- [Magnific: Kling 4, tabela de preços](https://www.magnific.com/pricing)
- [Magnific: Kling 4, tarifa por segundo ainda pendente](https://www.magnific.com/ai/kling/kling-4?from_element=landing_kling_30_motion_control_related)
- [Higgsfield: cotações Kling 4](https://higgsfield.ai/blog/kling-4-0-on-higgsfield)

## Validação

80 testes automatizados aprovados e build estático validado. Oito novos casos cobrem seleção de resolução, limites de acesso, Kling 3, cotação de 3s para Kling 4 e consumo/segmentação do Wan Prime.

Digitação real no navegador, tecla a tecla:

| Campo / ação | Resultado |
| --- | --- |
| Duração: limpar e digitar 15 | 15, foco preservado |
| Duração: mover cursor e inserir 2 entre 1 e 5 | 125 |
| Execuções: limpar e digitar 15 | 15, campo permanece presente |
| Quantidade de cenas: digitar 15 | 15 |
| Custo operacional: digitar 15.5 | 15,5 na entrada decimal, sem inversão |

Casos no Magnific Premium mensal de R$ 80/20.000 créditos: Kling 3/8s/720p = 560 créditos e R$ 2,24; Wan 3/8s/780p = 960 e R$ 3,84; Wan Prime/8s/780p = 1.600 e R$ 6,40; Kling 4/3s/1080p = 840 e R$ 3,36. Custo atribuído ao consumo e mensalidade integral permanecem separados.

As pendências de tarifas em outras plataformas continuam visíveis. API e assinatura têm condições distintas; não transferimos créditos/preços de uma para a outra. A publicação na conta Vercel não foi executada nesta validação.
