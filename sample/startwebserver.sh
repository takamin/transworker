#!/bin/sh
cp ../transworker.js .
node webserver.js&
pid=$!
echo ${pid} > .webserver.pid
echo 'local web server on port 5000 by pid ' ${pid}
echo 'open http://localhost:5000/index.html to see samples.'
echo 'and use script stopwebserver.sh to stop it.'
