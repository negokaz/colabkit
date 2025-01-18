FROM ubuntu/squid:5.2-22.04_beta

COPY squid/squid.conf /etc/squid/squid.conf
COPY squid/custom-entrypoint.sh /custom-entrypoint.sh

RUN chmod +x /custom-entrypoint.sh

VOLUME /var/spool/squid
VOLUME /var/log/squid

EXPOSE 3128

ENTRYPOINT ["/custom-entrypoint.sh"]
CMD ["-f", "/etc/squid/squid.conf", "-NYC"]
