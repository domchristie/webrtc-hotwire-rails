import { Controller } from '@hotwired/stimulus'

export default class MediumController extends Controller {
  connect () {
    this.reRenderMediaElement()
  }

  get roomController () {
    return this.roomElement.room
  }

  get isRemote () {
    return this.element.matches('[data-room-target="remoteMedium"]')
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
