---
layout: page
title: Rel - Pure Elixir, publicly available TURN server
---

Rel is publicly available for tests and experiments.
Just execute a simple POST request to obtain your credentials
and copy-paste them into [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection) constructor.

```sh
$ curl -X POST "https://turn.bigcow.ovh/?service=turn&username=johnsmith"
{
    "password":"l6hs9SzUgudFeb5XjrfCfOWKeOQ=",
    "ttl":1728,
    "uris":["turn:167.235.241.140:3478?transport=udp"],
    "username":"1691574817:johnsmith"
}
```

```js
pc = new RTCPeerConnection({
  iceServers: [
    {
      credential: "l6hs9SzUgudFeb5XjrfCfOWKeOQ=",
      urls: "turn:167.235.241.140:3478?transport=udp", 
      username: "1691574817:johnsmith" 
    }
  ]
});
```