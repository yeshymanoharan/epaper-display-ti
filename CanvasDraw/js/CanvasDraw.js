 var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

var x = "white",
    y = 10;

function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;

    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "black";
    ctx.fill();

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

function color(obj) {
    switch (obj.id) {
        case "red":
            x = "red";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 14;

}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function save() {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var redBuffer = [];
    var blackBuffer = [];
    var nibbleIndex = 0;
    var bufferIndex = 0;

    //The data array consists of 4 consequetive values: red, green, blue, alpha.
    for (var i = 0; i < data.length; i += 4) {
        

        if (nibbleIndex == 8) {
            redBuffer[bufferIndex] = "0x" + ("00" + (+redBuffer[bufferIndex]).toString(16)).slice(-2);
            blackBuffer[bufferIndex] = "0x" + ("00" + (+blackBuffer[bufferIndex]).toString(16)).slice(-2);
            //console.log(redBuffer[bufferIndex]);

            nibbleIndex = 0;
            bufferIndex = bufferIndex + 1;
        }

        if(isNaN(redBuffer[bufferIndex])) {
            redBuffer[bufferIndex] = 0;
        }

        if(isNaN(blackBuffer[bufferIndex])) {
            blackBuffer[bufferIndex] = 0;
        }

        if (data[i] == 255 && data[i + 1] != 255 && data[i + 1] != 255) {
             redBuffer[bufferIndex] += 1 * Math.pow(2, 7 - nibbleIndex);
        }

        if (data[i] != 255 && data[i + 1] != 255 && data[i + 1] != 255) {
            blackBuffer[bufferIndex] += 1 * Math.pow(2, 7 - nibbleIndex);
        }
        //redBuffer[bufferIndex] += data[i] == 255 ? 1 * Math.pow(2, nibbleIndex) : 0;     // red
        //blackBuffer[bufferIndex] = data[i + 2] == 255 && data[i] != 255 ? 1 * Math.pow(2, nibbleIndex) : 0; // blue
        
        nibbleIndex++;
    }

    console.log(data);
    console.log(redBuffer);
    console.log(blackBuffer);

    insertArrayIntoElementById(redBuffer, "redBuffer")
    insertArrayIntoElementById(blackBuffer, "blackBuffer")

}

function insertArrayIntoElementById(array, id) {
    element = document.getElementById(id);
    element.innerHTML = "const uint8_t " + id + " [] = { " + array.toString() + " };";
}




function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}