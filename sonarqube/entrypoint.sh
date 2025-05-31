#!/bin/bash

rm -f ${SONARQUBE_HOME}/extensions/plugins/*.bundled.jar
cp /bundled-sonarqube-plugins/* ${SONARQUBE_HOME}/extensions/plugins/

exec /opt/sonarqube/docker/entrypoint.sh "$@"
