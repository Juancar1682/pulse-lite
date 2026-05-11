Encounter a bug in the backend logic, where i was using e.g !age what that was doing it wasn't accepting values that in production could appear like age 0 or heart rate 0. I changed it to format: value == null, this logic checks if th einout is null or undefined but lets 0 pass.

Encounter a bug in WebSocket, the logic was supposed to send to client no matter the state it was in, when its only supposed to send when the connection is open. If not the whole server will crash, id the connection is connection, closing or close.

Addded the open WebSocket connection to PUT and DELETE, also added the import.meta to every part that used a hard-coded URL.

Added a message when connected to the frontend, because if the websocket took longer than the get request it would've miss information, also removed the useEffect with get because of it was racing state with the websocket setVitals.

Took out the set vitals in the DELETE and POST request, and let the server handle all updates of state in real time for accuracy purposes and for it to not overwrtie the state"
