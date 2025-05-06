import { useQuasar } from 'quasar'
import { dialogOptions } from 'src/utils/values'

const PASSWORD_KEY = 'access_password_verified'
const PASSWORD = '123147'

export function useAccessPassword() {
  const $q = useQuasar()

  function isVerified() {
    return localStorage.getItem(PASSWORD_KEY) === '1'
  }

  async function ensureVerified() {
    if (isVerified()) return true
    return new Promise(resolve => {
      $q.dialog({
        title: '访问验证',
        message: '请输入访问密码',
        prompt: {
          model: '',
          type: 'password',
          label: '访问密码',
          autofocus: true
        },
        cancel: false,
        persistent: true,
        ...dialogOptions
      }).onOk(val => {
        if (val === PASSWORD) {
          localStorage.setItem(PASSWORD_KEY, '1')
          resolve(true)
        } else {
          $q.notify({ message: '密码错误', color: 'negative' })
          setTimeout(() => ensureVerified().then(resolve), 300)
        }
      })
    })
  }

  return { isVerified, ensureVerified }
}
