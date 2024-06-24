import express from 'express'; 
//import twilio from 'twilio'
//import MessagingResponse from twilio.twiml.MessagingResponse;
//import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import twilio from 'twilio';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import fs from'fs';
import indexFile from './index'

//import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
//import GoogleAIFileManager  from "@google/generative-ai/files";
const apiKey = "";
const accountSid = '';
const authToken = '';
const client = new twilio(accountSid, authToken);
const app = express(); 
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//import GoogleAIFileManage from "@google/generative-ai/files";


// const genAI = new GoogleGenerativeAI(apiKey);
// const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
// async function uploadToGemini(path, mimeType) {
//   const uploadResult = await fileManager.uploadFile(path, {
//     mimeType,
//     displayName: path,
//   });
//   const file = uploadResult.file;
//   console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
//   return file;
// }

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
// async function waitForFilesActive(files) {
//   console.log("Waiting for file processing...");
//   for (const name of files.map((file) => file.name)) {
//     let file = await fileManager.getFile(name);
//     while (file.state === "PROCESSING") {
//       process.stdout.write(".")
//       await new Promise((resolve) => setTimeout(resolve, 10_000));
//       file = await fileManager.getFile(name)
//     }
//     if (file.state !== "ACTIVE") {
//       throw Error(`File ${file.name} failed to process`);
//     }
//   }
//   console.log("...all files ready\n");
// }

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   systemInstruction: "your task is to verify if the video is about feeding stray dogs and reply with number of stray dogs are feeded in video , if no stray dog is getting feeded in video then reply no",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// async function run() {
//   // TODO Make these files available on the local file system
//   // You may need to update the file paths
//   const files = [
//     await uploadToGemini("istockphoto-473173079-640_adpp_is.mp4", "video/mp4"),
//   ];

//   // Some files have a processing delay. Wait for them to be ready.
//   await waitForFilesActive(files);

//   const chatSession = model.startChat({
//     generationConfig,
//  // safetySettings: Adjust safety settings
//  // See https://ai.google.dev/gemini-api/docs/safety-settings
//     history: [
//       {
//         role: "user",
//         parts: [
//           {
//             fileData: {
//               mimeType: files[0].mimeType,
//               fileUri: files[0].uri,
//             },
//           },
//         ],
//       },
//       {
//         role: "model",
//         parts: [
//           {text: "3 \n"},
//         ],
//       },
//     ],
//   });

//   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//   console.log(result.response.text());
// }

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name)
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "you are a fund allocator which funds to user of he has contributed to social campaigns by analyzing the video shared by the user for his contribution , classify the videos and shared if the video is helping any social campaign or not , here are ongoing campaigns : \n{\n      title: 'Feeding Stray Dogs',\n      description: 'Help us feed stray dogs in your community.',\n      rule: 'Earn $0.2 per dog feeding (Max $1)',\n      reward: 0.2,\n      maxReward: 1,\n    },\n    {\n      title: 'Providing Blankets to the Poor',\n      description: 'Donate blankets to those in need during the cold season.',\n      rule: 'Earn $0.4 per blanket (Max $2)',\n      reward: 0.4,\n      maxReward: 2,\n      image: 'https://via.placeholder.com/320x180.png?text=Providing+Blankets',\n    },\n    {\n      title: 'Planting Trees',\n      description: 'Join us in planting trees to make our environment greener.',\n      rule: 'Earn $0.4 per tree planted (Max $5)',\n      reward: 0.4,\n      maxReward: 2,\n    }\n\nclassify if the video is about stary dogs feeding and how much stray dogs feeding , blanket donation and trees planted , if the video is not related to any of it say no . if the video is contributing say no like 3 with category stray dogs feeding , where 3 stands for no of dogs feed in video",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

let wallet = 0;
let maxRecieved = 1;
let userNo = "";

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("istockphoto-473173079-640_adpp_is.mp4", "video/mp4"),
    await uploadToGemini("WhatsApp Video 2024-06-24 at 19.25.35_c5dfe04c.mp4", "video/mp4"),
    await uploadToGemini("blanket-donation.webm", "video/webm"),
  ];

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(files);

  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "3 with category stray dogs feeding \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[1].mimeType,
              fileUri: files[1].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "no \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[2].mimeType,
              fileUri: files[2].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "1 with category Providing Blankets to the Poor \n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();




const reachedMessage = 
`
You have reached the daily limit of $1 for rewards today. Thank you for your contributions!

See you tomorrow for more opportunities to make a difference. 🌟
`


app.post('/api/whatsapp', (req, res) => {
  const { whatsapp } = req.body;
  console.log(`Received WhatsApp number: ${whatsapp}`);
  sendWhatsAppMessage(whatsapp, " We're excited to have you join us in making a positive impact")
  sendWhatsAppMessage(whatsapp,  message)
  res.send({ message: 'WhatsApp number received' });
});

var count = 0;
var challengeQuestion = "";
var expectedAnswer = "";
var isVerified = false;
var isBlocked = false;

app.post('/incoming', async (req, res) => {
  const message = req.body;
  console.log(`Received message from ${message.From}: ${message.Body}`);
  if (isVerified) {
    if (expectedAnswer != message.Body) {
      sendWhatsAppMessage(message.From, "suspicous bot activity detected")
      isBlocked = true;
    }else {
      isVerified = false;
      sendWhatsAppMessage(message.From, "Verified")

    }
  }
  // const twiml = new MessagingResponse();
  // twiml.message(`You said: ${message.Body}`);
  // res.writeHead(200, { 'Content-Type': 'text/xml' });
  //res.end(twiml.toString());
  console.log("near")
 // Extract the text body from the message
 if (message.NumMedia > 0) {
  // Handle media messages
   
  const mediaUrls = [];
    for (let i = 0; i < message.NumMedia; i++) {
      mediaUrls.push(message[`MediaUrl${i}`]);
      axios({
        method: 'get',
        url: message[`MediaUrl${i}`],
        responseType: 'stream'
      }).then(response => {
        // Save the media file to a local directory
        const filePath = './downloaded-media.jpg'; // Adjust the file name and extension as per your media type
        response.data.pipe(fs.createWriteStream(filePath));
      
        console.log('Media file downloaded successfully:', filePath);
      }).catch(error => {
        console.error('Error downloading media file:', error);
      });
    }
    console.log('Received media URLs:', mediaUrls);
    sendWhatsAppMessage(message.From, "We are processing your video...")
    const response = await run(filePath, "video/mp4")
  }
    if (response.includes('no')) {
      // fake video
      sendWhatsAppMessage(message.From, "It seems the video you submitted is not correct or no such campaign is currently ongoing")
      sendWhatsAppMessage(message.From, "Only 3 videos can be submitted per day")
    }else if (wallet>maxRecieved){
      sendWhatsAppMessage(message.From, reachedMessage)
    }
  
      generativeMsg = await indexFile.run(response)
      sendWhatsAppMessage(message.From, generativeMsg);
    
  };

async function sendWhatsAppMessage(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Your Twilio Sandbox Number
      to: `whatsapp:+917849936058`,
    });
    console.log(`Message sent to ${to}: ${response.sid}`);
  } catch (error) {
    console.error(`Failed to send message: ${error}`);
  }
}


function checkIfHuman() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = Math.random() > 0.5 ? '+' : '-';
  challengeQuestion = `What is ${num1} ${operator} ${num2}?`;
  sendWhatsAppMessage(message.From, "identified 3 stray dogs feeding")
  if (operator === '+') {
    expectedAnswer = (num1 + num2).toString();
  } else {
    expectedAnswer = (num1 - num2).toString();
  }

}

app.listen(port, () => { 
    console.log(`Server running on http://localhost:${port}`); 
});