# Framecost — design 1.2.0

Atualização visual baseada na referência anexada pelo usuário, conferida em 23/10/2026. A composição foi adaptada à calculadora de vídeo: nenhum widget de clima, produtividade ou dados fictícios foi adicionado.

## Direção visual

- Fundo quase preto (#030711), luz azul no canto superior direito e reflexo âmbar/violeta na lateral.
- Painéis azul marinho com transparência, desfoque, contornos finos e reflexo interno discreto.
- Navegação lateral compacta com ícones vetoriais, estado ativo em azul/ciano e nomes disponíveis no foco e no hover. No celular, navegação inferior com quatro botões iguais e rótulos curtos.
- Botões arredondados com borda, brilho suave e estados de foco/hover. Campos com contorno mais visível para manter a identificação dos controles.
- Cards de custo em azul, violeta e âmbar. Cabeçalho e plano em foco lado a lado no desktop.
- Indicador circular azul/ciano/violeta ligado à porcentagem real do saldo consumido. O arco fica limitado a 100%; o texto e o aviso de déficit mantêm o consumo real quando o orçamento ultrapassa o saldo.
- Tema aplicado a Gerações, Projetos, Planos, Fontes, diálogos de saldo e exportação.

Os arquivos de catálogo, motor financeiro, segmentação, comparação e preservação da digitação não foram modificados. O armazenamento local permanece no mesmo formato. Vercel mantém a saída estática dist e o mesmo processo de build.

## QA — prévia local

URL de teste: http://127.0.0.1:4178. Resultado funcional: **SHIP**, para os cenários abaixo.

| Verificação | Evidência |
| --- | --- |
| Build e regressões | Sintaxe de sete módulos, 94 testes e saída estática validados |
| Desktop, 1440px | As quatro telas sem rolagem horizontal; largura útil e scrollWidth de 1425px |
| Tablet, 768px | As quatro telas sem rolagem horizontal; largura útil e scrollWidth de 753px |
| Celular, 375px | As quatro telas sem rolagem horizontal; largura útil e scrollWidth de 360px; quatro botões inferiores de 77px |
| Digitação | Teclas 1 e 5 exibiram 15, mantiveram o foco e atualizaram a duração calculada |
| Runway Pro mensal, 8s | Kling 3/720p sem áudio US$ 1,12; com áudio US$ 1,62; Kling 4/1080p US$ 2,92; Wan/720p US$ 1,24; Prime/720p US$ 1,74 |
| Geração → projeto | Seedance 2.5/720p, Magnific Premium: 8 cenas, 3 execuções, reserva 20%, margem 40%; venda R$ 675,84, custo R$ 405,50 |
| Saldo | Diálogo aberto e fechado; controles legíveis e organizados |
| Navegação por teclado | Tab do botão Exportar para o plano em foco; contorno ciano de 2px |
| Semântica da geração | Um main, um h1 e uma navegação nomeada; nenhum ID duplicado, controle de formulário sem nome ou botão sem nome na conferência DOM |
| Contraste dirigido | Texto dos botões azuis: pelo menos 4,58:1 nos extremos de cor usados, inclusive hover. Contorno padrão dos campos: 3,14:1 contra a superfície escura de referência |
| Console | Nenhum erro ou aviso nos cenários observados |

Capturas: [desktop](docs/design-1.2.0/desktop.png), [celular](docs/design-1.2.0/mobile.png), [tablet](docs/design-1.2.0/tablet.png) e [projetos](docs/design-1.2.0/projetos.png). A comparação com a referência foi visual. A regressão automática por pixels é **inconclusiva**, pois não havia baseline anterior do novo tema; estas capturas ficam versionadas para futuras comparações. Core Web Vitals, axe-core e auditoria completa WCAG não foram executados; os resultados de semântica, foco e contraste acima têm escopo limitado.

Nenhum login, compra, geração de vídeo ou deploy na conta Vercel foi realizado nesta atualização. O rodapé identifica a publicação como Versão 1.2.0.
