function rand(min, max) {
    return min + Math.random() * (max - min);
}

function changebackground() {
    var body = document.body;
    var h = rand(1, 360);
    var s = rand(80, 90);
    var l = rand(50, 60);
    var h2;
    if (h < 180) {
        h2 = h + 180;
    } else {
        h2 = h - 180;
    }

    var fixedBg = document.querySelector(".fixedBg");
    var loopCol = document.querySelector(".loopCol");
    var coloredHover = document.querySelectorAll(".coloredHover");

    fixedBg.style.background = "rgba(0, 0, 0, 0.7)";
    fixedBg.style.color = "hsl(" + h2 + "," + s + "%," + l + "%)";
    loopCol.style.background = "hsl(" + h + "," + s + "%," + l + "%)";

    coloredHover.forEach(function (element) {
        element.style.color = "hsl(" + h + "," + s + "%," + l + "%)";
    });
}


    document.addEventListener("DOMContentLoaded", function () {
        changebackground();
        setTimeout(function () {
            document.body.classList.remove("noTransition");
            var fixedBg = document.querySelector(".fixedBg");
            fixedBg.classList.remove("noTransition");
            changebackground();
        }, 2000);
        setInterval(function () {
            changebackground();
        }, 20000);
    
        var firstTimer = 5000;
        var text = document.querySelector(".jstext");
        setTimeout(function () {
            writing(text);
        }, firstTimer);
    
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            document.body.classList.add("firefoxFix");
        }
    
        var bgFixed = document.querySelector(".fixedBg");
        var elements = document.querySelectorAll(".fixedBg span");
        var triggerHover = document.querySelector(".loopCol");
    
        triggerHover.addEventListener('mouseenter', function () {
            var bgFixed = document.querySelector(".fixedBg");
            var elements = document.querySelectorAll(".fixedBg span");
            bgFixed.style.opacity = 1;
            elements.forEach(function (element, index) {
                element.style.transform = "translateY(0)";
            });
        });
    
        triggerHover.addEventListener('mouseleave', function () {
            var bgFixed = document.querySelector(".fixedBg");
            var elements = document.querySelectorAll(".fixedBg span");
            bgFixed.style.opacity = 0;
            elements.forEach(function (element, index) {
                element.style.transform = "translateY(" + (index + 1) * 30 + "px)";
            });
        });
    
    
    });