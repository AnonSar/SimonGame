"use strict";
let level = 4; //global variable for keeping track of the current level
let correctAttempt = 0; //for accouting the nubmer of correct attempts
let incorrectAttempt = 0; // for accouting the number of incorrect attemps
let userInput = []; // for holding the user userInput
let guessNumber = 0; //to account the number of attempts user has made in the current sequence
let colourArray =  new Array(level); //array for storing the colour sequence that will be shown to the user
let outputAreaRef = document.getElementById('output');//for displaying the necessary information to the user
outputAreaRef.innerHTML = "<div id='areaOne'></div><div id='areaTwo'></div>"
let firstAreaRef = document.getElementById('areaOne');
let secondAreaRef = document.getElementById('areaTwo');
let displayOutput = ""; // for displaying the necessary information
let orientationMode = 1; //to keep a track of whether the phone is in tilt mode or touch mode (default value is 1 which is touch mode)
let xVal; //for holding the value of the x axis
let yVal; //for holding the value of the y axis
let zVal; //for holding the value of the z axis
let deviceAbsolute = null; //for device orientation
let toast = ""; //for holding the current colour the user on in the tilt mode

/*
 * This callback function will be called when any of the game buttons on the
 * screen is clicked on by the user (note that the user will not be able to
 * 'double-click' buttons, they will only be clickable once a button has
 * gone dark again)
 *
 * This function has a single parameter 'whichButton' that can take the
 * following values:
 *    "blue"
 *    "green"
 *    "yellow"
 *     "red"
*/

function buttonSelected(whichButton)//here whichButton represents the colour entered by the player

{   let remainingCurrentSeq = 0; // variable for accouting number of attempts to be made in order to complete the current sequence
    userInput.push(whichButton);//appending the userinput insdie an Array

    guessNumber++;//increment the guessNumber variable whenever a button is pressed
    remainingCurrentSeq = level - guessNumber; //for calculating the number of attempts to be made in order to complete the current sequence
    if (remainingCurrentSeq !== 0)
    {
        displayOutput = "Number of items remaining(Current Level): "  + remainingCurrentSeq + "<br/>";
    }
    else
    {
        displayOutput = "Number of items remaining(Current Level): "  + remainingCurrentSeq + "<br/>"+"<b>Please press the play button to proceed ahead.</b>";
    }

    firstAreaRef.innerHTML = displayOutput;

    if (userInput.length == level)//when length of the userInput array is eqaul to level then check the userInput

    {
        guessNumber = 0; //as soon as the complete sequence has been entered, then reset the guessNumber to 0

        for (let i = 0; i < userInput.length; i++)//checking the array where we have the userInput stored

        {
            if (userInput[i] !== colourArray[i])//On any difference in the userInput and color array, then call showFailure method

            {
                userInput = []; //reset the userInput array and call the showFailure method
                incorrectAttempt ++; //increment incorrectAttempt whenever wrong answer is entere
                showFailure();//call the showFailure method

                if (incorrectAttempt == 2)//if they enter incorrect answers 2 times consecutively, then reset to level 4 and reset all the previous attempts

                {
                    incorrectAttempt = 0;
                    correctAttempt = 0;
                    level = 4;
                    return;
                }

                else if (level > 4 && incorrectAttempt != 2) //if the user enters a wrong answer for a single time, decrement the level by 1 and reset the correct attempts

                {
                    level = level -1;
                    correctAttempt = 0;
                    return;
                }

                else if (level === 4 && incorrectAttempt != 2) //if the user is on level 4 and enters the wrong input only once

                {
                    correctAttempt = 0;
                    return;
                }

            }

        }

        userInput = [];// if userInput is correct, then reset the userInput array
        correctAttempt ++;//if the userInput is correct, then increment correctAttempt by 1
        showSuccess(); // call showSuccess method

        if (correctAttempt == level-2)  //if the number of correct attempt is equal to the level-2, then increment the level

        {
            correctAttempt = 0;
            incorrectAttempt = 0;
            level++;
            return;
        }

        else// if the number of correct input is not equal to the level-2, then exit the function and take more input
        {
            return;
        }

    }
    else //if the user has not inputted the complete, then exit the function and ask for more input
    {
        return;
    }

}

/*
 * This callback function will be called regularly by the main.js page.
 * It is called when it is time for a new sequence to display to the user.
 * You should return a list of strings, from the following possible strings:
 *    "blue"
 *    "green"
 *    "yellow"
 *    "red"
*/
function giveNextSequence()//for getting the next sequence of the colours to the user
{
    // Include your own code here
    let result = 0;
    colourArray =  new Array(level);

    for (let i = 0; i < level ; i++) //

    {
        result = Math.floor((Math.random() * 4) + 1);

        if (result === 1) // if the result is 1, then append yellow to array

        {
            colourArray[i] = "yellow";

        }

        else if (result === 2)// if the result is 2, then append blue to array

        {
            colourArray[i] = "blue";
        }

        else if (result === 3)//if the result is 3, then append green to array

        {
            colourArray[i] = "green";
        }

        else // if the result is 4, then append red to array

        {
            colourArray[i] = "red";
        }
    }
    displayOutput = "<b>Please watch the sequence.</b>"+"<br/>";
    firstAreaRef.innerHTML = displayOutput;
    return colourArray;//returning the array having the different sequences of colours

}
/*
 * This callback function is called when the sequence to display to the user
 * has finished displaying and user is now able to click buttons again.
*/
function sequenceHasDisplayed()//function for displaying the general information to the users
{
    // Include your own code here
    let remainingCurrentSeq = 0; // variable for accouting number of attempts to be made in order to complete the current sequence
    let sequenceForTheNextLevel = 0; //for showing remaining additional correct sequences until they advance to the next level
    sequenceForTheNextLevel = (level - 2) - correctAttempt;
    remainingCurrentSeq = level - guessNumber; //for calculating the number of attempts to be made in ordre to complete the current sequence
    displayOutput = "<b>Please enter the sequence.</b>" + "<br/>"+"<br/>";
    displayOutput += "Length of the current sequence : " + level + "<br/>";
    displayOutput += "Nnumber of correct sequences(Current Level): " + correctAttempt + "<br/>";
    displayOutput += "Remaining correct sequences(Next Level): " + sequenceForTheNextLevel  + "<br/>";
    displayOutput += "Number of items remaining(Current Level): " + level + "<br/>";
    firstAreaRef.innerHTML = displayOutput;

    return;
}

/*
 * This callback function will be called if the user takes too long to make
 * a choice.  You can generally treat a call to this function as meaning the
 * user has 'given up'. This should be counted as an incorrect sequence given
 * by the user.
 *
 * When the app is is "tilt" input mode (see Step 7) then you might instead
 * use this function to select the button that the phone is tilted towards,
 * by calling one of the following functions:
 *    selectYellowButton
 *    selectRedButton
 *    selectBlueButton
 *    selectGreenButton
*/

function userChoiceTimeout() //function to call if the user fails to make a decision after 2 seconds
{
    // Include your own code here

    if (orientationMode === 1) //if the application is in touch mode

    {
      displayOutput = "<b>Timeout. Tap play button to watch the sequence</b>"
      firstAreaRef.innerHTML = displayOutput;
      guessNumber = 0; //as soon as the complete sequence has been entered, then reset the guessNumber to 0
      userInput = []; //reset the userInput array so that we can take the next input
      incorrectAttempt ++; //increment incorrectAttempt if the user took to long to press a button and take it as a failed attempt
      guessNumber = 0; //as soon as the complete sequence has been entered, then reset the guessNumber to 0
      showFailure();//call the showFailure method

      if (incorrectAttempt == 2)//if they enter incorrect answers 2 times consecutively, then reset to level 4 and reset all the previous attempts

      {
          incorrectAttempt = 0;
          correctAttempt = 0;
          level = 4;
          return;
      }

      else if (level > 4 && incorrectAttempt != 2) //if the user enters a wrong answer for a single time, decrement the level by 1 and reset the correct attempts

      {
          level = level -1;
          correctAttempt = 0;
          return;
      }

      else if (level === 4 && incorrectAttempt != 2) //if the user is on level 4 and enters the wrong input only once

      {
          correctAttempt = 0;
          return;
      }

    }

    else if (orientationMode === 2)  //if it's the tilt mode then what do we have to do

    {

        if (zVal >= -0.3 && zVal <= 0.3) //to check whether the user is facing in the north direction or not

        {

            if (xVal < 0 && yVal > 0) //top right
            {
                selectGreenButton();
            }

            else if (xVal > 0 && yVal > 0) //bottom right
            {
                selectRedButton();
            }

            else if (xVal > 0 && yVal < 0) //bottom left
            {
                selectYellowButton();
            }

            else if (xVal < 0 && yVal < 0) //top left
            {
                selectBlueButton();

            }

        }

        else //if the user is not facing the true north then display this message and ask to restart the game

        {
            let errorText = "<b>Please face true north direction.</b>"+"<br/>"+"<b>(Refresh the page to restart)</b>";
            firstAreaRef.innerHTML = errorText;

        }

      }

}

/*
 * This callback function will be called when the user taps the button at the
 * top-right of the title bar to toggle between touch- and tilt-based input.
 *
 * The mode parameter will be set to the newly selected mode, one of:
 *    TOUCH_MODE
 *    TILT_MODE
*/

function changeMode(mode)
{
    if (mode == TOUCH_MODE) //if the user selects the touch mode, then just simply exit the function
    {
        orientationMode = 1; //1 means that the user is in touch mode
        secondAreaRef.innerHTML = "";
        return;
    }
    else if (mode == TILT_MODE) //if the user selects the tilt mode

    {
        orientationMode = 2; //2 means that the user is in tilt mode
        checkOrientation();
        return;

    }
}

function checkOrientation()
{
    //this particular code has been taken from the Test Sensor App

    // Start: code for device orientation

    // try-catch: exception handling

    try //if we are not able to access the sensor due to this reason, then run this block of code
    {
        // initialising object for device orientation
        deviceAbsolute = new AbsoluteOrientationSensor({ frequency: 10 });

        //if sensor is available but there is problem in using it
        deviceAbsolute.addEventListener('error', event => {
        // Handle runtime errors.

        if (event.error.name === 'NotAllowedError')
        {
          firstAreaRef.innerText = "Permission to access sensor was denied.";
        }
        else if (event.error.name === 'NotReadableError' )
        {
          firstAreaRef.innerText = "Cannot connect to the sensor.";
        }});

        // when sensor has a reading, call the function
        deviceAbsolute.addEventListener('reading', () => reloadOrientationValues(deviceAbsolute));

        //start the sensor
        deviceAbsolute.start();

    }

    catch (error) // if we are having the reading from the sensor but still having an error, then run this block of code
    {
    // Handle construction errors.
      let errorText = "";
      if (error.name === 'SecurityError')
      {
        errorText = "Sensor construction was blocked by the Feature Policy.";
      }
      else if (error.name === 'ReferenceError')
      {
        errorText =" Sensor is not supported by the User Agent.";
      }
      else
      {
        errorText = "Sensor not supported";
      }
      firstAreaRef.innerText = errorText;
    }

}

function reloadOrientationValues(deviceAbsolute) //for getting the orientation values

    {

    xVal = deviceAbsolute.quaternion[0];
    yVal = deviceAbsolute.quaternion[1];
    zVal = deviceAbsolute.quaternion[2];
    colourDisplayer();

    }

function colourDisplayer() //function for displaying the current colour that the user will be selecitng in the tilt mode

{

    if (xVal < 0 && yVal > 0) //top right

    {
        toast = "Green";
    }

    else if (xVal > 0 && yVal > 0) //bottom right
    {
        toast = "Red";
    }

    else if (xVal > 0 && yVal < 0) //bottom left
    {
        toast = "Yellow";
    }

    else if (xVal < 0 && yVal < 0) //top left
    {
        toast = "Blue";
    }

    let output;
    output = "<br/>"+ "<b>The current colour: </b>"+ toast;

    if (orientationMode === 2)

    {
        secondAreaRef.innerHTML = output;
    }

    else

    {
        secondAreaRef.innerHTML = "";
    }

}
