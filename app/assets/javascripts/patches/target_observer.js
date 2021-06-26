import { Context } from "stimulus"
import { Multimap } from "@stimulus/multimap"
import { TokenListObserver } from "@stimulus/mutation-observers"

export default class TargetObserver {
  constructor(context, delegate) {
    this.context = context
    this.delegate = delegate
    this.targetsByName = new Multimap
  }

  start() {
    if (!this.tokenListObserver) {
      this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this)
      this.tokenListObserver.start()
    }
  }

  stop() {
    if (this.tokenListObserver) {
      this.disconnectAllTargets()
      this.tokenListObserver.stop()
      delete this.tokenListObserver
    }
  }

  // Token list observer delegate

  tokenMatched({ element, content: name }) {
    if (this.scope.containsElement(element)) {
      this.connectTarget(element, name)
    }
  }

  tokenUnmatched({ element, content: name }) {
    this.disconnectTarget(element, name)
  }

  // Target management

  connectTarget(element, name) {
    if (!this.targetsByName.has(name, element)) {
      this.targetsByName.add(name, element)
      this.delegate.targetConnected(element, name)
    }
  }

  disconnectTarget(element, name) {
    if (this.targetsByName.has(name, element)) {
      this.targetsByName.delete(name, element)
      this.delegate.targetDisconnected(element, name)
    }
  }

  disconnectAllTargets() {
    for (const name of this.targetsByName.keys) {
      for (const element of this.targetsByName.getValuesForKey(name)) {
        this.disconnectTarget(element, name)
      }
    }
  }

  // Private

  get attributeName() {
    return `data-${this.context.identifier}-target`
  }

  get element() {
    return this.context.element
  }

  get scope() {
    return this.context.scope
  }
}

// Monkey Patch Context
// Target observer delegate

Context.prototype.targetConnected = function (element, name) {
  this.invokeControllerMethod(`${name}TargetConnected`, element)
}

Context.prototype.targetDisconnected = function (element, name) {
  this.invokeControllerMethod(`${name}TargetDisconnected`, element)
}

// Private

Context.prototype.invokeControllerMethod = function (methodName, ...args) {
  const controller = this.controller
  if (typeof controller[methodName] == "function") {
    controller[methodName](...args)
  }
}
