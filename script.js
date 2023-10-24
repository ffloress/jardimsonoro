var sections = [{
    sentence: "Un Jardin Merveilleusement Sonore."
},
{
    sentence: "音の庭"
},
{
    sentence: "Aumenta o som, por favor."
},
{
    sentence: "この曲のリズムは素晴らしいですね"
},
{
    sentence: "Le rythme de cette chanson est incroyable!"
},
{
    sentence: "I can't stop dancing to this beat!"
},
{
    sentence: "What's the name of this track?"
},
{
    sentence: "このトラックの名前は何ですか"
},
{
    sentence: "C'est génial de l'écouter en boucle!"
},
{
    sentence: "This song is my new jam."
},
{
    sentence: "この曲は私の新しいお気に入りです"
},
{
    sentence: "Vamos dançar até o amanhecer..."
},
{
    sentence: "夜明けまで踊りましょう"
},
{
    sentence: "I can't get enough of this beat."
},
{
    sentence: "Cette playlist est un chef-d'œuvre!"
},
{
    sentence: "このプレイリストは傑作です"
},
{
    sentence: "Essa música me anima sempre..."
},
{
    sentence: "この曲はいつも気分を高めてくれます"
},
{
    sentence: "Cette mélodie est contagieuse!"
},
{
    sentence: "Who's the DJ behind this?"
},
{
    sentence: "Nothing but positive vibes!"
},
{
    sentence: "Cette playlist est un bijou."
},
{
    sentence: "A música é a linguagem universal!"
},
];

var i = 0;
var j = 0;
var k = 0;
var lengthSentence = 0;
var lengthArray = sections.length;
var forward = true;
var beginning = "";
var currentPart = "";
var interval = 50;
var opening = false;

function writing(text) {
lengthSentence = sections[i].sentence.length;
var body = document.body;
if (!opening) {
    setTimeout(function() {
        if (k < beginning.length) {
            if (beginning[k] === "<") {
                currentPart += ' <br id="brName">';
                k = k + 4;
            }
            currentPart += beginning[k];
            text.innerHTML = currentPart;
            k++;
            writing(text);
        } else if (k === beginning.length) {
            currentPart += " <br>";
            text.innerHTML = currentPart;
            opening = true;
            writing(text);
        }
    }, interval);
} else if (opening) {
    setTimeout(function() {
        interval = 50;
        if (j === lengthSentence) {
            forward = false;
        }
        if (j === lengthSentence - 2) {
            var afterTyping = document.querySelector(".afterTyping");
            if (afterTyping) {
                afterTyping.classList.add("onScreen");
            }
        }
        if (j === lengthSentence - 1 && forward) {
            interval = 2000;
        }
        if (j < lengthSentence && forward) {
            if (sections[i].sentence[j] === "&") {
                currentPart += "<strong>";
            } else if (sections[i].sentence[j] === "%") {
                currentPart += "</strong>";
            } else {
                currentPart += sections[i].sentence[j];
            }
            text.innerHTML = currentPart;
            j++;
        } else if (j > 0 && !forward) {
            if (sections[i].sentence[j] === "&") {
                currentPart = currentPart.slice(0, -8);
            } else if (sections[i].sentence[j] === "%") {
                currentPart = currentPart.slice(0, -9);
            } else {
                currentPart = currentPart.slice(0, -1);
            }
            text.innerHTML = currentPart;
            j--;
        } else if (j === 0) {
            forward = true;
            i++;
        }
        if (i === lengthArray) {
            i = 0;
        }
        writing(text);
    }, interval);
}
}


document.addEventListener("DOMContentLoaded", function() {

var firstTimer = 1;
var text = document.querySelector(".jstext");
setTimeout(function() {
    writing(text);
}, firstTimer);

var expandirButton = document.getElementById("expandir");
var collapsibleContent = document.getElementById("collapsible-content");

if (expandirButton && collapsibleContent) {
    expandirButton.addEventListener("click", function() {
        if (collapsibleContent.style.display === "none" || collapsibleContent.style.display === "") {
            collapsibleContent.style.display = "block";
        } else {
            collapsibleContent.style.display = "none";
        }
    });
}


// Get all elements with the class "loopCol"
var loopColElements = document.querySelectorAll('.loopCol');

// Function to handle the desired behavior
function handleMouseEnterAndClick() {
    // Find the next occurrence of an element with the class "fixedBg"
    document.getElementById("jstext").classList.add("hidden");
    var nextFixedBgElement = this.nextElementSibling;

    // Loop through siblings until we find a "fixedBg" element
    while (nextFixedBgElement && !nextFixedBgElement.classList.contains('fixedBg')) {
        nextFixedBgElement = nextFixedBgElement.nextElementSibling;
    }

    // Check if a "fixedBg" element was found
    if (nextFixedBgElement) {

        nextFixedBgElement.classList.add('show');

    }
}

// Function to handle mouse leave on the "loopCol" element
function handleMouseLeave() {
    document.getElementById("jstext").classList.remove("hidden");
    // Find the associated "fixedBg" element
    var nextFixedBgElement = this.nextElementSibling;

    // Check if a "fixedBg" element was found
    if (nextFixedBgElement) {
        // Remove the "show" class to hide the "fixedBg" element
        nextFixedBgElement.classList.remove('show');
    }
}

// Add a combined event listener for "mouseenter" and "click" to each "loopCol" element
loopColElements.forEach(function(loopColElement) {
    loopColElement.addEventListener('mouseenter', handleMouseEnterAndClick);
    /* loopColElement.addEventListener('click', handleMouseEnterAndClick);*/
    loopColElement.addEventListener('touchstart', handleMouseEnterAndClick);


    // Add a "mouseleave" event listener for the "loopCol" element
    loopColElement.addEventListener('mouseleave', handleMouseLeave);

      
});



document.addEventListener('click', function(event) {
    console.log('clickclose')
    // Get all elements with the class .fixedBg
    const elements = document.querySelectorAll('.fixedBg');

    // Loop through the elements and set their style display property to 'none'
    elements.forEach(function(element) {
        element.classList.remove('show');
    });
});


});