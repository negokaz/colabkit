ARG NEXUS_VERSION=3.83.1

FROM sonatype/nexus3:${NEXUS_VERSION} AS certs

COPY colabkit-rca.crt /usr/local/share/ca-certificates/extra/colabkit-rca.crt

USER root

RUN set -ex; \
    cp /usr/lib/jvm/java-17-openjdk-*/lib/security/cacerts /tmp/cacerts; \
    ls -l /tmp; \
    keytool -keystore /tmp/cacerts -storepass changeit \
        -noprompt -import -alias colabkit -file /usr/local/share/ca-certificates/extra/colabkit-rca.crt;

FROM sonatype/nexus3:${NEXUS_VERSION}

USER root

COPY --from=certs /tmp/cacerts /tmp/cacerts
RUN set -ex; \
    mv /tmp/cacerts /usr/lib/jvm/java-17-openjdk-*/lib/security/cacerts;

USER nexus
