const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer:{
      host: '0.0.0.0',
      port:3000,
      client: {
        webSocketURL: 'ws://0.0.0.0:3000/ws',
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
     }),
      Components({
        resolvers: [ElementPlusResolver()]
     })
   ]
 }
})