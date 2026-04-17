# REQUIREMENTS.md

## Functional Requirements
- Host can create a game room and define questions/answers
- System generates a unique pin code for each room
- Players can join a room using the pin code
- Host can start the game after a waiting period
- All players can see who is connected in the room
- Game presents questions to all players simultaneously
- Players submit answers in real time
- Scoreboard is shown at the end of the game
- Host can reconnect to the room if disconnected

## Non-Functional Requirements
- Must use Next.js
- Deployable to Vercel
- Use Supabase or Prisma Postgres for data storage
- Responsive UI for desktop and mobile
- Real-time updates for game state and player actions
