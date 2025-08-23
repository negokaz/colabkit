FROM elasticsearch:8.7.0

RUN bin/elasticsearch-plugin install analysis-kuromoji
RUN bin/elasticsearch-plugin install analysis-icu

COPY growi-elasticsearch/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml
