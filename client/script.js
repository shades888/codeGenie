import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container'); 

let loadInterval;


function loader(element){
 element.textContent =  ''

 loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += '.';

    //if the loading indicator has reached three dots, reset it
    if(element.textContent === '....'){
        element.textContent = '';
    }
 }, 300)
}

//This code is a function that takes two parameters, an element and a text. It then creates an interval that runs every 20 milliseconds. Inside the interval, it checks if the index is less than the length of the text. If it is, it adds the character at the current index to the innerHTML of the element and increments the index. If not, it clears the interval.
function typeText(element, text){
    let index = 0;
//he charAt() method returns the character at a specified index (position) in a string.
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20)
}
// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element

function generateUniqueId(){
    const timeStamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timeStamp}-${hexadecimalString}`; 
}

/* This function is responsible for the color change from user to Ai to determine who is speaking */
function chatStripe (isAi, value, uniqueId){
    return (
        `
            <div class="wrapper ${isAi && 'ai'}">
                <div class="chat">
                    <div class="profile">
                        <img 
                            src="${isAi ? bot : user}"
                            alt="${isAi ? 'bot' : 'user'}"
                        />
                    </div>
                    <div class="message" id=${uniqueId}>${value}</div>
                </div>
            </div>
        `
    )
}


/* This handle function will be the trigger to get the Ai generated response */

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    //user's chat stripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    // to clear the textarea input
    form.reset();

    //bot's chat stripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    // to focus scroll to the bottom to continue seeing messages
    chatContainer.scrollTop = chatContainer.scrollHeight;

    //fetch a newly created div
    const messageDiv = document.getElementById(uniqueId)

    //this turns on the loader
    loader(messageDiv);

    //this area is where we can fetch data from server and get the bot's response

    const response = await fetch('https://codegenie-xnul.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })
//after response, need to clear interval
    clearInterval(loadInterval);
    messageDiv.innerHTML = "";
// needs to be clear in order for us to add our message
// await response.json gives us the actually response from the backend but we need to parse the data
    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();

        console.log({parsedData})
// next pass through typeText function
        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong";

        alert(err);
    }
}

//in order to see the changes in handlesubmit we need to hold
form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
       handleSubmit(e);
    }
})


//allows you to press enter,
// form.addEventListener('submit', handleSubmit);
// document.querySelector('#submit-button').addEventListener('click', (e) => {
//     e.preventDefault();
//     handleSubmit(e);
// });