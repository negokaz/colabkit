ARG OPENPROJECT_VERSION=15-slim

FROM openproject/openproject:${OPENPROJECT_VERSION} as certs

USER root
RUN set -ex; \
    apt-get update; \
    apt-get install -y ca-certificates;

COPY colabkit-rca.crt /usr/local/share/ca-certificates/extra/colabkit-rca.crt
RUN update-ca-certificates

FROM openproject/openproject:${OPENPROJECT_VERSION}
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
