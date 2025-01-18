FROM debian:12-slim

RUN set -ex; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        openssl \
    ; \
    rm -rf /var/lib/apt/lists/*

COPY tls-certs-generator/generate-certs /generate-certs
RUN chmod +x /generate-certs

VOLUME "/certs"
WORKDIR "/certs"

ENTRYPOINT ["/generate-certs"]
