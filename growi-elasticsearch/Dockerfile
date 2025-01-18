ARG ELASTICSEARCH_VERSION

FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTICSEARCH_VERSION}

RUN bin/elasticsearch-plugin install analysis-kuromoji
RUN bin/elasticsearch-plugin install analysis-icu

COPY growi-elasticsearch/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml
