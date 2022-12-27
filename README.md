# Call booths
This is an internal web app at Onja that allows everyone book a room for a meeting or something else.

# Project setup

## Technologies
- Node + 12
- GraphQL
- React
- material UI
- npm
- yarn
- docker
- Redux

Install `yarn` using `npm`:
- ` npm install -g yarn`

# Clone the project [https://github.com/onja-org/call-booking](https://github.com/onja-org/call-booking)

## Backend
`cd server`

### 1. `npm install`

### 2. Run docker
Based on the docker compose version installed on the machine, the command can be either
- `docker-compose up --build`
- `docker compose up --build`

Open [http://localhost:4000/graphql](http://localhost:4000/graphql) to view it in the browser.

### 3. `npm run start.dev`
Run this to see the [http://localhost:4000](http://localhost:4000)

## Frontend

### 1. `yarn install`
### 2. `yarn  start`
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Other useful configurations

### `yarn run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the file names include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
