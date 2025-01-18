#!/bin/bash

if [[ ! -z "${HTTP_PROXY}" ]]; then
    # Extract host and port from HTTP_PROXY
    if [[ "${HTTP_PROXY}" =~ ^http://([^:/]+)(:([0-9]+))?/?.*$ ]]; then
        HOST="${BASH_REMATCH[1]}"
        PORT="${BASH_REMATCH[3]}"
        echo "Using upstream proxy: ${HOST}:${PORT}"
        {
            # Add cache_peer configuration
            echo "# Upstream proxy configuration"
            echo "cache_peer ${HOST} parent ${PORT} 0 no-query no-digest default"
            echo "never_direct allow all"
            echo "always_direct deny all"
        } >> /etc/squid/squid.conf
    else
        echo "Warning: Invalid HTTP_PROXY format. Expected http://host:port" >&2
    fi
else
    echo "No upstream proxy configured"
    {
        echo "always_direct allow all"
    } >> /etc/squid/squid.conf
fi

exec /usr/local/bin/entrypoint.sh "$@"
