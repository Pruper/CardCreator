let canvas = document.getElementById("card");
let ctx = canvas.getContext("2d");

let CARD_WIDTH = canvas.width;
let CARD_HEIGHT = canvas.height;
let CARD_BORDER_THICKNESS = 5;

let CARD_BACKGROUND_COLOR = "#ffffff";
//let CARD_BORDER_COLOR = "#00ffff";
let CARD_TEXT_COLOR = "#000000";

let CARD_NAME_TOP = 50;

let CARD_IMAGE_LEFT = 60;
let CARD_IMAGE_TOP = 135;
let CARD_IMAGE_SIZE = 180;

let cardImage = null;

let imageInput = document.getElementById('imageInput');
imageInput.addEventListener('change', handleImage, false);

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        cardImage = img;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function generateCard() {
    let cardColor = document.getElementById("colorInput").value;
    let cardName = document.getElementById("nameInput").value;
    let cardHealth = document.getElementById("healthInput").value;
    let cardAttack = document.getElementById("attackInput").value;
    let cardShowStats = !(cardHealth.length < 1 && cardAttack.length < 1);
    let cardAbility = document.getElementById("abilityInput").value;
    let cardDesc = document.getElementById("abilityDescInput").value;

    let cardImageTop = CARD_IMAGE_TOP;
    if (!cardShowStats) cardImageTop -= 65;

    ctx.fillStyle = CARD_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    ctx.lineWidth = CARD_BORDER_THICKNESS * 2;
    ctx.strokeStyle = cardColor;
    ctx.strokeRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    if (cardImage === null) {
        ctx.fillStyle = cardColor;
        ctx.fillRect(CARD_IMAGE_LEFT, cardImageTop, CARD_IMAGE_SIZE, CARD_IMAGE_SIZE);
    } else {
        ctx.drawImage(cardImage, CARD_IMAGE_LEFT, cardImageTop, CARD_IMAGE_SIZE, CARD_IMAGE_SIZE)
    }

    ctx.font = `bold ${Math.min(48, getFontSizeToFit(cardName, "Calibri", CARD_WIDTH - ((CARD_BORDER_THICKNESS + 10) * 2), "bold"))}px Calibri`;
    ctx.fillStyle = "black";
    ctx.fillText(cardName, (CARD_WIDTH - ctx.measureText(cardName).width) / 2, CARD_NAME_TOP);

    if (cardShowStats) {
        ctx.font = "24px Calibri";
        ctx.fillStyle = "black";
        ctx.fillText("Health: " + cardHealth, 15, CARD_NAME_TOP + 35);
        ctx.fillText("Attack: " + cardAttack, 15, CARD_NAME_TOP + 65);
    }

    ctx.font = `bold ${Math.min(32, getFontSizeToFit(cardAbility, "Calibri", CARD_WIDTH - ((CARD_BORDER_THICKNESS + 10) * 2), "bold"))}px Calibri`;
    ctx.fillStyle = "black";
    ctx.fillText(cardAbility, (CARD_WIDTH - ctx.measureText(cardAbility).width) / 2, cardImageTop + CARD_IMAGE_SIZE + 30);

    ctx.font = "20px Calibri";
    ctx.fillStyle = "black";
    cardDesc = cardDesc.replaceAll("\n", " <break> ").replaceAll("\\n", " <break> ");
    let descriptionWords = cardDesc.split(" ");
    let sizeLimit = CARD_WIDTH - (15 * 2);
    let descriptionLines = [];

    let currentLine = "";
    for (var i = 0; i < descriptionWords.length; i++) {
        if (descriptionWords[i] == "<break>" || ctx.measureText(currentLine).width + ctx.measureText(descriptionWords[i]).width > sizeLimit) {
            descriptionLines.push(currentLine);
            currentLine = "";
        }
        if (descriptionWords[i] != "<break>") currentLine += descriptionWords[i] + " ";
    }
    descriptionLines.push(currentLine);

    for (var i = 0; i < descriptionLines.length; i++) {
        ctx.fillText(descriptionLines[i], 15, cardImageTop + CARD_IMAGE_SIZE + 30 + 23 + (24 * i));
    }
}

function getFontSizeToFit(text, fontFace, maxWidth, additionalStyles = "") {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${additionalStyles + (additionalStyles.length > 0 ? " " : "")}1px ${fontFace}`;
    return maxWidth / ctx.measureText(text).width;
}