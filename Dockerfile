FROM node:argon

EXPOSE 3000
ENV MONGO_PORT_27017_TCP_ADDR="ezmaster_db"
ENV MONGO_PORT_27017_TCP_PORT="27017"

RUN mkdir -p /opt/ezmaster/config/
RUN ln -s /tests/instances/2015-02-13.json /opt/ezmaster/config/config.json
RUN ln -s /tests/instances/2015-02-13 /opt/ezmaster/data

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/

RUN npm install .

CMD node server.js tests/instances/2015-02-13