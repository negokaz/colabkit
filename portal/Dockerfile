ARG MKDOCS_MATERIAL_VERSION
ARG NGINX_VERSION

FROM squidfunk/mkdocs-material:${MKDOCS_MATERIAL_VERSION} AS mkdocs

ARG HOST_IP \
    PORTAL_HTTP_PORT \
    PORTAL_HTTPS_PORT \
    GITLAB_PORT \
    GITLAB_MATTERMOST_PORT \
    GITLAB_PAGES_PORT \
    GITLAB_REGISTRY_PORT \
    SONARQUBE_PORT \
    GROWI_PORT \
    PLANTUML_PORT \
    LLDAP_WEB_PORT \
    TRAEFIK_DASHBOARD_PORT

COPY portal/mkdocs.yml /docs/mkdocs.yml
COPY portal/docs /docs/docs

RUN pip install mkdocs-macros-plugin

RUN mkdocs build


FROM nginx:${NGINX_VERSION}

COPY portal/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=mkdocs /docs/site /usr/share/nginx/html
