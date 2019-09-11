# contentful

> My extraordinary Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

---

# Contentful

![スクリーンショット 2019-09-09 18.15.00](img/スクリーンショット 2019-09-09 18.15.00.png)

簡単なLP案件とか、ちょっとしたコーポレートサイト案件で、**「『お知らせ』だけはCMS化したい…」**とか、そんな要件を満たすために、バックエンドエンジニアをアサインして、サーバーを契約して、Wordpress設計して、実装、デプロイ…とか。最終的に予算も膨らんじゃうので見送りとか、そういうことありますよね。そんな時のために、SaaSのヘッドレスCMS**「Contentful」**を使ってみましょうぜ！



**特徴**

- 無料：5,000エントリ（画像なども1エントリ）まで無料
- APIベース：各種SDKも充実
- コンテンツモデル：コンテンツを管理画面から設計可能



- [Contentful Javascript SDK](https://contentful.github.io/contentful.js/contentful/7.9.1/ContentfulClientAPI.html)
- [テストリポジトリ](https://github.com/mcatm/study-contentful)





Nuxtアプリ作成

```sh
$ npx create-nuxt-app contentful

> Generating Nuxt.js project in /Users/mcatm/Sites/_lab/contentful
? Project name contentful
? Project description My extraordinary Nuxt.js project
? Use a custom server framework none
? Choose features to install Progressive Web App (PWA) Support, Axios
? Use a custom UI framework buefy
? Use a custom test framework jest
? Choose rendering mode Single Page App
? Author name mcatm
? Choose a package manager yarn
```

- [Buefy: lightweight UI components for Vue.js based on Bulma | Buefy](https://buefy.org/)
- [Bulma: Free, open source, & modern CSS framework based on Flexbox](https://bulma.io/)



```sh
$ cd contentful
$ yarn dev
```

http://localhost:3000





### Githubにリポジトリを準備

https://github.com/new



```sh
git init
git add .
git commit -am "first commit"
git remote add origin git@github.com:xxxxx/xxxxxxxxxxxxxx.git
git push -u origin master
```



### Netlifyとリポジトリを接続

[Netlify: All-in-one platform for automating modern web projects.](https://www.netlify.com/)



Build Command: `yarn run generate`

`git push`するだけで、自動的にサイトが生成されます。



https://www.netlify.com/pricing/



### Contentfulの準備

[https://app.contentful.com](https://app.contentful.com/)



![スクリーンショット 2019-09-05 17.37.13](img/スクリーンショット 2019-09-05 17.37.13.png)



- 「Create New Space」：「I create content」で大丈夫です
- 「Create New Content Model」
  - Add fieldでTitleとContentを追加 → 「Create and configure」
    - Titleは、「Text」で作成
      - 「This field represents the Entry title」にチェックを入れる
    - Contentは、Rich Textで作成
  - 最後にSave
- 「Content > Add Post」



![スクリーンショット 2019-09-05 17.39.44](img/スクリーンショット 2019-09-05 17.39.44.png)



### Nuxtの調整

#### 環境変数を扱う

```sh
$ yarn add dotenv
$ touch .env
```

`.env`は既に`.gitignore`されています。



Netlifyでは、Settingページから環境変数の登録ができます。



#### Contentfulとの接続

```sh
$ yarn add contentful
```



「Setting > API Keys」から、API Keyを出力



**.env**

```.env
CTF_SPACE_ID={ Space ID }
CTF_CDA_ACCESS_TOKEN={ Content Delivery API - access token }
CTF_POST_TYPE_ID={ Content Model }
```



**nuxt.config.js**

```js
if(process.env.NODE_ENV == 'development') require('dotenv').config()

export default {
  ...

  env: process.env,

  ...
}
```

Nuxtに環境変数を登録する（これがなぜ必要なのかは把握できてない）。



**plugins/contentful.js**

```js
const contentful = require('contentful')

export const client = contentful.createClient({
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN
})
```



### Content









### 記事一覧

**pages/index.vue**

```vue
<template>
  <section class="section">
    <div class="columns is-mobile">
      <ul>
        <li
          v-for="(post, i) of posts"
          :key="i"
          :post="post"
          class="box"
        >
          <div class="content">
            <h1 class="title is-4">
              <nuxt-link :to="{ name: 'posts-id', params: { id: post.sys.id }}">
                {{ post.fields.title }}
              </nuxt-link>
            </h1>
            <p>{{ post.fields.summary }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { client } from '~/plugins/contentful'

export default {
  asyncData({ env, params }) {
    return client
      .getEntries({
        limit: 20,
        content_type: 'post',
        order: '-sys.createdAt'
      })
      .then(entries => {
        return {
          posts: entries.items
        }
      })
      .catch(console.error)
  }
}
</script>

```



### 記事詳細



**pages/posts/_id.vue**

```vue
<template>
  <section class="section">
    <div class="columns is-mobile">
      <div class="content">
        <h1 class="title is-2">
          {{ post.fields.title }}
        </h1>
        <div class="image is-small" v-if="post.image"><img :src=post.image.file.url></div>
        <div class="mb" v-html="renderText(post.fields.content)" v-if="typeof post.fields.content === 'object'"></div>
        <p>
          <b-button tag="router-link"
            to="/"
            type="is-link">
            HOME
          </b-button>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { client } from '~/plugins/contentful'

export default {
  name: 'PostDetail',
  head: () => {
    return {
      title: 'Detail'
    }
  },
  components: {},
  asyncData({ env, params }) {
    return client
      .getEntry(params.id)
      .then(entry => {
        if( entry.fields.image ) {
          client.getAsset(entry.fields.image.sys.id)
            .then( asset => entry.image = asset.fields )
            .catch(console.error)
        }
        console.log(entry)
        return {
          post: entry
        }
      })
      .catch(console.error)
  },
  methods: {
    renderText: (obj) => {
      return documentToHtmlString(obj)
    }
  }
}
</script>

<style scoped>
.mb {
  margin-bottom: 30px;
}

.image {
  margin-bottom: 20px;
}

.image.is-small {
  max-width: 200px;
  height: auto;
}
</style>

```





## リッチテキスト

`@contentful/rich-text-html-renderer`をインストール

```sh
$ yarn add @contentful/rich-text-html-renderer
```



```vue
<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

export default {
  ...

  methods: {
    renderText: (obj) => {
      return documentToHtmlString(obj)
    }
  }

  ...
}

</script>
```







## 画像の扱い

- [Images – Contentful](https://www.contentful.com/developers/docs/concepts/images/)



```js
if( entry.fields.image ) {
  client.getAsset(entry.fields.image.sys.id)
    .then( asset => entry.image = asset.fields )
    .catch(console.error)
}
```





## プレビュー

- [Content Preview API – Contentful](https://www.contentful.com/developers/docs/references/content-preview-api/)
- [Contentfulの料金と使い方を整理しつつ、Nuxt.jsと組み合わせてブログを作る - Qiita](https://qiita.com/nishinoshake/items/466db319ec485ebc7db8)



「Settings > Content Preview」



「Add Content Preview」



「Content Preview Urls」に`http://localhost:3000/posts/{entry.sys.id}?mode=preview`を入力してSave



`createClient()`の際に、`host`に**preview.contentful.com**を指定。`accessToken`も、「Content Preview API - access token」を使用する



```js
export const previewClient = contentful.createClient({
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CPA_ACCESS_TOKEN,
  host: 'preview.contentful.com'
})
```



**pages/posts/_id.vue**

```js
<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { client, previewClient } from '~/plugins/contentful'

export default {
  name: 'PostDetail',
  head: () => {
    return {
      title: 'Detail'
    }
  },
  components: {},
  asyncData(context) {
    const c = context.query.mode == "preview" ? previewClient : client # ?mode=previewだった時、clientにpreviewを設定
    return c
      .getEntry(context.params.id)
      .then(entry => {
        if( entry.fields.image ) {
          c.getAsset(entry.fields.image.sys.id)
            .then( asset => entry.image = asset.fields )
            .catch(console.error)
        }
        console.log(entry)
        return {
          post: entry
        }
      })
      .catch(console.error)
  },
  methods: {
    renderText: (obj) => {
      return documentToHtmlString(obj)
    }
  }
}
</script>
```



※認証がかからない件、どうしよう？：Tokenでカバーする、とか



---



### メリット

- 構築が超容易
- 構造の自由度は比較的高い



### デメリット

- プレビューのセキュリティ
- 画像など入れて5000Entriesが十分か少ないか
