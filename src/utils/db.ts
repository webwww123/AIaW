import Dexie from 'dexie'
import { defaultAvatar, genId } from './functions'
import { Workspace, Folder, Dialog, Message, Assistant, Artifact, StoredReactive, InstalledPlugin, AvatarImage, StoredItem, CustomProvider } from './types'
import { AssistantDefaultPrompt, ExampleWsIndexContent } from './templates'
import dexieCloud, { DexieCloudTable } from 'dexie-cloud-addon'
import { DexieDBURL } from './config'
import { i18n } from 'src/boot/i18n'

type Db = Dexie & {
  workspaces: DexieCloudTable<Workspace | Folder, 'id'>
  dialogs: DexieCloudTable<Dialog, 'id'>
  messages: DexieCloudTable<Message, 'id'>
  assistants: DexieCloudTable<Assistant, 'id'>
  artifacts: DexieCloudTable<Artifact, 'id'>
  installedPluginsV2: DexieCloudTable<InstalledPlugin, 'id'>
  reactives: DexieCloudTable<StoredReactive, 'key'>
  avatarImages: DexieCloudTable<AvatarImage, 'id'>
  items: DexieCloudTable<StoredItem, 'id'>
  providers: DexieCloudTable<CustomProvider, 'id'>
}

const db = new Dexie('data', { addons: DexieDBURL ? [dexieCloud] : [] }) as Db

if (DexieDBURL) {
  db.cloud.configure({
    databaseUrl: DexieDBURL,
    requireAuth: false,
    customLoginGui: true,
    nameSuffix: false,
    tryUseServiceWorker: false,
    disableWebSocket: false, // 启用 WebSocket 以支持实时同步
    disableEagerSync: false, // 启用主动同步以确保数据及时同步
    // 确保所有表都可以同步，没有限制
    unsyncedTables: []
  })

  // 设置定期手动同步
  setInterval(() => {
    if (db.cloud.currentUser.value?.isLoggedIn) {
      db.cloud.sync().catch(error => {
        console.warn('DexieCloud sync error:', error)
      })
    }
  }, 30000) // 每30秒尝试同步一次
}
db.version(6).stores({
  workspaces: 'id, type, parentId',
  dialogs: 'id, workspaceId',
  messages: 'id, type, dialogId',
  assistants: 'id, workspaceId',
  canvases: 'id, workspaceId', // deprecated
  artifacts: 'id, workspaceId',
  installedPluginsV2: 'key, id',
  reactives: 'key',
  avatarImages: 'id',
  items: 'id, type, dialogId',
  providers: 'id'
})

const defaultModelSettings = {
  temperature: 0.6,
  topP: 1,
  presencePenalty: 0,
  frequencyPenalty: 0,
  maxSteps: 4,
  maxRetries: 1
}

const { t } = i18n.global

db.on.populate.subscribe(() => {
  db.on.ready.subscribe((db: Db) => {
    const initialWorkspaceId = genId()
    const initialAssistantId = genId()
    db.workspaces.add({
      id: initialWorkspaceId,
      name: t('db.exampleWorkspace'),
      avatar: { type: 'icon', icon: 'sym_o_menu_book' },
      type: 'workspace',
      parentId: '$root',
      prompt: '',
      defaultAssistantId: initialAssistantId,
      indexContent: ExampleWsIndexContent,
      vars: {},
      listOpen: {
        assistants: true,
        artifacts: false,
        dialogs: true
      }
    } as Workspace)
    db.assistants.add({
      id: initialAssistantId,
      name: t('db.defaultAssistant'),
      avatar: defaultAvatar('AI'),
      workspaceId: initialWorkspaceId,
      prompt: '',
      promptTemplate: AssistantDefaultPrompt,
      promptVars: [],
      provider: null,
      model: null,
      modelSettings: { ...defaultModelSettings },
      plugins: {},
      promptRole: 'system',
      stream: true
    })
    db.reactives.add({
      key: '#user-data',
      value: {
        lastWorkspaceId: initialWorkspaceId
      }
    })
  }, false)
})

// Migration
db.assistants.hook('reading', assistant => {
  assistant.promptRole ??= 'system'
  assistant.stream ??= true
  return assistant
})
// Migration to v1.4
db.workspaces.hook('reading', workspace => {
  if (workspace.type === 'workspace') {
    workspace.listOpen ??= {
      assistants: true,
      artifacts: false,
      dialogs: true
    }
  }
  return workspace
})

export { db, defaultModelSettings }
export type { Db }
