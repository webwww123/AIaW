import { until } from '@vueuse/core'
import { useObservable } from '@vueuse/rxjs'
import { useQuasar } from 'quasar'
import { useUserDataStore } from 'src/stores/user-data'
import { DexieDBURL } from 'src/utils/config'
import { db } from 'src/utils/db'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useSubscriptionNotify() {
  // 已禁用订阅通知功能

}
