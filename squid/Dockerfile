ARG UBUNTU_SQUID_VERSION

FROM ubuntu/squid:${UBUNTU_SQUID_VERSION}

COPY squid/squid.base.conf /etc/squid/squid.base.conf
COPY squid/custom-entrypoint.sh /custom-entrypoint.sh

RUN chmod +x /custom-entrypoint.sh

VOLUME /var/spool/squid
VOLUME /var/log/squid

EXPOSE 3128

ENTRYPOINT ["/custom-entrypoint.sh"]
CMD ["-f", "/etc/squid/squid.conf", "-NYC"]
