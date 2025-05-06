<template>
  <router-view />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFirstVisit } from './composables/first-visit'
import { useLoginDialogs } from './composables/login-dialogs'
import { useSetTheme } from './composables/set-theme'
// 已禁用订阅通知
// import { useSubscriptionNotify } from './composables/subscription-notify'
import { onMounted } from 'vue'
import { checkUpdate, ready } from './utils/update'
// 已禁用访问密码功能
// import { useAccessPassword } from './composables/access-password'

defineOptions({
  name: 'App'
})

useSetTheme()
useLoginDialogs()
useFirstVisit()
// 已禁用订阅通知
// useSubscriptionNotify()

const router = useRouter()
router.afterEach(to => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - AI as Workspace`
  }
})

// 已禁用访问密码功能
// const { ensureVerified } = useAccessPassword()

onMounted(async () => {
  // 已禁用访问密码功能
  // await ensureVerified()
  ready()
  checkUpdate()
})

</script>
