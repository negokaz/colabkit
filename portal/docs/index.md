# Welcome!

Colabkit（コラボキット）はチームでソフトウェアを効率よく開発できるようにするサービスを提供するプラットフォームです。

初めて利用する方は [ユーザーガイド](ユーザーガイド.md) に従って設定してください。

- [GitLab](https://{{HOST_IP}}:{{GITLAB_PORT}}/)
    - プロジェクト管理、コードレビュー、CI/CD などの機能を提供する Git リポジトリマネージャ
- [Mattermost](https://{{HOST_IP}}:{{GITLAB_MATTERMOST_PORT}}/)
    - チャットサービス
- [Growi](https://{{HOST_IP}}:{{GROWI_PORT}}/)
    - 共同編集可能なナレッジ共有サービス

## 管理者向けサービス

- [LLDAP](https://{{HOST_IP}}:{{LLDAP_WEB_PORT}}/)
    - 各サービスにアクセスするためのユーザーを一元管理する LDAP 管理サービス
- [traefik dashboard](https://{{HOST_IP}}:{{TRAEFIK_DASHBOARD_PORT}}/)
    - リバースプロキシのダッシュボード
