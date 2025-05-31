ARG SONARQUBE_VERSION

FROM sonarqube:${SONARQUBE_VERSION} as build

USER root
RUN set -ex; \
    apt-get update; \
    apt-get install -y ca-certificates curl;

COPY colabkit-rca.crt /usr/local/share/ca-certificates/extra/colabkit-rca.crt
RUN set -ex; \
    update-ca-certificates; \
    keytool -keystore /opt/java/openjdk/lib/security/cacerts -storepass changeit \
        -noprompt -import -alias colabkit -file /usr/local/share/ca-certificates/extra/colabkit-rca.crt; \
    curl -sSL https://github.com/javamachr/sonar-gitlab-plugin/releases/download/5.4.0/sonar-gitlab-plugin-5.4.0.jar \
            -o /opt/sonarqube/extensions/plugins/sonar-gitlab-plugin-5.4.0.jar; \
    curl -sSL https://github.com/mc1arke/sonarqube-community-branch-plugin/releases/download/1.14.0/sonarqube-community-branch-plugin-1.14.0.jar \
            -o /opt/sonarqube/extensions/plugins/sonarqube-community-branch-plugin-1.14.0.jar;

FROM sonarqube:${SONARQUBE_VERSION}
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=build /opt/java/openjdk/lib/security/cacerts /opt/java/openjdk/lib/security/cacerts
COPY --from=build /opt/sonarqube/extensions/plugins/sonar-gitlab-plugin-5.4.0.jar /bundled-sonarqube-plugins/sonar-gitlab-plugin-5.4.0.bundled.jar
COPY --from=build /opt/sonarqube/extensions/plugins/sonarqube-community-branch-plugin-1.14.0.jar /bundled-sonarqube-plugins/sonarqube-community-branch-plugin-1.14.0.bundled.jar

COPY --chown=sonarqube:sonarqube sonarqube/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV SONAR_WEB_JAVAADDITIONALOPTS="-javaagent:./extensions/plugins/sonarqube-community-branch-plugin-1.14.0.bundled.jar=web"
ENV SONAR_CE_JAVAADDITIONALOPTS="-javaagent:./extensions/plugins/sonarqube-community-branch-plugin-1.14.0.bundled.jar=ce"

ENTRYPOINT ["/entrypoint.sh"]
