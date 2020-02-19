import Peer, { SfuRoom, MeshRoom } from 'skyway-js'
import { reactive, computed } from '@vue/composition-api'
import { getCameraStream } from '~/api/media'

export interface StreamSession {
  peerId: string
  stream?: MediaStream
}

export interface Member {
  peerId: string
}

export interface StreamStore {
  peer: Peer
  ready: boolean
  localStream?: MediaStream
  masterSession?: StreamSession
  master?: string
  room?: SfuRoom | MeshRoom
  members: Member[]
  sessions: StreamSession[]
}

export interface StartCastMessage {
  type: 'startCast'
  master: string
}

export interface StopCastMessage {
  type: 'stopCast'
}

export interface SyncMessage {
  type: 'sync'
  master: string
  members: Member[]
}

export type CastMessage = StartCastMessage | StopCastMessage | SyncMessage

export function isCastMessage(data: any): data is CastMessage {
  return 'type' in data
}

const setLocalStream = (store: StreamStore, localStream: MediaStream) => {
  store.localStream = localStream
}

export default function(skywayKey: string, localStream?: MediaStream) {
  const store = reactive<StreamStore>({
    localStream,
    peer: new Peer({ key: skywayKey }),
    members: [],
    sessions: [],
    ready: false
  })

  store.peer.on('open', (_peerId) => {
    store.ready = true
  })

  function joinRoom(roomName: string, roomMode: string) {
    if (roomMode !== 'sfu' && roomMode !== 'mesh')
      throw new Error(`Unknown room mode ${roomMode}`)

    if (!store.ready) {
      throw new Error('You called joinRoom before initialized Peer')
    }

    if (store.room) return // already joined

    store.room = store.peer.joinRoom<SfuRoom | MeshRoom>(roomName, {
      mode: roomMode
    })

    store.room.on('data', (data) => {
      if (isCastMessage(data.data)) {
        onCastMessage(data.data)
      }
    })

    store.room.on('peerJoin', (peerId) => {
      store.sessions.push({
        peerId
      })
      store.members.push({
        peerId
      })

      if (store.peer.id === store.master) {
        sendMessage(
          { type: 'sync', master: store.master, members: store.members },
          false
        )
      }
    })

    store.room.on('peerLeave', (peerId) => {
      store.sessions = store.sessions.filter(
        (session) => session.peerId !== peerId
      )
      store.members = store.members.filter((member) => member.peerId !== peerId)
      if (peerId === store.master) {
        store.master = undefined
      }
    })

    store.room.on('stream', (stream) => {
      console.log('stream')

      store.sessions = store.sessions.map((session) => {
        if (stream.peerId === session.peerId) {
          return {
            peerId: session.peerId,
            stream
          }
        } else {
          return session
        }
      })
      console.log(store)
    })
  }

  function sendMessage(msg: CastMessage, local: boolean = true) {
    if (store.room) store.room.send(msg)
    if (local) onCastMessage(msg)
  }

  async function startCast() {
    if (!store.room) throw new Error('No room')
    try {
      if (!store.localStream) {
        store.localStream = await getCameraStream(true)
      }

      store.room.replaceStream(store.localStream)
      store.sessions.push({
        peerId: store.peer.id,
        stream: store.localStream
      })

      sendMessage({
        type: 'startCast',
        master: store.peer.id
      })
    } catch (err) {
      alert('放送を開始出来ませんでした')
    }
  }

  function onCastMessage(data: CastMessage) {
    if (data.type === 'startCast') {
      store.master = data.master
    } else if (data.type === 'stopCast') {
      store.master = undefined
    } else if (data.type === 'sync') {
      store.master = data.master
      store.members = data.members
    }
  }

  const masterStream = computed(() => {
    const master = store.sessions.find(
      (session) => session.peerId === store.master
    )

    console.log('master')
    console.log(store)

    if (!master) return undefined
    if (!master.stream) return undefined

    // self cast is master, mute sounds
    if (master.peerId === store.peer.id) {
      return new MediaStream(master.stream.getVideoTracks())
    }

    console.log(master.stream)

    return master.stream
  })

  return {
    store,
    masterStream,
    setLocalStream,
    startCast,
    joinRoom
  }
}
