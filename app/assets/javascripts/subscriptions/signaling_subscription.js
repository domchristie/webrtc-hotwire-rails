import { cable } from 'turbo'

export default class SignalingSubscription {
  constructor({ delegate, id, clientId }) {
    this.callbacks = {}
    this.delegate = delegate
    this.id = id
    this.clientId = clientId
  }

  async start () {
    const self = this

    this.subscription = await cable.subscribeTo({
      channel: 'SignalingChannel',
      id: this.id
    }, {
      received (data) {
        const { to, from, type, description, candidate } = data
        if (to != self.clientId) return

        self.broadcast(type, data)

        if (description) return self.delegate.sdpDescriptionReceived({ from, description })
        if (candidate) return self.delegate.iceCandidateReceived({ from, candidate })
        if (type === 'restart') return self.delegate.negotiationRestarted({ from })
      }
    })

    this.started = true
  }

  signal (data) {
    if (!this.started) return
    this.subscription.perform('signal', data)
  }

  on (name, callback) {
    const names = name.split(' ')
    names.forEach((name) => {
      this.callbacks[name] = this.callbacks[name] || []
      this.callbacks[name].push(callback)
    })
  }

  broadcast (name, data) {
    (this.callbacks[name] || []).forEach(
      callback => callback.call(null, { type: name, detail: data })
    )
  }

  off (name) {
    if (name) return delete this.callbacks[name]
    else this.callbacks = {}
  }
}
