import {readFile, stat} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(await readFile(resolve(projectRoot,'vercel.json'),'utf8'));
if(config.outputDirectory!=='dist')throw new Error('O diretório de publicação deve ser dist.');
const required=['index.html','styles.css','app.mjs','engine.mjs','data.mjs','catalog.mjs','comparison.mjs','segments.mjs','live-render.mjs'];
for(const name of required){
  const path=resolve(projectRoot,'dist',name);
  const info=await stat(path);
  if(!info.isFile()||info.size===0)throw new Error('Arquivo de publicação ausente ou vazio: '+name);
}
const html=await readFile(resolve(projectRoot,'dist/index.html'),'utf8');
if(!html.includes('src="app.mjs"')||!html.includes('href="styles.css"'))throw new Error('Referências de entrada inválidas.');
for(const name of ['app.mjs','engine.mjs','data.mjs','catalog.mjs','comparison.mjs','segments.mjs','live-render.mjs']){
  const code=await readFile(resolve(projectRoot,'dist',name),'utf8');
  for(const match of code.matchAll(/(?:from\s*|import\s*)['"](\.\.?\/[^'"]+)['"]/g)){
    const path=resolve(projectRoot,'dist',match[1]);
    if(!(await stat(path)).isFile())throw new Error('Importação inválida em '+name+': '+match[1]);
  }
}
console.log('Build concluído: aplicação estática validada em dist/. Sem dependências ou variáveis de ambiente.');
