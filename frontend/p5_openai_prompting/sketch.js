// Note: this sketch consists of additional JavaScript
// files. Make sure to duplicate it, rather than copying
// and pasting code :)

let openai_api_proxy = "https://URL_OF_YOUR_API_PROXY_INSTANCE_HERE/"; // hosted e.g. on gitch.com

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
  
  // here, we don't need a history of the conversation
  // so we can start a new messages array for every input
  messages = [{
    role: "user",
    content: "I would like you to generate a matching HEX color value based on the following keywords. In your response, do not repeat what I asked for, simply tell me: \"{{HEX color value}}\". Here are the keywords: " + select("#content").value(),
  }];
  
  // clear the textfield
  select("#content").value("");
  
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
  //console.log(results);

  let message = results.choices[0].message.content;
  console.log(message);
  
  // a good practice here would be to parse and validate
  // the result we received - e.g. is this a valid hex color
  background(message);
}

function draw() {
}
