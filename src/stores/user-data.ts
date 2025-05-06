import { defineStore } from 'pinia'
import { persistentReactive } from 'src/composables/persistent-reactive'

interface UserData {
  lastWorkspaceId: string
  noobAlertDismissed: boolean,
  tipDismissed: Record<string, boolean>
  // 已移除订阅相关字段
}

export const useUserDataStore = defineStore('user-data', () => {
  const [data, ready] = persistentReactive<UserData>('#user-data', {
    lastWorkspaceId: null,
    noobAlertDismissed: false,
    tipDismissed: {}
    // 已移除订阅相关字段
  })
  return { data, ready }
})
