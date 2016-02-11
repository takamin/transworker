#!/bin/sh
pid=`cat .webserver.pid`
kill -TERM ${pid}
