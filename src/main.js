import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createI18n } from 'vue-i18n'
import { loadFonts } from './plugins/webfontloader'
import App from '@/index.vue'
import router from './router'
import toastPlugin from 'vue-toast-notification'
import '@mdi/font/css/materialdesignicons.css'
import 'vue-toast-notification/dist/theme-sugar.css'
import './scss/variables.scss'
import 'vuetify/styles'

loadFonts()

const i18n = createI18n({
  locale: 'ja', // デフォルトの言語を日本語に設定
  messages: {
    ja: {
      // ここに他のメッセージを追加できます
    }
  }
})

const vuetify = createVuetify({
  locale: {
    locale: 'ja',
    fallback: 'en',
    messages: {
      ja: {
        badge: 'バッジ',
        close: '閉じる',
        dataIterator: {
          noResultsText: '一致するレコードが見つかりません。',
          loadingText: 'アイテムを読み込み中...'
        },
        dataTable: {
          itemsPerPageText: 'ページあたりの行数:',
          ariaLabel: {
            sortDescending: ': 降順でソート。ソートを解除するにはアクティブにします。',
            sortAscending: ': 昇順でソート。降順にソートするにはアクティブにします。',
            sortNone: ': ソートされていません。昇順でソートするにはアクティブにします。'
          },
          sortBy: 'ソート基準'
        },
        dataFooter: {
          itemsPerPageText: 'ページあたりのアイテム数:',
          itemsPerPageAll: 'すべて',
          nextPage: '次のページ',
          prevPage: '前のページ',
          firstPage: '最初のページ',
          lastPage: '最後のページ',
          pageText: '{0}-{1} の {2}'
        },
        datePicker: {
          itemsSelected: '{0} 個選択'
        },
        noDataText: 'データがありません',
        carousel: {
          prev: '前',
          next: '次',
          ariaLabel: {
            delimiter: 'カルーセルスライド {0}/{1}'
          }
        },
        calendar: {
          moreEvents: 'さらに{0}件'
        },
        fileInput: {
          counter: '{0} ファイル',
          counterSize: '{0} ファイル（合計 {1}）'
        },
        timePicker: {
          am: '午前',
          pm: '午後'
        }
      }
    }
  }
})

createApp(App).use(router).use(vuetify).use(i18n).use(toastPlugin).mount('#app')
