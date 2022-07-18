function initializingGif() {
    let numOfImage = 6;
    var num = Math.floor(Math.random() * numOfImage + 1); 
    randomimage = "image/loading/loading" + num +".gif";
    var img = document.createElement('img');
    img.src = randomimage;
    var div = document.createElement('div');
    div.appendChild(img);
    document.getElementById('initializingDiv').appendChild(div);
}