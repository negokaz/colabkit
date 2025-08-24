import os

def define_env(env):
    # This is the hook for defining variables, macros and filters
    # https://mkdocs-macros-plugin.readthedocs.io/en/latest/macros/

    # 環境変数をテンプレートの変数に埋め込む
    for k, v in os.environ.items():
        if not k.isidentifier():
            continue
        if k.isupper() and '_' in k:
          env.variables[k] = v
