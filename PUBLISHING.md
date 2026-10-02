# GitHub Pages 公開手順

1. この更新ZIPの中身を `Nicole-Astronomy-Database` リポジトリのルートへアップロードします。
2. 既存の `versions/0.3.2/` は削除しません。
3. `versions/0.3.3/` とルートの最新版ファイル、`latest.json` を反映します。
4. GitHub Pages は `main` / `/ (root)` を維持します。
5. 解説エディタPWAは `description-editor.html` から起動します。

Service Workerは解説エディタのアプリシェルだけをキャッシュし、Nicole 0の `manifest.json` / `data/*.json` はキャッシュしません。
