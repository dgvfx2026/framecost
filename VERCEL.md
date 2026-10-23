# Publicação na Vercel

O repositório contém uma aplicação estática pronta para importação. O `vercel.json` informa a configuração de publicação. Nenhuma chave, banco de dados ou variável de ambiente é necessária.

1. Na Vercel, use **Add New → Project** e importe `dgvfx2026/framecost`.
2. Use a raiz do repositório como **Root Directory** (`./`).
3. Confira as configurações abaixo e clique em **Deploy**.

| Configuração | Valor |
| --- | --- |
| Framework Preset | Other |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | Vazio / desabilitado |
| Node.js | 22 ou superior |
| Environment Variables | Nenhuma |

O build confere a sintaxe, executa os 94 testes financeiros e de regressão comercial e verifica os arquivos da aplicação. O diretório `dist/` já contém os arquivos estáticos; não depende de um bundler. Os módulos `.mjs` têm cabeçalho JavaScript explícito na configuração da Vercel.

O `server.mjs` serve somente para desenvolvimento local. A Vercel distribui `dist/` diretamente, sem manter esse processo em execução. Não selecione um framework de servidor Node/Express.

Para testar antes do deploy:

```sh
npm run build
npm start
```

Abra `http://127.0.0.1:4173`. Após o deploy, teste gerações, projetos, exportação e câmbio no endereço da Vercel. O serviço Frankfurter precisa estar acessível pelo navegador para atualizar a referência cambial; a taxa manual continua disponível.

Projetos e saldos são armazenados no navegador e no domínio onde foram criados. O histórico local não é transferido automaticamente para um novo domínio.

Para atualizar os preços, edite `dist/catalog.mjs`, execute os testes e envie um novo commit. Uma integração Git habilitada na Vercel poderá publicar as alterações posteriores conforme as configurações do projeto.

Referência oficial: https://vercel.com/docs/project-configuration/vercel-json
