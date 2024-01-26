# Backend Events Callendar:
api rest de uma plataforma de eventos agendados.

## stack:
- **linguagem**: typescript
- **framework**: NestJs
- **runtime**: Nodejs
- **banco de dados**: MongoDb
- **conteinerização**: Docker & Docker-Compose

## Instalação:
após clonar o repositório será necessário configurar um arquivo com variavéis de ambiente na raiz do projeto chamado ``.env``
que deverá conter os seguintes valores:

```dotenv

PORT=8080
SECRET="frase aleatória que será criptografada para geração de jsowebtokens de acesso"
FRONT="url do frontend"
DB_USER="nome para o usuário root do container do mongodb"
DB_PASS="senha de acesso do root para o banco de dados mongodb"


```
 após esse arquivo de configuração ser criado, é necessário gerar um json para acesso a api de e-mail pelo google developers, o arquivo deverá ficar na pasta raiz do projeto também e nomeado como ``auth.client.json ``, sua configuração seria dessa forma:
 ```json

 {
  "client_id": "Identificador único do cliente, geralmente associado a um aplicativo ou serviço.",
  "project_id": "Identificador único do projeto no qual o cliente está integrado, utilizado para gerenciamento no Google Cloud.",
  "auth_uri": "URI de autorização utilizado no processo de autenticação OAuth 2.0.",
  "token_uri": "URI utilizado para solicitar e renovar tokens de acesso no processo de autenticação OAuth 2.0.",
  "auth_provider_x509_cert_url": "URL que fornece certificados x509 para validação do token de autenticação.",
  "client_secret": "Segredo do cliente, um código secreto conhecido apenas pelo cliente e pela autoridade de emissão de tokens.",
  "redirect_uris": [
    "URI de redirecionamento após a conclusão do processo de autenticação."
  ],
  "grant_type": "Tipo de concessão utilizado para obter um token de acesso. No caso, 'refresh_token' indica a renovação do token.",
  "access_token": "Token de acesso utilizado para autenticar solicitações feitas em nome do usuário autenticado.",
  "refresh_token": "Token utilizado para obter um novo token de acesso após a expiração do token atual."
}
 ```
um json de acesso a apis do google via Oauth2 permite acessar diversos serviços do google de forma prática.
 [link da documentação do google Oauth2](https://developers.google.com/identity/protocols/oauth2?hl=pt-br)


com todos os arquivos de ambiente devidamente configurados, basta agora apenas iniciar os containers com os seguintes comandos:
```bash
docker compose up --build -d
```
o container iniciará em segundo plano e já será acessível via localhost.


## endpoints:
todos os endpoints com suas devidas definições estão na rota ```/doc``` da api