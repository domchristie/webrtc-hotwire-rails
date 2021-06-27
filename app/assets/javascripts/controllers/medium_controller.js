import { Controller } from 'stimulus'

export default class MediumController extends Controller {
  connect () {
    this.reRenderMediaElement()

    // Temp. fix to mimic the upcoming API from https://github.com/hotwired/stimulus/pull/409
    if (this.roomController && this.isRemote) {
       this.roomController.remoteMediumTargetConnected(this.element)
    }
  }

  disconnect () {
    // Temp. fix to mimic the upcoming API from https://github.com/hotwired/stimulus/pull/409
    if (this.roomController && this.isRemote) {
      this.roomController.remoteMediumTargetDisconnected(this.element)
    }
  }

  get roomController () {
    return this.element.closest('[data-controller="room"]').room
  }

  get isRemote () {
    return this.element.matches(['data-room-target="remoteMedium"'])
  }

  // Fix potentially blank videos due to autoplay rules?
  reRenderMediaElement () {
    const mediaElement = this.mediaElementTarget
    const clone = mediaElement.cloneNode(true)
    mediaElement.parentNode.insertBefore(clone, mediaElement)
    mediaElement.remove()
  }
}

MediumController.targets = ['mediaElement']
