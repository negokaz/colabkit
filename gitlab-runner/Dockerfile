FROM gitlab/gitlab-runner:latest as certs
RUN set -ex; \
    apt-get update; \
    apt-get install -y ca-certificates;

COPY colabkit-rca.crt /usr/local/share/ca-certificates/extra/colabkit-rca.crt
RUN update-ca-certificates

FROM gitlab/gitlab-runner:latest
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
