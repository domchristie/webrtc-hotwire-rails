pin 'application', preload: true
pin '@hotwired/turbo-rails', to: "turbo.js"
pin '@hotwired/stimulus', to: 'stimulus.min.js', preload: true
pin '@hotwired/stimulus-loading', to: 'stimulus-loading.js', preload: true
pin_all_from 'app/javascript/models', under: 'models'
pin_all_from 'app/javascript/controllers', under: 'controllers'
pin_all_from 'app/javascript/subscriptions', under: 'subscriptions'
pin "simple-peer", to: "https://ga.jspm.io/npm:simple-peer@9.11.1/index.js"
pin "buffer", to: "https://ga.jspm.io/npm:@jspm/core@2.0.0-beta.24/nodelibs/browser/buffer.js"
pin "debug", to: "https://ga.jspm.io/npm:debug@4.3.4/src/browser.js"
pin "err-code", to: "https://ga.jspm.io/npm:err-code@3.0.1/index.js"
pin "events", to: "https://ga.jspm.io/npm:@jspm/core@2.0.0-beta.24/nodelibs/browser/events.js"
pin "get-browser-rtc", to: "https://ga.jspm.io/npm:get-browser-rtc@1.1.0/index.js"
pin "inherits", to: "https://ga.jspm.io/npm:inherits@2.0.4/inherits_browser.js"
pin "ms", to: "https://ga.jspm.io/npm:ms@2.1.2/index.js"
pin "process", to: "https://ga.jspm.io/npm:@jspm/core@2.0.0-beta.24/nodelibs/browser/process-production.js"
pin "queue-microtask", to: "https://ga.jspm.io/npm:queue-microtask@1.2.3/index.js"
pin "randombytes", to: "https://ga.jspm.io/npm:randombytes@2.1.0/browser.js"
pin "readable-stream", to: "https://ga.jspm.io/npm:readable-stream@3.6.0/readable-browser.js"
pin "readable-stream/lib/internal/streams/from.js", to: "https://ga.jspm.io/npm:readable-stream@3.6.0/lib/internal/streams/from-browser.js"
pin "readable-stream/lib/internal/streams/stream.js", to: "https://ga.jspm.io/npm:readable-stream@3.6.0/lib/internal/streams/stream-browser.js"
pin "safe-buffer", to: "https://ga.jspm.io/npm:safe-buffer@5.2.1/index.js"
pin "string_decoder", to: "https://ga.jspm.io/npm:@jspm/core@2.0.0-beta.24/nodelibs/browser/string_decoder.js"
pin "util", to: "https://ga.jspm.io/npm:@jspm/core@2.0.0-beta.24/nodelibs/browser/util.js"
pin "util-deprecate", to: "https://ga.jspm.io/npm:util-deprecate@1.0.2/browser.js"
