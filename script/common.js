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


function getCurrentVersion() {
    $.get('latestVersion.txt',
        function (data) {
            var version = "v" + swVersion;
            if (data.trim() != swVersion.trim()) {
                version += "(舊版本)";
            }
            $('#version').html(version);
        }
    );
}

function getMemberInfo() {
    const memberPoint = localStorage.getItem("member-point");
    if (memberPoint) {
        $('#member-info').html(memberPoint.split("|")[0] + "分");
    }
}

function resetMemberPoint() {
    if (confirm(isUK() ? "Want to reset?" : "想重新計過?")) {
        localStorage.setItem("member-point", 0);
        getMemberInfo();
    } else {
        alert((isUK() ? "Laugh die" : "笑死" ) + "🤣🤣🤣")
    }
}

function country(newCountry = null) {
    if (newCountry) {
        localStorage.setItem("country", newCountry);
        location.href = "index.html";
    } else {
        return localStorage.getItem("country");
    };    
}

function isUK() {
    return country() == "UK";
}

function cors(link) {
    //return `http://192.168.8.1:18080/php?link=${encodeURIComponent(link)}`;
    //return `https://stsk.rf.gd/cors?link=${encodeURIComponent(link)}`;
    //return `http://stsk.byethost10.com/cors?link=${encodeURIComponent(link)}`;
    return `https://stsk3.000webhostapp.com/cors/?link=${encodeURIComponent(link)}`;


}