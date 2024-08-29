# Shopper - Teste Técnico para Desenvolvedor Web

Este repositório contém a minha solução para o teste técnico de desenvolvimento web solicitado pela Shopper. O objetivo deste projeto é construir o backend de um serviço de leitura individualizada de consumo de água e gás, utilizando IA do Google Gemini para obter medições a partir de fotos de medidores.

## Descrição do Projeto

O projeto consiste basicamente na implementação de uma API RESTful em Node.js com TypeScript, que realiza a leitura de medições de água e gás a partir de imagens enviadas pelo usuário. A API se comunica com o serviço Google Gemini para processar as imagens e extrair as medições.

### Endpoints Implementados

1. **POST /upload**
   - Recebe uma imagem em base64, consulta o Google Gemini para extrair o valor da medição e retorna os dados processados.
   - Validações incluem:
     - Verificar o tipo de dados dos parâmetros enviados.
     - Verificar se já existe uma leitura no mês naquele tipo de leitura.

2. **PATCH /confirm**
   - Confirma ou corrige o valor lido pelo Google Gemini.
   - Validações incluem:
     - Verificar se o código de leitura informado existe.
     - Verificar se o código de leitura já foi confirmado.

3. **GET /{customer_code}/list**
   - Lista todas as medições realizadas por um determinado cliente.
   - Pode filtrar medições por tipo (`WATER` ou `GAS`).

### Estrutura do Projeto

- **src/**: Contém o código-fonte do projeto.
- **controllers/**: Implementação dos controladores para os endpoints.
- **models/**: Modelos de dados utilizados na aplicação.
- **routes/**: Rotas definidas para realizar as requisições.
- **services/**: Lógica de integração com a API do Google Gemini.
- **database.ts**: Configuração da conexão com o banco de dados.
- **Dockerfile**: Configuração para containerização da aplicação.
- **docker-compose.yml**: Arquivo de configuração para orquestração dos containers.

### Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento backend.
- **TypeScript**: Linguagem utilizada para garantir maior segurança no código.
- **Docker**: Para containerização da aplicação e facilitar o processo de deploy.
- **Google Gemini API**: Serviço utilizado para processamento de imagens e extração de dados.

### Instruções para Execução

1. **Clonando o repositório**
   ```bash
	 HTTP:
	 git clone https://github.com/pedro-santos20/teste-tecnico-shopper.git
	 cd teste-tecnico-shopper

	 SSH:
	 git clone git@github.com:pedro-santos20/teste-tecnico-shopper.git
	 cd teste-tecnico-shopper

2. **Configurando as variáveis de ambiente**
	- Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
	```bash
	GEMINI_API_KEY=<sua-chave-da-api>

3. **Executando a aplicação**
	- Certifique-se de ter o Docker instalado e execute:
	```bash
	docker-compose up

4. **Acessando a API**
	- A aplicação estará disponível em `http://localhost:3000`.

### Considerações Finais

Este projeto faz parte do processo seletivo para a Shopper. Até o momento, esse é o backend e estou animado e no aguardo do próximo passo, que seria o frontend do projeto!

### Autor
	Pedro Santos
