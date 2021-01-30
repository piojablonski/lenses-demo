### a) Implement ability to search in messages list.
- for the purpose of the challange I assume that the search should be done on frontend.
- search function `findMessages` looks for a `searchQuery` string inside the `message.value` string and return an array with index number of hits.
- Initially I intended to filter messages on the MessagesList using selector. 
  It would require to re-run filtering on each incoming message which is not desirable.
  I think that a better choice in this scenario is to execute the search after user clicks 
  on a button. 

- Tests: 
  I created tests for new functionality to demonstrate what kind of tests I would apply in the rest of the projects:
  - unit tests for function libraries `util/index.spec.js` 
  - `<Search />` component tests check:
    - do specific set of properties passed to the component render desired output,
    - do simulated events trigger event handlers passed through props.
  - In this case I treat components internal behaviour as implementation detail that I prefer not to test. This enhance test maintanability and reduces the amount of false negative test resuts.

- Performance: main search function "handleSearch" blocks main UI thread for:
  - with 15k messages on the list ~18ms
  - with 100k messages ~40ms

  which results in smooth user experience. (tested on google chrome)

### b) Change the application such that it unsubscribes automatically after 15000 messages received from the server.

- Subscribe component counts messages and triggers new unsubscribeAllTopics function
  when the length of messages array exceeds 15k. 
- Tests: I'm interested in seeing if component `<Subscribe />` actually unsubscribed from the stream on specific moment. I check if `unsubscribe` event handler has been triggered after I set the `message` property to an array containing 15k elements.
