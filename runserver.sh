#!/bin/sh

export SO_UPDATE_INTERVAL=80
export SO_CLIENT_PORT=5001
export SO_SERVER_PORT=5002

node ./server/server.js

