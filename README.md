# <h1 align="center">Text Input and Calculation Microservice</h1>

## General Information
Here exists two services with separate URLs. Users can input on screen-a only. Users will input a written text which is required and a text file. The text file will contain a one line simple calculation like: .0574*75-41/81. When the user uploads a file and give a title, the app will take the input data and process it, save the written text input in db and store the text file on storage then save the location of this file to db. App will then check if the user gave any text file at all or not, if the text file is valid and well formatted then the calculation must be mathematically valid. Then it will simply calculate the data from the text file and show it as response. Otherwise app will show an error message. For later uses all data are saved into db.

Now, users can submit their calculations anytime they want unlimitedly. In future there will be a queue (now I have used RabbitMQ and Redis) for submissions, and process/ calculate (calculates take 15seconds of time now) the result according to the following conditions.

## Tools and Technologies:
  * <a href="https://nodejs.org/en/">Node.Js</a>
  * NPM (it is automatically installed with node) / <a href="https://yarnpkg.com/">Yarn</a>
  * <a href="https://expressjs.com/">ExpressJs</a>
  * <a href="https://redis.io/">Redis</a>
  * <a href="https://www.docker.com/">Docker</a>
  * <a href="https://www.rabbitmq.com/">RabbitMQ</a>

## Database
  * <a href="https://www.mongodb.com/home">MongoDB Atlas</a>
## Endpoints:
 #### Screen-A APIs:
  * POST API: ```v1/calculation/inputs``` - it takes the inputs (written text is required and file is optional).
  * GET API: ```/v1/calculation/inputs``` - to fetch inputs using pagination (limit, page, sortBy).
  * GET API: ```/v1/calculation/outputs``` - to fetch outputs using pagination (limit, page, sortBy).
  * GET API: ```/v1/calculation/input/uuid``` - to fetch input by uuid.
  * GET API: ```/v1/calculation/output/uuid``` - to fetch output by uuid.
  Here is the POST API input data:
  <img src="https://user-images.githubusercontent.com/69357704/208299532-99a3d8ec-5601-409b-97a0-95708448464b.png">
  </br>
   #### Screen-B APIs:
  * GET API: ```/v1/result/input/uuid``` - to fetch input by uuid.
  * GET API: ```/v1/result/output/uuid``` - to fetch output by uuid.
  > Note: Screen-B is only for show data. It will contact will Screen-A by gateway which will run on port 3000 or ```http://localhost:3000```.
  </br>



## Quick Start </br>
You can get started by using the following commands:</br>

**Step 1: Clone this repo by:** </br>
```bash
https://github.com/mdmuhtasimfuadfahim/text-input-calculation-microservice
```

**Step 2: Install the dependencies:** </br>
  Please follow the commands of './run.sh' file and install the dependencies
  </br>
  
**Step 3: Set the environment variables:** </br>

```bash
cp .env.example .env

# open .env and modify the environment variables (you need to add your own mongodb url) and do this in both two services and gateway.
```

**Step 4: Run the command to start the server:** </br>
```bash
 yarn start
  
 # For Production
  > Note: If you run concurrently from the root directory then both services and gatway will start. Also docker and redis-server will also start. Otherwise you have to go inside of each service and run the service including docker and redis-server.

  Example: 
    cd screen-a
    npm run docker
    redis-server
    npm run start
```

  
</br>**The APIs will start working and you can send request and get response.**</br>

> Note: Please use ```yarn add dependency_name``` Or ```npm install dependency_name``` if something went wrong or couldn't install any package with ```yarn install```.

## License:
  * MIT
 
###### Thank you
