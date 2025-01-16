# Uni-Guesser

Below was for the MakeUC Hackathon. The application has since been updated extensively.

Play Here: https://uni-guesser-two.vercel.app/

## Inspiration
We were inspired by the game Geoguessr and thought having a location specific Geoguessr would be a fun take to the popular game.

## What it does
Uni-Guesser is a Geoguessr like game that is focus around the University of Cincinnati campus. Each game consists of 5 rounds where the player has to guess where an image was taken on the campus of UC by placing a point on a map. The closer the guess is to the correct spot, the more points will be awarded to the player. The ultimate goal of Uni-Guesser is to achieve a perfect score of 500 points.

## How we built it
We built Uni-Guesser using a React and Tailwind CSS for the frontend and Flask/Python for the backend. We store our image using Google Cloud Storage.

## Challenges we ran into
Making a dynamic and interactive application was a challenge. Most of our time was spent figuring out how the frontend should react and ensuring the game would run smoothly, be engaging, and fun overall.

## Accomplishments that we're proud of
We are extremely happy with how Uni-Guesser turned out. We believe we've made something that is actually fun and enjoyable to play and may even want to be played by others which we are proud of as a team. 

## What we learned
We learned a lot about frontend design in React as well as how to load images from a Google Cloud Storage. We discovered that image metadata contains location information and that was pivotal in providing the data Uni-Guesser needs. We discovered how to add interactive and good looking maps into our applications which we feel makes Uni-Guesser much more interesting to play.

## What's next for Uni-Guesser
Although we are at a point where Uni-Guesser is playable for anyone, there are many additions we could make such as different game modes, user accounts and a user friend system, head to head battles, and much more.
