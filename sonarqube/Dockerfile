ARG SONARQUBE_VERSION

FROM sonarqube:${SONARQUBE_VERSION} as certs

USER root
RUN set -ex; \
    apt-get update; \
    apt-get install -y ca-certificates;

COPY colabkit-rca.crt /usr/local/share/ca-certificates/extra/colabkit-rca.crt
RUN set -ex; \
    update-ca-certificates; \
    keytool -keystore /opt/java/openjdk/lib/security/cacerts -storepass changeit \
        -noprompt -import -alias colabkit -file /usr/local/share/ca-certificates/extra/colabkit-rca.crt;

FROM sonarqube:${SONARQUBE_VERSION}
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=certs /opt/java/openjdk/lib/security/cacerts /opt/java/openjdk/lib/security/cacerts
