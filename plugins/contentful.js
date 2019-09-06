const contentful = require('contentful')

export const client = contentful.createClient({
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN
})

export const previewClient = contentful.createClient({
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CPA_ACCESS_TOKEN,
  host: 'preview.contentful.com'
})