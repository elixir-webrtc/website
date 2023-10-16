---
layout: page
title: Rel - Pure Elixir, publicly available TURN server
---

[Rel](https://github.com/elixir-webrtc/rel.git) is publicly available for tests and experiments.
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

## Benchmarks

We have **N** connections, where every connection consists of one client and one peer.
A client creates an allocation, a peer starts sending data through this allocation to the client
and the client echo back this data to the peer.

Questions we wanted to answer:
1. How many such connections are we able to handle?
1. How big bitrates are we able to handle?
1. What is the impact of datagram payload size on the TURN server performance? 

### Testbed

* Rel version: 0.2.0
* coTURN version: 4.5.2
* eturnal version: 1.11.1
* TURN server machine: AMD EPYC 7502P 32-Core Processor 
* Clients and Peers machine: AMD EPYC 7502P 32-Core Processor
* RAM: 126 GB
* Connection link: 10 Gbbps

### Results

| Conns | Bitrate in one direction (kbps) | Payload (bytes) | Overall Bitrate (Mbps) | Rel (Elixir) | coTURN (C) | eturnal (Erlang) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 2000 | 50 | 150 | 400 | 25% | 10% | ? | 
| 2000 | 50 | 1200 | 400 | 2-4% | 1.3% | ? | 
| 1000 | 1500 | 1200 | 5200 | 45% | 15% | crashes | 


Notes:
* **?** means that eturnal was not able to create more than 1000 connections
* **crashes** means that eturnal was not able to read incoming data fast enough, 
which resulted in a packet loss. 
This doesn't mean that the CPU usage was high.

