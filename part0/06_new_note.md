# 06_new_note

note over browser:
browser executes the event handler
that adds new note the notes list,
rerenders the notes list and sends
the new note to the server
end note

browser->server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa

note over server:
server executes request handler
that adds new note to a collection of notes
and returns success response
end note

server-->browser: HTTP 201, {"message":"note created"}