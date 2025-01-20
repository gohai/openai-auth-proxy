// Note: this sketch consists of additional JavaScript
// files. Make sure to duplicate it, rather than copying
// and pasting code :)

let openai_api_proxy = "https://URL_OF_YOUR_API_PROXY_INSTANCE_HERE/"; // hosted e.g. on gitch.com

// The main input is the messages parameter (i.e. the entire conversation
// up to this point). Typically, a conversation is formatted with a system
// message first, followed by alternating user and assistant messages.
// The system message helps set the behavior of the assistant. For example,
// you can modify the personality of the assistant or provide specific
// instructions about how it should behave throughout the conversation.

let messages = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];

function setup() {
  createCanvas(400, 400);
  background(0);
  fill(255);

  // whenever the button is clicked, call sendMessage
  select("#submit").mouseClicked(sendMessage);
}

function sendMessage() {
  // get the text from the text field
  let content = select("#content").value();
  
  // don't send empty messages to the API
  if (content == "") {
    return;
  }
  
  // add the text to the array of messages
  messages.push({
    role: "user", // this comes from the user
    content: select("#content").value(),
  });

  // clear the textfield
  select("#content").value("");
  
  // draw to the screen
  textAlign(RIGHT, BOTTOM);
  text(content, 20, 20, width-20, height-20);
  
  // send the request
  let params = {
    model: "gpt-4o-mini",
    messages: messages,
  };
  requestOAI("POST", "/v1/chat/completions", params, gotResults);

  // Note: there are additional parameters available, see
  // https://platform.openai.com/docs/api-reference/chat
}

function gotResults(results) {
  console.log(results);

  // add the first response-choice to the messages array
  messages.push(results.choices[0].message);

  console.log("messages is now", messages);
  
  // draw to the screen
  textAlign(LEFT, BOTTOM);
  text(results.choices[0].message.content, 20, 20, width-20, height-20);
}

function draw() {
  // scroll the content of the screen upwards
  copy(0, 1, width, height-1, 0, 0, width, height-1);
  // fill the last row black
  line(0, height-1, width, height-1);
}
