Encounter a bug in the backend logic, where i was using e.g !age what that was doing it wasn't accepting values that in production could appear like age 0 or heart rate 0. I changed it to format: value == null, this logic checks if th einout is null or undefined but lets 0 pass.

Encounter a bug in WebSocket, the logic was supposed to send to client no matter the state it was in, when its only supposed to send when the connection is open. If not the whole server will crash, id the connection is connection, closing or close.

Addded the open WebSocket connection to PUT and DELETE, also added the import.meta to every part that used a hard-coded URL.

Added a message when connected to the frontend, because if the websocket took longer than the get request it would've miss information, also removed the useEffect with get because of it was racing state with the websocket setVitals.

Took out the set vitals in the DELETE and POST request, and let the server handle all updates of state in real time for accuracy purposes and for it to not overwrtie the state.

Delete SetVitals from PUT form onsubmit to let the websocket handle all logic live.

Moved the types outside of the app component, because vitals live regardless of the component.

Replaced ul tags with article and li with p tags for a11y, and screen reading. Is going to used correct HTMl semantics for screen reader a11y(accesibility).

Add error and loading state to hadle conectivity, and to show the user in which state they are.

Add type number to all numeric input to avoid bad inputs also add a check to see if any numeric inputs are nan at submitting level for safety.

Add exponential backoff for reconnection retryn to avoid infinte retries and overloading the user connection.

Add zod schema to check vitals in runtime, optimized for future input additions, avoiding manual checks every time an input is added.

#What the difference is between a patients table and a vitals_readings table and why you split them
patients now is the identity of the patient not the vitals, and the vitals show the vitals status of that specific patient

#What a foreign key is and what ON DELETE CASCADE does
A foreign key connects a column in one table to the primary key of another table. ON DELETE CASCADE means: if the parent row is deleted, all child rows that reference it are automatically deleted too. Example: delete a patient, and all their vitals_readings rows delete automatically.

#What soft delete means and how deleted_at TIMESTAMP implements it
Soft delete means the row stays in the database but is treated as deleted. deleted_at TIMESTAMP is NULL for active records and set to a timestamp when deleted. All queries filter WHERE deleted_at IS NULL so deleted patients don't appear in normal results, but the data is still there for audits or recovery.

#What SERIAL actually does under the hood (you just saw it — nextval(...))
it creates a sequence assigning in to nextval = next value eg. if 1 then 2

#The DROP TABLE IF EXISTS pattern and why it matters for migrations
is safer so if the table exist it dorps it but if it doesnt it continues with the migration instead of stopping it

#The psql $DATABASE_URL -f schema.sql command
export $(grep -v '^#' .env | xargs)
psql $DATABASE_URL -f schema.sql

ALTER TABLE modifies an existing table's structure without touching its data — used ALTER COLUMN time_reading SET DEFAULT NOW() to add a default timestamp to vitals_readings.

Always re-read the commit message before pushing. The message is the only memory of what the commit did.

Took ownership of what to fix first in this case restructuring the vitalsSchema into 2: patientsSchema and VitalsSchema that way i have a user and its id with its dob and that table can talk to the VitalsSchema. Became the PatientScheam doesn't change while the vitals do.

In Express, res.status().json() does not end execution. Guard clauses need return res.status(400).json(...) or the function continues running.

Done is when the project passes audit and tells a credible story. Anything beyond that is procrastination dressed as polish.
