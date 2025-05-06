// 已禁用访问密码功能
// import { useQuasar } from 'quasar'
// import { dialogOptions } from 'src/utils/values'

// 已禁用访问密码功能
// const PASSWORD_KEY = 'access_password_verified'
// const PASSWORD = '123147'

export function useAccessPassword() {
  // const $q = useQuasar()

  function isVerified() {
    // 已禁用密码验证，始终返回已验证状态
    return true
  }

  async function ensureVerified() {
    // 已禁用密码验证，直接返回已验证状态
    return true
  }

  return { isVerified, ensureVerified }
}
