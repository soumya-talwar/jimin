# JIMIN & SEOKJIN

### I built two plant husbands that talk to me

Jimin and Seokjin are plants that use **webcam recognition, mic input, sensor readings, TTS and an LLM** to talk to me. They can recognise me through a webcam, listen to what I say, and respond according to their moods, which are affected by the environment around them.

## How it works

The project brings together several different inputs to decide when and how the plants respond.

```text
Webcam ──────────────── Image classification ──┐
                                               │
Microphone ──────────── Socket.IO ─────────────┤
                                               │
Keyboard ──────────────────────────────────────┤
                                               ▼
Plant sensors ───────── SerialPort ─────► Desktop App
                                               │
                                               ▼
                                          OpenAI API
                                               │
                                               ▼
                                            Response
```

The **webcam uses image classification to recognise me**, so the plants know when I am in front of them and only talk to me.

What I say is **captured through the mic**, converted to text using the **Web Speech API**, and sent to the application via **Socket.IO**.

An **Arduino** continuously sends temperature, humidity, light and soil-moisture readings to the application over **SerialPort**. These readings affect the plant's mood, which in turn affects how they respond.

The resulting inputs are sent to the **OpenAI API**, which generates a response for the selected plant based on its personality and current mood. The response is displayed in the desktop application alongside an animated avatar and spoken using text-to-speech.

## The plants

Jimin and Seokjin are based on two BTS characters I like, and have similar personality traits to them.

The physical environment gives them an additional layer of personality. When it's dark, Jimin gets shy; when he's left dry for too long, he gets whiny. Seokjin speaks in plant puns, and gets sassy or dramatic when he's overwatered.

## Built with

- **JavaScript / Node.js**
- **Electron**
- **OpenAI API**
- **Arduino**
- **SerialPort**
- **Teachable Machine + ml5.js**
- **Socket.IO**
- **Web Speech Recognition**
- **Text-to-speech**
