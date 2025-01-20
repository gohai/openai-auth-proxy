# openai-auth-proxy

A very tiny (unexciting) piece of software, which simply receives HTTP requests, adds the secret API key, and forwards the request to OpenAI's backend. I use this when I quickly want students to experiment with LLMs in p5.js sketches.

## Features

* Can be used with the official REST API libraries ([JS](https://github.com/openai/openai-node), [Python](https://github.com/openai/openai-python)) by passing on a `base_url` parameter
* Optionally: [tiny JS code](frontend) I use with students in the p5 web editor
* Permissive CORS headers
* Optional logging
* Optional HTTPS when providing Let's Encrypt certificate files (comes out of the box on [glitch.com](https://glitch.com/))

## Disclaimer

Running such a web-service is just marginally better than hard-coding API keys in front-end code. Make sure to set the spending limit to a sum you're willing to part with. It's also a good idea to modify this script to block requests to more expensive operations/models than what is currently needed. (This can be accomplished by returning `false` in `filter`.)
