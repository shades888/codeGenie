import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

//allows use of the dotenv variables
dotenv.config();

console.log(process.env.OPENAI_API_KEY)

//configuration function that accepts an object
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//this creates an instance of openai then passes in the configuration
const openai = new OpenAIApi(configuration);

//next step initalize express application, express is called as a function
const app = express();

//setting up a couple middlewares
//this allows cross origin request and allow the server to be called from the frontend
app.use(cors());

//this allows json to be passed from the frontend to the backend
app.use(express.json());

//dummy root route
//asynchronous function that is going to accept a request and response
app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from Code Genie',
    })
})

//app.get you can't receive alot of data from the frontend
//app.post allows a body or payload
//same as post on this time we can get the data from the body of the frontend request
//first wrap everything in a try and catch block

//const repsonse create pr get a response from the open API
//.createCompletetion is a function that accepts an object


//after copying the parameters from https://platform.openai.com/playground/p/default-openai-api?lang=node.js&model=text-davinci-003
//erase prompt parameter and replace with `${prompt}` because it is the prompt from the frontend text area
//temperature - higher temperature value means the model will take more risk, change to 0 because want to avoid risk,
//so model will answer with what it knows
//max tokens - is the maximum amount of tokens to generate in a completition, change to 3000 to give long responses
//top frequency means how often will it give similiar sentences so set to 0.5
app.post('/', async (req,res) => {
    try{
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            

        });
// once a response is given want to send it back to the frontend
     res.status(200).send({
        bot: response.data.choices[0].text
     })
    }catch (error) {
        console.log(error);
        res.status(500).send({ error });

    }
})

//now to make sure the server always listens

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));