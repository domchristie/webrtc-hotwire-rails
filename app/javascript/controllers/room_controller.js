import { Controller } from '@hotwired/stimulus'
import Client from 'models/client'
import Peer from 'simple-peer'
import RoomSubscription from 'subscriptions/room_subscription'
import Signaller from 'subscriptions/signaling_subscription'

export default class RoomController extends Controller {
  connect() {
    this.clients = {}
    this.client = new Client(this.clientIdValue)

    this.subscription = new RoomSubscription({
      delegate: this,
      id: this.idValue,
      clientId: this.client.id
    })

    this.signaller = new Signaller({
      delegate: this,
      id: this.idValue,
      clientId: this.client.id
    })
  }

  async enter () {
    try {
      const constraints = { audio: true, video: true }
      this.client.stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.localMediumTarget.srcObject = this.client.stream
      this.localMediumTarget.muted = true // Keep muted on Firefox
      this.enterTarget.hidden = true

      this.subscription.start()
      this.signaller.start()
    } catch (error) {
      console.error(error)
    }
  }

  greetNewClient ({ from }) {
    const otherClient = this.findOrCreateClient(from)
    otherClient.newcomer = true
    this.subscription.greet({ to: otherClient.id, from: this.client.id })
  }

  remoteMediumTargetConnected (element) {
    const clientId = element.id.replace('medium_', '')
    this.negotiateConnection(clientId)
  }

  remoteMediumTargetDisconnected (element) {
    const clientId = element.id.replace('medium_', '')
    this.teardownClient(clientId)
  }

  negotiateConnection (clientId) {
    const otherClient = this.findOrCreateClient(clientId)

    otherClient.peer = this.createPeer({
      otherClient,
      initiator: !otherClient.newcomer
    })

    if (!otherClient.newcomer) {
      this.subscription.greet({ to: otherClient.id, from: this.client.id })
    }
  }

  teardownClient (clientId) {
    this.peerFor(clientId).destroy()
    delete this.clients[clientId]
  }

  createPeer ({ otherClient, initiator }) {
    const peer = new Peer({ initiator, stream: this.client.stream })

    peer.on('signal', (message) => {
      this.signaller.signal({
        from: this.client.id,
        to: otherClient.id, message
      })
    })

    peer.on('stream', (stream) => {
      this.startStreamingFrom(otherClient.id, stream)
    })

    return peer
  }

  startStreamingTo (otherClient) {
    this.client.streamTo(otherClient)
  }

  startStreamingFrom (id, stream) {
    const remoteMediaElement = this.findRemoteMediaElement(id)
    if ('srcObject' in remoteMediaElement) {
      remoteMediaElement.srcObject = stream
    } else {
      // for older browsers
      remoteMediaElement.src = window.URL.createObjectURL(stream)
    }
    remoteMediaElement.play()
  }

  findOrCreateClient (id) {
    return this.clients[id] || (this.clients[id] = new Client(id))
  }

  findRemoteMediaElement (clientId) {
    const target = this.remoteMediumTargets.find(
      target => target.id === `medium_${clientId}`
    )
    return target ? target.querySelector('video') : null
  }

  peerFor (id) {
    return this.clients[id].peer
  }

  // RoomSubscription Delegate

  roomPinged (data) {
    this.greetNewClient(data)
  }

  // Signaler Delegate

  signalReceived ({ from, message }) {
    return this.peerFor(from).signal(message)
  }
}

RoomController.values = { id: String, clientId: String }
RoomController.targets = ['localMedium', 'remoteMedium', 'enter']
