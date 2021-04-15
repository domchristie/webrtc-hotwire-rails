# WebRTC + Hotwire + Ruby on Rails
An basic video chat app using the [WebRTC Perfect Negotiation pattern](https://w3c.github.io/webrtc-pc/#perfect-negotiation-example), a sprinkling of Hotwire (mainly [Turbo Streams](https://turbo.hotwire.dev/reference/streams) & [Stimulus](https://stimulus.hotwire.dev/)), and backed by Ruby on Rails.

## How does it work?
The Stimulus room controller handles Enter button click. It gets the user's local audio and video and feeds them into the local video element. It also starts Action Cable subscriptions specific to the current room: one for communicating WebRTC messages: the `Signaller`; and one for clients to ping others: the `RoomSubscription`. Once connected, the room channel broadcasts the presence of this new client. Each connected client then "greets" this newcomer by calling the `greet` action on the room channel and specifying `to` and `from` fields.

The `greet` action broadcasts specifically to the newcomer, a Turbo Stream update which appends a media element representing the remote client. It's important we do this first so that it's ready for incoming streams. The media controller broadcasts it's connected (using a snippet taken from the hey.com source code, which will be simplified once [we can listen for adding/removing Stimulus targets](https://github.com/hotwired/stimulus/pull/367)). This begins the WebRTC negotiation to form a connection between the two clients.

The WebRTC negotiation is quite complex, and even though things are required to happen in a particular order, responses are triggered asynchronously, making it tricky to get right. This is where the [WebRTC Perfect Negotiation pattern](https://w3c.github.io/webrtc-pc/#perfect-negotiation-example) comes in. We won't go into it too much here, as it's covered well elsewhere; but for the purpose of this description, (_deep breath_), Session Description Protocol (SDP) descriptions and Interactive Connectivity Establishment (ICE) candidates are exchanged over the `Signaller`. The negotiation is "perfect" as it ensures that the `RTCPeerConnection` is in the correct state for setting descriptions, and avoids collision errors by having one client be "polite" and other "impolite"—the polite one backs down in the case of a collision. Anyway, the code for this has been mostly lifted from the spec and handled by the `Signaller`/`WebrtcNegotiation`. When creating the negotition, the room controller listens for `track` events on the `RTCPeerConnection`, so it can start streaming from the remote client.

Once the negotiation has been created, the newcomer client notifies the other client by reciprocating the greeting i.e. calling `greet` on the room channel. This triggers the same process as above on the other client: appending a media element via a Turbo Stream update, and starting a WebRTC negotiation. This time though, instead of a greeting (which would be very polite, but awkward and endless!), the client starts streaming to the other client, by adding media tracks to the connection. This kicks off the complex exchange of SDP descriptions and ICE candidates, and once either is received by the newcomer, it can start the streaming process from its own stream to the other client. Now all clients are streaming to and from each other.

Finally, when a client disconnects from the room channel, a Turbo Stream update removes the media element from the screen. The media controller broadcasts its removal so the room controller can clean up.

To summarise the flow:

1. A newcomer broadcasts its presence to others in the room
2. The connected clients greet this newcomer letting them know their ID
3. A Turbo Stream update creates a video element on the newcomer's screen for each greeting it receives
4. The newcomer creates a WebRTC negotiation and sends a greeting back to each of the other clients
5. Turbo Stream updates create video elements on each of the other clients' screens
6. WebRTC negotiations are created by each of the other clients, and they start streaming to the newcomer
7. Reacting to negotiation activity (SDP descriptions and ICE candidate exchanges), the newcomer starts streaming to other clients

## Browser Support?
This has only been tested in macOS Firefox/Chrome/Safari and iOS Safari.

## TODO
- Add "Leave" functionality + handle ICE candidate disconnections (rather than just closing the browser window)
- Handle ICE Connection failures (see: [Explicit restartIce method added](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation#explicit_restartice_method_added))

## License
Copyright © 2021+ Dom Christie and released under the MIT license.
