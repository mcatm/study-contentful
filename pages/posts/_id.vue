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
