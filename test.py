import speech_recognition as sr
import requests
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.label import Label


class SpeechToTextApp(App):
    def transcribe_speech_to_text(self, audio_file):
        # initialize the recognizer
        recognizer = sr.Recognizer()

        # read the audio file
        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)

        # transcribe speech to text
        try:
            text = recognizer.recognize_google(audio)
            self.input_text.text = text
        except Exception as e:
            print(f"Error transcribing audio: {e}")

    def send_text_to_openai(self, text):
        # set up the OpenAI API endpoint
        api_endpoint = "https://api.openai.com/v1/engines/text-davinci-002/jobs"

        # specify the API key and model ID
        api_key = "<YOUR-API-KEY>"
        model_id = "<YOUR-MODEL-ID>"

        # format the request body
        request_body = {
            "prompt": text,
            "max_tokens": 100,
            "temperature": 0.5,
            "model": model_id
        }

        # send the API request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        response = requests.post(api_endpoint, json=request_body, headers=headers)

        # check the response status
        if response.status_code == 200:
            response_text = response.json()["choices"][0]["text"]
            self.output_text.text = response_text
        else:
            print(f"Error sending text to OpenAI: {response.text}")

    def save_text_to_file(self, text, file_path):
        with open(file_path, "w") as file:
            file.write(text)
            print(f"Text saved to file: {file_path}")

    def build(self):
        # create the main layout
        layout = BoxLayout(orientation="vertical")

        # add a label for the input text
        input_label = Label(text="Speech-to-Text Input:")
        layout.add_widget(input_label)

        # add a text input for the input text
        self.input_text = TextInput(readonly=True)
