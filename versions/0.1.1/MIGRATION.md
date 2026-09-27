# MIGRATION PLAN — v0.1.1

## Nicole 2
1. DB参照を開発版で0.1.1へ固定。
2. `photometry.display_color_hex` を恒星描画へ接続。
3. `constellation_id` を個別表示ツリーへ利用。
4. M1〜M110を検索・表示テスト。
5. `double_star` / `asterism` / `star_cloud` の表示互換性を確認。
6. `spring_arc` を季節台本へ接続。

## GitHub Pages
`versions/0.1.0/` は残し、`versions/0.1.1/` を追加。
検証後にroot `latest.json` を0.1.1へ更新。
