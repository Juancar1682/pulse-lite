Encounter a bug in the backend logic, where i was using e.g !age what that was doing it wasn't accepting values that in production could appear like age 0 or heart rate 0. I changed it to format: value == null, this logic checks if th einout is null or undefined but lets 0 pass.

Encounter a bug in WebSocket, the logic was supposed to send to client no matter the state it was in, when its only supposed to send when the connection is open. If not the whole server will crash, id the connection is connection, closing or close.
