// Fetch poll updates via Server-Sent Events (SSE)
const eventSource = new EventSource('/polls/your_poll_id/stream');

eventSource.onmessage = function (event) {
 const poll = JSON.parse(event.data);

 // Display the poll question and results
 let html = `<h2>${poll.question}</h2>`;
 html += '<ul>';

 poll.options.forEach((option) => {
  html += `<li>${option.name}: ${option.votes} votes</li>`;
 });

 html += '</ul>';
 document.getElementById('poll-container').innerHTML = html;
};
