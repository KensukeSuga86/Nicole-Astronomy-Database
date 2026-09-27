# Nicole Astronomy Database v0.1.0

Nicole the Astronavigator v1.12.0 に内蔵されていた静的な天体・星座データを、Nicole 1 / Nicole 2 で共有できる形へ分離した最初の版です。

## 収録内容

- 88星座
- 恒星 64件
  - Nicole 1で詳細解説を持つ恒星: 22件
  - 星図/アステリズム用補助恒星を含む
- 惑星 7件
- 銀河・星雲・星団・超新星残骸 47件
- アステリズム 8件
- Nicole 1で使用している外部データソース定義

## 方針

- Nicole 1の既存IDをそのまま**不変ID**として採用。
- 表示名とIDを分離。
- 解説文は `overview / observing / science / history` に構造化しつつ、元のHTMLも保持。
- 星座は `science / myth` を分離。
- アプリ固有のUI状態や描画処理はDBへ入れない。
- 動的位置を持つ惑星は説明データだけをDB化し、位置計算はエンジン側に残す。
- Nicole 1に存在しない情報は勝手に補完しない。

## ファイル

- `manifest.json` — DBバージョン、件数、SHA-256
- `data/constellations.json`
- `data/stars.json`
- `data/planets.json`
- `data/deep-sky.json`
- `data/asterisms.json`
- `data/catalog.json`
- `data/external-sources.json`
- `adapters/database-loader.js`
- `adapters/nicole1-compat.js`
- `MIGRATION.md`
- `VALIDATION.md`

## 次の作業候補

1. Nicole 2をこのDB読込へ切り替える。
2. DSOのIAU星座所属を正式データで補完する。
3. 恒星にB−V / スペクトル型 / 表示色を追加する。
4. Nicole 1をcompat adapter経由で同じDBへ切り替える。
5. 星の鳥または専用GitHubリポジトリへ配置する。
