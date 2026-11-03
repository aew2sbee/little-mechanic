# little-mechanic

小さな子ども向けの、こわれたくるまを なおす Web アプリ「ちいさな しゅうりやさん」です。

https://aew2sbee.github.io/little-mechanic/

## あそびかた

1. ガレージに並んだ 3 台から、なおすくるまを選びます。
2. ①こまった: くるまが見せる影と同じ形の工具を選びます。工具は でんどうどらいばー・くうきいれ・おいるさし の3つです。ちがう工具はゆれるだけで、何度でも選び直せます。
3. ②なおす: トラブルによって直し方が変わります。どれも工具を長押しして進めます。途中で指を離しても、進んだ分は残ります。
   - こわれた部品: でんどうどらいばーでねじを外し、新しい部品を指で運んではめて、ねじを締めます。
   - パンク: くうきいれで空気を入れて、タイヤをふくらませます。
   - オイル切れ: おいるさしで、エンジンにオイルをさします。
4. ③げんき: くるまが元気に走り、シールがもらえます。シールが 20 枚そろうとパレードが見られます。

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
