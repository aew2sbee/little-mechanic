# little-mechanic

小さな子ども向けの、こわれたくるまを なおす Web アプリ「ちいさな しゅうりやさん」です。

https://aew2sbee.github.io/little-mechanic/

## あそびかた

1. ガレージに並んだ 3 台から、なおすくるまを選びます。
2. ①こまった: くるまが見せる影と同じ形の工具を選びます。ちがう工具はゆれるだけで、何度でも選び直せます。
3. ②はずす: ねじを何回かタッチして外すと、こわれた部品が落ちます。
4. ③つける: 新しい部品を指で運んではめ、ねじを締めます。
5. ④おそうじ: どろんこを指でこすって落とします。7 割きれいになれば完了です。
6. ⑤げんき: くるまが元気に走り、シールがもらえます。シールが 20 枚そろうとパレードが見られます。

5 秒何もしないと、次にさわる場所を指のアイコンが教えます。

## 保護者設定

ガレージ右下の歯車を 3 秒長押しすると開きます。効果音のオン・オフと、シールのリセットができます。

## Development

```sh
npm install
npm run dev        # http://localhost:5173/little-mechanic/
npm test
npm run test:e2e
npm run lint
npm run build
```

Every pull request gets a preview at `https://aew2sbee.github.io/little-mechanic/pr-preview/pr-<number>/`. Changes reach `main` only through a reviewed PR.
