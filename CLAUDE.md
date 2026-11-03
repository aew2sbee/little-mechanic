# little-mechanic

小さな子ども向けの、こわれたくるまを なおす Web アプリ「ちいさな しゅうりやさん」。ガレージに並んだくるまを選び、①困った（合う工具を選ぶ）→ ②なおす → ③元気に走る、の順に進める。②の直し方はトラブルで変わる。こわれた部品は電動ドライバーで交換し（ねじを外す → 新しい部品をはめる → ねじを締める）、パンクは空気入れで空気を入れ、エンジンのオイル切れはオイルさしでオイルをさす。ねじ・空気・オイルは、どれも長押しで進む。1台なおすごとにシールがもらえ、20枚そろうとパレードが見られる。Vite + React + TypeScript で静的に出力し、GitHub Pages（`https://aew2sbee.github.io/little-mechanic/`）で公開する。

## 守ること

- **文字が読めなくても遊べること。** 絵とアイコン中心にし、子どもが見る文字はひらがなで書く（伸ばす音は「ー」）。保護者設定だけは大人向けなので通常の日本語にする。
- **失敗にしない。** まちがった工具を選んでも、ゆれて音が鳴るだけで、やり直せる。長押しを途中でやめても、進んだ分は残る。制限時間も設けない。
- **タッチ操作が前提。** タブレット横向きを主な対象とし、指で押しやすい大きさにする。スクロール・ピンチズーム・長押しメニューで遊びが中断されないようにする。
- **外部への通信や広告、課金、トラッキングを入れない。** 絵は SVG、音は Web Audio API でその場で作る。
- **main へは PR 経由だけ。** 作業は `feat/xxx` などのブランチで行う。
- **Service Worker は登録しない。** 本番のスコープが `pr-preview/` 配下のプレビューまで含んでしまうため。

## 開発

```sh
npm install
npm run dev        # http://localhost:5173/little-mechanic/
npm test           # Vitest
npm run test:e2e   # Playwright（ビルドしてから、タブレット横向きの画面で修理を通す）
npm run lint       # ESLint（機能をまたいだ内部 import の検出を含む）
npm run build
```

## 設計とテスト

### 機能別パッケージング
- フォルダは種類別（components/、hooks/、utils/ など）にせず、機能ごとに分ける。

```
src/
  app/                 アプリの入口・画面遷移・画面全体の拡大縮小
  features/
    garage/            ガレージ画面・修理待ちキュー
    repair/            ①困った・②なおす（部品交換・空気入れ・オイル）・長押し・ねじ・部品
    celebration/       ③元気に走る演出・パレード
    stickers/          シール帳・進捗の保存
    parent-settings/   保護者設定
    vehicles/          くるまと修理依頼のデータ・くるまのSVG
  shared/
    sound/             効果音（Web Audio API）
    hint/              5秒ヒントの指アイコン
    ui/                共通の部品（大きなボタンなど）
```

- 各機能フォルダには、その機能の画面部品・ロジック・テストをまとめて置く。テストは対象ファイルの隣に `*.test.ts(x)` として置く。
- 各機能は、外に見せるものだけを `index.ts` から公開する。ほかの機能からは `index.ts` 経由でしか読み込まず、内部ファイルを直接 import しない（ESLint の no-restricted-imports で検出する）。
- 依存の向きは app → features → shared の一方向にする。shared から features は読み込まない。
- くるまや依頼を追加するときは、features/vehicles のデータを変えるだけで済む作りにする。

### テスト対象システム（SUT）
- テストツールは Vitest + React Testing Library + user-event を使う。修理1件を最後まで通す確認は Playwright で、タブレット横向きの画面サイズで行う。
- テストの中では、検証する対象を必ず `sut` という変数名にして、テストダブル（偽物）と区別する。
- SUT そのものはモックしない。差し替えるのは、SUT が頼っている外部のもの（乱数・時刻・効果音・localStorage）だけにする。そのため、これらは外から渡せる作りにする（依存性の注入）。
- ロジックは React から切り離し、純粋な関数や状態遷移として書く。画面はロジックの結果を表示するだけにする。
- 主な SUT とテスト観点：

| SUT | 置き場所 | テスト観点 |
|---|---|---|
| 修理の工程進行 | features/repair | ①〜③の順に進む。まちがった工具では進まないが、失敗状態にもならない |
| 長押しの進み具合（ねじ・空気・オイル） | features/repair | 決まった時間長押しすると終わり、足りないと終わらない。途中で離しても進んだ分は残る |
| 部品の吸着判定 | features/repair | 吸着範囲の内側ならはまり、外側なら元の位置に戻る |
| 修理待ちキュー | features/garage | 常に3台並ぶ。同じ依頼が続かない（乱数を固定して確認する） |
| シール帳 | features/stickers | 保存して読み込める。全件そろうとパレードが解放される。リセットで空になる |
| ヒント表示 | shared/hint | 5秒操作がないと表示され、触ると消える（偽のタイマーで確認する） |
| 保護者設定の長押し | features/parent-settings | 3秒長押しで開き、短く押しただけでは開かない |
| くるまと依頼のデータ | features/vehicles | 全20件に部品・工具・ねじ位置・アイコンがそろい、直し方が部品に合っている（空気はたいや、オイルはえんじん） |

### AAAパターン
- すべてのテストを Arrange（準備）／Act（実行）／Assert（確認）の3つに分け、`// Arrange` `// Act` `// Assert` のコメントで区切る。
- Act は1つのテストにつき1回だけ。1つのテストで確かめる振る舞いは1つにする。
- テスト名は日本語で「〜のとき、〜になる」の形で書く。
- テスト同士で状態を共有しない。必要なものは毎回 Arrange で作り直す。
- 例：

```ts
it('リセットしたとき、シールは空になる', () => {
  // Arrange
  const sut = createStickerBook({ storage: createFakeStorage(), stickerIds });
  sut.collect('a');

  // Act
  sut.reset();

  // Assert
  expect(sut.collected()).toEqual([]);
});
```

### テストの進め方と完成の条件
- 機能を1つ作るたびに、その SUT のテストを書き、`npm test` が通ってから次に進む。
- 完成時には `npm test` と Playwright のテストがすべて通り、機能をまたいだ内部 import が ESLint で1件も検出されないこと。

## 補足

- TypeScript は `~6.0` に固定している。ESLint の `typescript-eslint` が TypeScript 7 にまだ対応していないため。
- ESLint の境界ルールそのものも `eslint.config.test.ts` でテストしている（違反を本当に検出できることの確認）。
- 進捗（シール・効果音の設定）は `localStorage` に、公開先の `BASE_URL` を付けたキーで保存する。GitHub Pages では本番と各 PR プレビューが同じオリジンを共有するため。
