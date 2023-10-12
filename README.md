# Viral TikTok Video Generator

Do you want to create TikTok videos that are actually informative and interesting? Look no further than our Viral TikTok Video Generator! Look no further, this is our `TikTok` video generator that uses various technologies to generate viral videos.

Here is an example video: https://www.youtube.com/watch?v=zpBj5Z1TbyU&pp=ygUJMiBtaW51dGVz&ab_channel=JustinAgustin

You can put in an YouTube video link of a video that is less than 2-3 minutes long and our application produces a `TikTok` version of that video with a shortened summary and custom images. Videos may take a long time depending on the input especially since we're using a not-so powerful DigitalOcean VM, so we advise whoever is using this app to input low amount of images and low amount of characters for the best and quickest results. If this was not a school project we would be allowing 10-20 minute videos to be summarized. It includes features like text-to-speech, subtitles, and video editing.

## Technologies Used & A brief description

- ChatGPT API: Used to generate a summary of the provided YouTube video.
- AWS Polly (Text-to-Speech): Used to generate audio for the videos, and closed captions for synchronization
- AWS S3: Used to store the video and image files. Our presigned urls expire for security reasons.
- Auth0: Used to authenticate and authorize users.
- SendGrid: Used to send email notifications to users.
- Twillio: Used to send SMS notifications to users.
- Stripe: Used to process payments for the subscription service.
- Bee-Queue: Used to queue video processing and rendering jobs, improving job delegation and organization, allowing for horizontal scaling, and implementation of timeouts, retries, etc.
- Editly: Used as a wrapper to the ffmpeg API to programatically process and render videos.
- Docker: Used to deploy the application in a containerized environment.
- Redis: Used as a backbone for Bee-Queue to store jobs and their data, such as content and status like stalled, waiting, etc.
- MongoDB: Used to store data related to user profiles and subscription status.
- Digital Ocean: Used to host the application and manage the server infrastructure.
- Nginx: Reverse proxy

## User Features

- Generates viral TikTok videos based on YouTube video inspirations
- Creates the subtitles for the video using ChatGPT and text-to-speech technology to make an audio file.
- Edits the video using various editing techniques to create a final product
- Stores the video in Amazon S3
- Provides authentication and authorization using Auth0
- Sends email notifications using SendGrid, SMS notifications with Twillio
- Allows payment processing using Stripe

## Usage

1. Signup / Login into our system
2. User must be subscribed to the service in order for the Upload section to be unlocked
   2a. You can use the card '4242 4242 4242 4242' for the Stripe Payment for testing purposes, any valid exp date and CVC works.
3. Go to the upload page
4. Insert an YouTube link (video must be of length <10min)
5. Wait for our system to process an alternative summarized version of the provided YouTube video.
6. Upload images into each card, and click continue
7. Wait for the video to be processed.
8. Share the link with your friends, or getting it emailed/messaged out to you!

## Getting Started

To get started with this project, you will need to clone the repository and configure the necessary environment variables as in our .env.example file and then run the following commands:

1. cd `project-gallery3`
2. `npm run setup`
3. `docker run --name my-redis -p 6379:6379 -d redis`
4. `npm run start`

**YouTube Link**
https://youtu.be/eEUmUdWwBMI

**Deployed Link**
https://unoriginalai.live/
