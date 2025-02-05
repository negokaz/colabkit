FROM node:20

WORKDIR /app

COPY smtp-mattermost-gateway/package*.json ./
COPY smtp-mattermost-gateway/*.ts ./
RUN npm install

EXPOSE 2525

ENTRYPOINT ["npm", "start"]
