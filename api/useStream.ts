import Peer, { SfuRoom, MeshRoom } from 'skyway-js'
import { reactive, watch } from '@vue/composition-api'
import { getCameraStream } from '~/api/media'

export interface StreamSession {
  peerId: string
  stream?: MediaStream
}

interface Member {
  peerId: string
}

export interface StreamStore {
  peer: Peer
  ready: boolean
  localStream?: MediaStream
  master?: string
  alternative?: string // 中継映像(Masterを上書きする)
  room?: SfuRoom | MeshRoom
  leader?: string
  members: Member[]
  sessions: MediaStream[]
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
  leader: string | undefined
  master: string | undefined
  members: Member[]
}

export type CastMessage = StartCastMessage | StopCastMessage | SyncMessage

export function isCastMessage(data: any): data is CastMessage {
  return 'type' in data
}

export function useStream(
  skywayKey: string,
  roomName: string,
  roomMode: 'mesh' | 'sfu',
  localStream?: MediaStream
) {
  const store = reactive<StreamStore>({
    localStream,
    peer: new Peer({ key: skywayKey }),
    ready: false,
    members: [],
    sessions: [],
    master: undefined,
    alternative: undefined,
    room: undefined,
    leader: undefined
  })

  watch(() => {
    console.log(store.sessions)
  })

  function onCastMessage(data: CastMessage) {
    console.log(data)
    if (data.type === 'startCast') {
      // 放送者がリーダーもやる
      store.leader = data.master
      store.master = data.master
      console.log(store.master)
    } else if (data.type === 'stopCast') {
      store.master = undefined
    } else if (data.type === 'sync') {
      store.leader = data.leader
      store.master = data.master
      store.members = data.members
    }
  }

  function sendMessage(msg: CastMessage, local: boolean = true) {
    if (store.room) store.room.send(msg)
    if (local) onCastMessage(msg)
  }

  function sendSyncMessage() {
    sendMessage(
      {
        type: 'sync',
        leader: store.leader,
        master: store.master,
        members: store.members
      },
      false
    )
  }

  store.peer.on('open', (myPeerId) => {
    store.ready = true
    store.room = store.peer.joinRoom<SfuRoom | MeshRoom>(roomName, {
      mode: roomMode,
      stream: localStream
    })

    if (localStream) {
      const ms: any = new MediaStream(localStream.getVideoTracks())
      ms.peerId = store.peer.id
      store.sessions.push(ms)
    }

    store.members.push({
      peerId: myPeerId
    })

    store.leader = myPeerId

    store.room.on('data', (data) => {
      if (isCastMessage(data.data)) {
        onCastMessage(data.data)
      }
    })

    store.room.on('peerJoin', (peerId) => {
      store.members.push({
        peerId
      })

      if (store.peer.id === store.leader) {
        sendSyncMessage()
      }
    })

    store.room.on('log', (logs) => {
      logs.forEach((log) => {
        console.log(JSON.parse(log))
      })
    })

    store.room.on('peerLeave', (peerId) => {
      if (peerId === store.master) {
        store.master = undefined
      }
      if (peerId === store.leader) {
        // リーダーが退出した時はメンバーリストの先頭の人がリーダーになる
        // 自分がリーダーになった時はメンバーに同期メッセージを送信する(同期ずれで複数がリーダーになった時の対策)
        store.leader = store.members[0]?.peerId
        if (store.peer.id === store.leader) sendSyncMessage()
      }

      store.sessions = store.sessions.filter(
        (session) => session.peerId !== peerId
      )
      // delete store.sessions[peerId]
      store.members = store.members.filter((member) => member.peerId !== peerId)
    })

    store.room.on('stream', (stream) => {
      // store.sessions[stream.peerId] = stream
      store.sessions.push(stream)
      // console.log(store.sessions[stream.peerId])
    })
  })

  store.peer.on('error', console.error)

  async function startCast() {
    if (!store.room) throw new Error('No room')
    try {
      if (!store.localStream) {
        store.localStream = await getCameraStream(true)
        store.room.replaceStream(store.localStream)
        const ms: any = new MediaStream(store.localStream.getVideoTracks())
        ms.peerId = store.peer.id
        // store.sessions[store.peer.id] =
        store.sessions.push(ms)
      }

      sendMessage({
        type: 'startCast',
        master: store.peer.id
      })
    } catch (err) {
      alert('放送を開始出来ませんでした')
    }
  }

  async function stopCast() {
    sendMessage({
      type: 'stopCast'
    })
  }

  return {
    store,
    startCast,
    stopCast
  }
}
