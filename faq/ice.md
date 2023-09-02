---
layout: page
title: FAQ ICE
---

1. [Should we filter out bridges (like those created by docker) when gathering host candidates?](#1)
2. [When conn check req and resp address might not be symmetric? sec 7.2.5.2.1](#2)
3. [How does iptables work? (In particular NAT table, and MASQUERADE and DNAT targets)](#3)
4. [Is it actually possible to have srflx candidate? reflexive candidates are replaced by their bases and pruned if redundant - see section 6.1.2.4](#4)
5. [Is it possible to connect ice outside docker with ice inside docker?](#5)
6. [Is it possible for initial pair state to be different than :waiting when we have only one checklist?](#6)
7. [Is it possible not to prune some srflx candidate - sec 6.1.2.4?](#7)
8. [Is it possible to receive binding response to binding request with USE-CANDIDATE that will result in creating a new valid pair? sec 7.2.5.3.4](#8)
9. [A Trickle ICE agent MUST NOT pair a local candidate until it has been trickled to the remote party. How can we know that the candidate has been trickled to the remote party? Does any implementation exposes in its API ability to mark the candidate as trickled?](#9)
10. [What data use for keepalives and how often?](#10)
11. [Can ICE be restarted before completing?](#11)
12. [Can we send data on valid pair before regular nomination in RFC 5245?](#12)
13. [Why does chrome allocate only one ICE candidate?](#13)
14. [What is default local address?](#14)


### 1. Should we filter out bridges (like those created by docker) when gathering host candidates? <a name="1"></a>

### 2. When conn check req and resp address might not be symmetric? sec 7.2.5.2.1 <a name="2"></a>

### 3. How does iptables work? (In particular NAT table, and MASQUERADE and DNAT targets) <a name="3"></a>

### 4. Is it actually possible to have srflx candidate? reflexive candidates are replaced by their bases and pruned if redundant - see section 6.1.2.4 <a name="4"></a>

### 5. Is it possible to connect ice outside docker with ice inside docker? <a name="5"></a>

### 6. Is it possible for initial pair state to be different than :waiting when we have only one checklist? <a name="6"></a>

Yes, consider scenario where remote peer sends us two the same srflx candidates that differ in ports only. Remote can obtain two srflx candidates when it has multiple local interfaces or has docker bridges on its system. RFC doesnt seem to say we should filter out "redundant" candidates.

### 7. Is it possible not to prune some srflx candidate - sec 6.1.2.4? <a name="7"></a>

### 8. Is it possible to receive binding response to binding request with USE-CANDIDATE that will result in creating a new valid pair? sec 7.2.5.3.4 <a name="8"></a>

### 9. A Trickle ICE agent MUST NOT pair a local candidate until it has been trickled to the remote party. How can we know that the candidate has been trickled to the remote party? Does any implementation exposes in its API ability to mark the candidate as trickled? <a name="9"></a>

### 10. What data use for keepalives and how often? <a name="10"></a>

Chrome seems to send binding requests every 2-2.5s which is a discouraged behavior
according to appendinx B.8 of RFC 8445.
Chrome also sends those keepalives even when the data is flowing which is also
an opposite behavior comparing to what RFC says.
Pion seems to send Binding Indications 2 seconds after there is no traffic.
In general, we should send Binding Indications and only when there is no media traffic.
RFC says that we should send keepalives after 15 seconds of inactivity.
"Though Binding Indications are used for
keepalives, an agent MUST be prepared to receive a connectivity check
as well.  If a connectivity check is received, a response is
generated as discussed in [RFC5389], but there is no impact on ICE
processing otherwise."

### 11. Can ICE be restarted before completing? <a name="11"></a>

### 12. Can we send data on valid pair before regular nomination in RFC 5245? <a name="12"></a>

### 13. Why does chrome allocate only one ICE candidate? <a name="13"></a>

Chrome operates on ADAPTER_ENUMERATION flag. When ADAPTER_ENUMERATION is enabled, chrome
will search for local NIC and create candidates. When ADAPTER_ENUMERATION is disabled or 
the process of searching local NIC fails, chrome uses INADDR_ANY i.e. 0.0.0.0 address as its
only candidate. When the ADAPTER_ENUMERATION can be blocked? The comment from basic_port_allocator
says: 

```
If the adapter enumeration is disabled, we'll just bind to any address instead of specific NIC. This is to ensure the same routing for http traffic by OS is also used here to avoid any local or public IP leakage during stun process.
```

so this might have something to do with the http traffic.

This might have also something to do with private networks or at least when no STUN or TURN
server is provided. From stun_port.cc

```
When adapter enumeration is disabled and binding to the any address, the default local address will be issued as a candidate instead if `emit_local_for_anyaddress` is true. This is to allow connectivity for applications which absolutely requires a HOST candidate.
```

How the 0.0.0.0 is transported to the peer? 
Which address is used when sending data from a socket listening on 0.0.0.0?

Possibly using default local address. Refer to what is default local address".

See basic_port_allocator.cc and network.cc files for reference. 
[[click]](https://source.chromium.org/chromium/chromium/src/+/main:third_party/webrtc/p2p/client/basic_port_allocator.cc;l=741?q=basic_port_a&ss=chromium)

### 14. What is default local address? <a name="14"></a>

From network.h

```
The default local address is the local address used in multi-homed endpoint when the any address (0.0.0.0 or ::) is used as the local address. It's important to check the return value as a IP family may not be enabled.
```