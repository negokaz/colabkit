ARG GITLAB_VERSION=17.6.1-ce.0

FROM gitlab/gitlab-ce:${GITLAB_VERSION} as certs
RUN set -ex; \
    apt-get update; \
    apt-get install -y ca-certificates;

COPY colabkit-rca.crt /usr/local/share/ca-certificates/extra/colabkit-rca.crt
RUN update-ca-certificates

FROM gitlab/gitlab-ce:${GITLAB_VERSION}
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
