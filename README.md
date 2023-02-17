![](src/SOAPNotes.png)

[SOAPNotes](https://soapnotes.onrender.com) is an app to stream physical therapy interactions, converting speech to text, and using generative AI to summarize interaction into treatment notes.

SOAP stands for Subjective, Objective, Assessment, Plan.

###### \*_best run on desktop, there are still issues with mobile._

## Getting started with this project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). This branch shows the React App after adding additional functionality with InstructGPT (_coming..._).

- Make sure you have `npm` installed.
- Clone this repo
- `cd` to directory `SOAPNotes`
- In the terminal, run `npm i react-speech-recognition`
- `npm run start` to run the app locally for development.
- To build and deploy locally: `npm run build` + `npm install -g serve` + `serve -s build`

## Using Render to deploy app on a static server

- This repository is connected with [render](https://render.com/docs/deploy-create-react-app) to run the app on a static server in the cloud.

### Next Steps

- send text as an input to a prompt using spellbook API
- send output back to app
  - nice to have: save output as a .txt and send as an email to user
  - need to build out email sign up.
