ARTHUR IA — VERSÃO PARA RENDER (ANDROID)

ARQUIVOS
- server.js: servidor Node.js/Express. Entrega a página na rota / e encaminha pedidos ao Gemini.
- package.json: dependências e comando de arranque.
- public/index.html: interface preta e roxa, chat e envio de imagem.

ANTES DE COMEÇAR
A chave Gemini não está incluída. Não a coloques no index.html, server.js, GitHub nem em mensagens.

PASSO 1 — Extrair o ZIP no Android
Usa o gestor de arquivos do celular para extrair Arthur_IA_Render.zip. Confirma que os arquivos ficam assim:
  server.js
  package.json
  public/index.html

PASSO 2 — Enviar os arquivos para GitHub
O Render Web Service normalmente faz deploy a partir de um repositório Git.
1. Entra em https://github.com/ e cria um repositório novo, por exemplo arthur-ia.
2. Envia os arquivos extraídos mantendo a pasta public e o arquivo public/index.html dentro dela.
3. Não envies tua chave API para o repositório.

PASSO 3 — Criar/atualizar serviço no Render
1. Abre https://dashboard.render.com/
2. Cria um New > Web Service e conecta o repositório GitHub, ou abre o serviço existente e conecta o repositório certo.
3. Runtime/Language: Node.
4. Build Command: npm install
5. Start Command: npm start
6. Faz deploy.

PASSO 4 — Guardar a chave no Render
No serviço Render: Environment > Add Environment Variable.
Key: GEMINI_API_KEY
Value: tua chave secreta do Google AI Studio.
Guarda as alterações e faz deploy/restart quando o painel pedir.
Opcional: GEMINI_MODEL = gemini-2.5-flash (já é o padrão no código).

PASSO 5 — Testar
Abre a URL do serviço Render. A página Arthur IA deve abrir.
Escreve: "Cria um botão HTML preto e roxo e explica o código."
Depois testa enviar uma imagem pequena.

SE DER ERRO
- Cannot GET /: confirma que public/index.html foi enviado e que o comando de início é npm start.
- Falta configurar GEMINI_API_KEY: adiciona a variável Environment no Render, não no HTML.
- Erro 401/403: confirma a chave e se o acesso à Gemini API está habilitado.
- Erro 429: quota/limite atingido; verifica limites e preços atuais.
- Falha de build: confere se package.json está na raiz do repositório e se Build Command é npm install.

SEGURANÇA E LIMITES
- Não partilhes a chave API.
- Se a chave for publicada por engano, revoga-a e cria outra.
- A página não tem login nem histórico permanente.
- Imagens enviadas são encaminhadas à API Gemini para análise.
- A cota gratuita e modelos disponíveis podem mudar; uso grátis ilimitado não é garantido.
- Código gerado por IA deve ser revisto antes de usar.

Documentação:
https://render.com/docs/web-services
https://ai.google.dev/gemini-api/docs
