import { reactive } from '@vue/composition-api'

export interface Member {
  id: string
  name: string
  mediaStream?: MediaStream
}

export interface TvStore {
  channel?: string
  master?: string
  selfStream?: MediaStream
  members: Member[]
}

export function createTvStore(channel: string) {
  const store = reactive({
    channel,
    master: undefined,
    members: []
  } as TvStore)

  return {
    store,

    setMaster(m?: string) {
      store.master = m
    },

    addMember(newMember: Member) {
      store.members.push(newMember)
    },

    setStream(stream: MediaStream) {
      store.selfStream = stream
    }
  }
}
