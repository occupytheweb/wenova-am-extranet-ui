import {resolve, relative, extname} from 'path';
import handlebars from "vite-plugin-handlebars";
import {globSync} from 'glob';
import {fileURLToPath} from 'url';


export default {
  root: resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
      '~fontawesome': resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free'),
      '~notie': resolve(__dirname, 'node_modules/notie/src'),
    }
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials')
    })
  ],
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: Object.fromEntries(
        globSync('src/*.html')
          .map(
            file => [
              relative(
                'src',
                file.slice(0, file.length - extname(file).length)
              ),
              fileURLToPath(
                new URL(file, import.meta.url)
              )
            ]
          )
      )
      // see: https://rollupjs.org/configuration-options/#input:~:text=turn%20every%20file%20into%20an%20entry%20point
    }
  }
}
