# specify the node base image with your desired version node:<version>
FROM node:16

# install the required node packages
RUN npm install -g nodemon express express-ws

# use global installed modules without the node_modules folder
ENV NODE_PATH=/usr/local/lib/node_modules



# run "docker compose build --force-rm" to rebuild the image