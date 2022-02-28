pin 'application', preload: true
pin '@hotwired/turbo-rails', to: "turbo.js"
pin '@hotwired/stimulus', to: 'stimulus.min.js', preload: true
pin '@hotwired/stimulus-loading', to: 'stimulus-loading.js', preload: true
pin_all_from 'app/javascript/models', under: 'models'
pin_all_from 'app/javascript/controllers', under: 'controllers'
pin_all_from 'app/javascript/subscriptions', under: 'subscriptions'
