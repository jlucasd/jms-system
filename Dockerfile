# Etapa 1: Usar uma imagem base do Nginx, que é um servidor web leve e eficiente.
FROM nginx:stable-alpine

# Etapa 2: Copiar o arquivo de configuração customizado do Nginx para o contêiner.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Etapa 3: Copiar todos os arquivos da sua aplicação (HTML, TSX, etc.) para o diretório
# padrão que o Nginx usa para servir sites.
COPY . /usr/share/nginx/html

# Etapa 4: Expor a porta 80, que é a porta padrão para tráfego web (HTTP).
EXPOSE 80

# Etapa 5: Comando para iniciar o servidor Nginx quando o contêiner for executado.
CMD ["nginx", "-g", "daemon off;"]
