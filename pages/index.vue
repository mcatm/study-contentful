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

// console.log(process.env.NODE_ENV)

export default {
  name: 'Home',
  head: () => {
    return {
      title: 'Home'
    }
  },
  components: {},
  asyncData({ env, params }) {
    return client
      .getEntries({
        limit: 20,
        content_type: 'post',
        order: '-sys.createdAt'
      })
      .then(entries => {
        return {
          posts: entries.items.map( item => {
            if( item.fields.media ) {
              client.getAsset(item.fields.media.sys.id)
                .then( asset => item.image = asset.fields )
                .catch(console.error)
            }
            return item
          })
        }
      })
      .catch(console.error)
  }
}
</script>
