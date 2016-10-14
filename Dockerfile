FROM node:argon

EXPOSE 3000
ENV MONGO_PORT_27017_TCP_ADDR="ezmaster_db"
ENV MONGO_PORT_27017_TCP_PORT="27017"

COPY . /app/

RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/app/tests/instances/2015-02-13.json", \
  "dataPath": "/app/tests/instances/2015-02-13" \
}' > /etc/ezmaster.json

WORKDIR /app

RUN npm install .

CMD node server.js tests/instances/2015-02-13