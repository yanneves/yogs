var currdate = new Date();
var timezoneOffset = currdate.getTimezoneOffset() / 2;

window.onload = function(){
    loadEvents();
    loadMobileView();
    document.addEventListener("click", handleClick);
}

var currview = currdate.getUTCDate();
var startdate;
if (currdate.getUTCDate() < 8){
    startdate = 1;
} else if (currdate.getUTCDate() < 15){
    startdate = 8;
} else if (currdate.getUTCDate() < 22){
    startdate = 15
} else if (currdate.getUTCDate() < 29){
    startdate = 22;
} else {
    startdate = 29;
}

function handleClick(e){
    if (e.target.classList.contains("event")){
        e.preventDefault();
        if (e.target.classList.contains("vod") || e.target.classList.contains("live") || e.target.classList.contains("soon")){
            var url = e.target.getAttribute("data-link");
            window.open(url, "_blank");
        }
    } else if (e.target.classList.contains("btn")){
        changeMobileView(e.target.getAttribute("id"));
    }
}

function changeMobileView(dir){
    if (dir === "next"){
        if (currview !== 7){
            currview += 1;
        }
    } else if (dir === "prev"){
        if (currview !== 1){
            currview -= 1;
        }
    }
    loadMobileView();
}

function loadJSON(callback){
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://yogs.ryanoconr.com/events.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200"){
            callback(JSON.parse(xobj.response));
        }
    };
    xobj.send(null);
}

function buildDay(data, elem){
    Object.keys(data.events).forEach(e => {
        var title = (data.events[e].title !== undefined) ? data.events[e].title : "";
        var subtitle = (data.events[e].subtitle !== undefined) ? data.events[e].subtitle : "";
        var subtitle2 = (data.events[e].subtitle2 !== undefined) ? data.events[e].subtitle2 : "";
        var info = (data.events[e].info !== undefined) ? data.events[e].info : "";
        var extra = (data.events[e].extra !== undefined) ? data.events[e].extra : "";
        var type = (data.events[e].type !== undefined) ? data.events[e].type : "";

        var eventDate = data.date;
        var eventHour = data.events[e].startHour;
        var d = new Date();
        var utc = d.getUTCDate();
        var utchours = d.getUTCHours();

        var event = document.createElement("div");
        event.classList.add("event");

        if (eventDate < utc){
            event.classList.add("vod");
            event.setAttribute("data-link", data.events[e].vod);
        } else if (eventHour <= utchours){
            event.classList.add("live");
            event.setAttribute("data-link", "https://twitch.tv/yogscast");
        } else if (utchours >= eventHour - 1 && eventDate == utc){
            event.classList.add("soon");
            event.setAttribute("data-link", "https://twitch.tv/yogscast");
        } else {
            event.classList.add("upcoming");
        }
        
        if (type !== ""){
            var classes = type.split(" ");

            for (i = 0; i < classes.length; i++){
                if (classes[i] !== ""){
                    event.classList.add(classes[i]);
                }
            }
        }

        var center = document.createElement("div");

        if (title !== ""){
            var h1 = document.createElement("h1");
            title = title.replace(/\n/g, "<br />");
            h1.innerHTML = title;
            center.appendChild(h1);
        }

        if (info !== ""){
            var h3 = document.createElement("h3");
            info = info.replace(/\n/g, "<br />");
            h3.innerHTML = info;
            center.appendChild(h3);
        }

        if (subtitle !== ""){
            var h2 = document.createElement("h2");
            subtitle = subtitle.replace(/\n/g, "<br />");
            h2.innerHTML = subtitle;
            center.appendChild(h2);
        }

        if (subtitle2 !== ""){
            var h2 = document.createElement("h2");
            subtitle2 = subtitle2.replace(/\n/g, "<br />");
            h2.innerHTML = subtitle2;
            center.appendChild(h2);
        }

        if (extra !== ""){
            var h1 = document.createElement("h1");
            extra = extra.replace(/\n/g, "<br />");
            h1.innerHTML = extra;
            center.appendChild(h1);
        }

        center.classList.add("center");

        event.appendChild(center);

        document.getElementById(elem).appendChild(event);
    });
}

function loadMobileView(){
    loadJSON(function(res){
        var events;
        var d = new Date();
        var utc = d.getUTCDate();

        // work out which weeks events to show
        if (utc < 8){
            events = res.week1;
        } else if (utc < 15){
            events = res.week2;
        } else if (utc < 22){
            events = res.week3;
        } else if (utc < 29){
            events = res.week4;
        } else {
            events = res.week5;
        }

        document.getElementById("mday").innerHTML = '';

        // init mobile view
        var node = document.getElementById("mheading");
        if (currview === 1){
            node.innerHTML = "saturday 1<span>st</span>";
            buildDay(events.sat, "mday");
        } else if (currview === 2){
            node.innerHTML = "sunday 2<span>nd</span>";
            buildDay(events.sun, "mday");
        } else if (currview === 3){
            node.innerHTML = "monday 3<span>rd</span>";
            buildDay(events.mon, "mday");
        } else if (currview === 4){
            node.innerHTML = "tuesday 4<span>th</span>";
            buildDay(events.tue, "mday");
        } else if (currview === 5){
            node.innerHTML = "wednesday 5<span>th</span>";
            buildDay(events.wed, "mday");
        } else if (currview === 6){
            node.innerHTML = "thursday 6<span>th</span>";
            buildDay(events.thur, "mday");
        } else if (currview === 7){
            node.innerHTML = "friday 7<span>th</span>";
            buildDay(events.fri, "mday");
        }
    });
}

function loadEvents(){
    loadJSON(function(res){
        var events;
        var d = new Date();
        var utc = d.getUTCDate();

        // work out which weeks events to show
        if (utc < 8){
            events = res.week1;
        } else if (utc < 15){
            events = res.week2;
        } else if (utc < 22){
            events = res.week3;
        } else if (utc < 29){
            events = res.week4;
        } else {
            events = res.week5;
        }

        // set times
        var morningStart = new Date();

        

        // init desktop view
        buildDay(events.sat, "sat");
        buildDay(events.sun, "sun");
        buildDay(events.mon, "mon");
        buildDay(events.tue, "tue");
        buildDay(events.wed, "wed");
        buildDay(events.thur, "thur");
        buildDay(events.fri, "fri");
    });
}