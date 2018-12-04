window.onload = function(){
    loadEvents();
    document.addEventListener("click", handleClick);
}

function handleClick(e){
    if (e.target.classList.contains("event")){
        e.preventDefault();
        if (e.target.classList.contains("vod") || e.target.classList.contains("live") || e.target.classList.contains("soon")){
            var url = e.target.getAttribute("data-link");
            window.open(url, "_blank");
        }
    }
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

        elem.appendChild(event);
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

        buildDay(events.sat, document.getElementById("sat"));
        buildDay(events.sun, document.getElementById("sun"));
        buildDay(events.mon, document.getElementById("mon"));
        buildDay(events.tue, document.getElementById("tue"));
        buildDay(events.wed, document.getElementById("wed"));
        buildDay(events.thur, document.getElementById("thur"));
        buildDay(events.fri, document.getElementById("fri"));
    });
}