

    function new_window(titleString, descriptionString,dateString,hourString,locationString) {
        msg = window.open("","msg","height=620,width=1000,left=180,top=180,scrollbars=1");
        msg.document.write("<html><title>CIMI thematic trimester on Image Processing</title>");
        msg.document.write("<link rel='stylesheet' type='text/css' href='cimi-main_pop.css' title='Variant Light' media='screen,projection' />");
        msg.document.write("<body onblur=window.close()>");
        descriptionString = descriptionString.replace(/(\n)/gm,"<br/>");
        msg.document.write("<div id='title'>" + titleString + "</div>");
        msg.document.write("<div id='date'>" + dateString + ", " + hourString + "</div>");
        msg.document.write("<div id='location'>" + locationString + "</div>");
        msg.document.write("<div id='description'>" + descriptionString + "</div>");
        msg.document.write("</body></html>");
    }

    function init() {
        // init the Google data JS client library with an error handler
        google.gdata.client.init(handleGDError);
        // load the code.google.com developer calendar
        loadDeveloperCalendar();
    }
    function loadDeveloperCalendar() {
        loadCalendarByAddress('scgroup.irit@gmail.com');
    }
    
    function padNumber(num) {
        if (num <= 9) {
            return "0" + num;
        }
        return num;
    }
    
    function handleGDError(e) {
        document.getElementById('jsSourceFinal').setAttribute('style','display:none');
        if (e instanceof Error) {
            /* alert with the error line number, file and message */
            alert('Error at line ' + e.lineNumber +
                ' in ' + e.fileName + '\n' +
                'Message: ' + e.message);
            /* if available, output HTTP error code and status text */
            if (e.cause) {
            var status = e.cause.status;
            var statusText = e.cause.statusText;
            alert('Root cause: HTTP error ' + status + ' with status text of: ' +
                    statusText);
            }
        } else {
            alert(e.toString());
        }
    }    
       
    function loadCalendarByAddress(calendarAddress) {
        var calendarUrl = 'https://www.google.com/calendar/feeds/' + calendarAddress + '/public/full';
        loadCalendar(calendarUrl);
    }
    
    function loadCalendar(calendarUrl) {
        var service = new google.gdata.calendar.CalendarService('gdata-js-client-samples-simple');
        var query = new google.gdata.calendar.CalendarEventQuery(calendarUrl);
        query.setOrderBy('starttime');
        query.setSortOrder('ascending');
        query.setFutureEvents(true);
        query.setSingleEvents(true);
        query.setMaxResults(100);
        service.getEventsFeed(query, listEvents, handleGDError);
    }
    
    function loadIPEventsNext() {
    var calendarUrl = 'https://www.google.com/calendar/feeds/2b1bff72ec4d1e7132a186ca85a0a461%40group.calendar.google.com/public/full';
    loadIPEventsNextCalendar(calendarUrl);
    }

    function loadIPEventsNextCalendar(calendarUrl) {
        var service = new google.gdata.calendar.CalendarService('gdata-js-client-samples-simple');
        var query = new google.gdata.calendar.CalendarEventQuery(calendarUrl);
        query.setOrderBy('starttime');
        query.setSortOrder('ascending');
        query.setFutureEvents(true);
        query.setSingleEvents(true);
        query.setMaxResults(100);
        service.getEventsFeed(query, listIPEventsNext, handleGDError);
    }    

    function loadIPEventsPast() {
    var calendarUrl = 'https://www.google.com/calendar/feeds/2b1bff72ec4d1e7132a186ca85a0a461%40group.calendar.google.com/public/full';
    loadIPEventsPastCalendar(calendarUrl);
    }    

    function loadIPEventsPastCalendar(calendarUrl) {
        var PastIPservice = new google.gdata.calendar.CalendarService('gdata-js-client-samples-simple');
        var query = new google.gdata.calendar.CalendarEventQuery(calendarUrl);
        var currentTime = new Date();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var starttimeEvents = null;
        startimeEvents = padNumber(year) + '-' + padNumber(month) + '-' + padNumber(day+1);
        query.setOrderBy('starttime');
        query.setSortOrder('ascending');
        query.setMaximumStartTime(startimeEvents);
        query.setSingleEvents(true);
        query.setMaxResults(100);
        PastIPservice.getEventsFeed(query, listIPEventsPast, handleGDError);
    }

    function listEvents(feedRoot) {
        var entries = feedRoot.feed.getEntries();
        var eventDiv = document.getElementById('events');
        if (eventDiv.childNodes.length > 0) {
            eventDiv.removeChild(eventDiv.childNodes[0]);
        }
        /* create a new unordered list */
        var ul = document.createElement('ul');
        /* set the calendarTitle div with the name of the calendar */
        document.getElementById('calendarTitle').innerHTML = "<h4>Next events within the CIMI program</h4>";
        /* loop through each event in the feed */
        var len = entries.length;
        for (var i = 0; i < len; i++) {
            var entry = entries[len-i-1];
            var title = entry.getTitle().getText();
            var startDateTime = null;
            var startJSDate = null;
            var stopDateTime = null;
            var stopJSDate = null;
            var times = entry.getTimes();
            if (times.length > 0) {
                startDateTime = times[0].getStartTime();
                startJSDate = startDateTime.getDate();
                stopDateTime = times[0].getEndTime();
                stopJSDate = stopDateTime.getDate();
            }
            var entryLinkHref = null;
            if (entry.getHtmlLink() != null) {
                entryLinkHref = entry.getHtmlLink().getHref();
            }
        //  var dateString = (startJSDate.getMonth() + 1) + "/" + startJSDate.getDate();
            var dateString = padNumber(startJSDate.getDate()) + "/" + padNumber(startJSDate.getMonth() + 1) + "/" +  "20" + padNumber(startJSDate.getYear()-100)  +  " - "  + padNumber(stopJSDate.getDate()) + "/" + padNumber(stopJSDate.getMonth() + 1) +  "/" + "20" + padNumber(stopJSDate.getYear()-100) ;
            if (!startDateTime.isDateOnly()) {
                dateString += " " + startJSDate.getHours() + ":" +
                padNumber(startJSDate.getMinutes());
            }
            var li = document.createElement('li');

            /* if we have a link to the event, create an 'a' element */
            if (entryLinkHref != null) {
                entryLink = document.createElement('a');
                entryLink.setAttribute('href', entryLinkHref);
                entryLink.appendChild(document.createTextNode(title));
                li.appendChild(entryLink);
                li.appendChild(document.createTextNode(' - ' + dateString));
            } else {
                li.appendChild(document.createTextNode(title + ' - ' + dateString));
            }

            /* append the list item onto the unordered list */
            ul.appendChild(li);
        }
        eventDiv.appendChild(ul);
    }


    function listIPEventsNext(feedRoot) {
    var entries = feedRoot.feed.getEntries();
    var eventDiv = document.getElementById('IPEventsNext');
    if (eventDiv.childNodes.length > 0) {
        eventDiv.removeChild(eventDiv.childNodes[0]);
    }
    /* create a new table */
    var atable = document.createElement('table');

    document.getElementById('IPEventsNextCalendarTitle').innerHTML = "<h4>List of upcoming seminars</h4>";

    /* loop through each event in the feed */
    var len = entries.length;
    for (var i = 0; i < len; i++) {
        var entry = entries[len-i-1];

        /* getting the title of the event */
        var titleString = "TBA";
        var title = entry.getTitle().getText();
        if (title.length > 0) {
            titleString = title;
            titleString = titleString.replace(/(S\351minaire)/gi,"Seminar");
            titleString = titleString.replace(/(Cours)/gi,"Lecture");
        }

        /* getting the date of the event */
        var startDateTime = null;
        var startJSDate = null;
        var stopDateTime = null;
        var stopJSDate = null;
        var times = entry.getTimes();

        if (times.length > 0) {
            startDateTime = times[0].getStartTime();
            startJSDate = startDateTime.getDate();
            stopDateTime = times[0].getEndTime();
            stopJSDate = stopDateTime.getDate();
        }
        var dateString = padNumber(startJSDate.getDate()) +  "/" + padNumber(startJSDate.getMonth() + 1) +  "/" + "20" + padNumber(startJSDate.getYear()-100);

        /* getting the hour of the event */
        var hourString = null;
        if (!startDateTime.isDateOnly()) {
            hourString = startJSDate.getHours() + ":" + padNumber(startJSDate.getMinutes());
        }

        /* getting the location of the event */
        var location = entry.getLocations()[0].getValueString();
        var locationString = "TBA";
            if (location.length>0) {
            locationString = location;
            locationString = locationString.replace(/, Toulouse, France/gi,"");
            locationString = locationString.replace("Institut de Math\351matiques de Toulouse","IMT");
        }
        /* getting the description of the event */
        var description = entry.getContent().getText();
        var descriptionString = null;
        if (description.length>0) {
            descriptionString = description;
            descriptionString = descriptionString.replace(/'/gi,"\\'");
            descriptionString = descriptionString.replace(/(\r\n|\n|\r)/gm,"\\n");
            //descriptionString = descriptionString.replace(/(\r\n|\n|\r)/gm,"<br>");
        }

        /* beginning the table */
        var arow = document.createElement('tr');
        var acolwho = document.createElement('td');
        var acolwhen = document.createElement('td');
        var acolhour = document.createElement('td');
        var acolwhere = document.createElement('td');
        if (descriptionString != null) {
            entryLink = document.createElement('a');
            // entryLink.setAttribute('onClick', "alert('" + descriptionString + "')");
            // entryLink.setAttribute('onClick', "new_window('" + descriptionString +"')");
            entryLink.setAttribute('onClick', "new_window('" + titleString +"','" + descriptionString +"','" + dateString + "','" + hourString + "','" + locationString +"')");
            entryLink.setAttribute('href', "#");
            entryLink.appendChild(document.createTextNode(titleString));

            acolwhen.className = "semwhen";
            acolhour.className = "semhour";
            acolwho.className = "semwho";
            acolwhere.className = "semwhere";

            acolwho.appendChild(entryLink);
            acolwhen.appendChild(document.createTextNode(dateString));
            acolhour.appendChild(document.createTextNode(hourString));
            acolwhere.appendChild(document.createTextNode(locationString));
            arow.appendChild(acolwhen);
            arow.appendChild(acolhour);
            arow.appendChild(acolwho);
            arow.appendChild(acolwhere);
        } else {

            acolwhen.className = "semwhen";
            acolhour.className = "semhour";
            acolwho.className = "semwho";
            acolwhere.className = "semwhere";

            acolwho.appendChild(document.createTextNode(titleString));
            acolwhen.appendChild(document.createTextNode(dateString));
            acolhour.appendChild(document.createTextNode(hourString));
            acolwhere.appendChild(document.createTextNode(locationString));
            arow.appendChild(acolwhen);
            arow.appendChild(acolhour);
            arow.appendChild(acolwho);
            arow.appendChild(acolwhere);
        }

        /* append the row onto the unordered table */
        atable.appendChild(arow);
    }
    eventDiv.appendChild(atable);
    }

    function listIPEventsPast(feedRoot) {
    var entriesPast = feedRoot.feed.getEntries();
    var eventDivPast = document.getElementById('IPEventsPast');
    if (eventDivPast.childNodes.length > 0) {
        eventDivPast.removeChild(eventDivPast.childNodes[0]);
    }
    /* create a new table */
    var atable = document.createElement('table');

    document.getElementById('IPEventsPastCalendarTitle').innerHTML ="<h4>List of past seminars</h4>";

    /* loop through each event in the feed */
    var len = entriesPast.length;
    for (var i = 0; i < len; i++) {
        var entry = entriesPast[len-1-i];

        /* getting the title of the event */
        var titleString = "TBA";
        var title = entry.getTitle().getText();
        if (title.length > 0) {
            titleString = title;
            titleString = titleString.replace(/(S\351minaire)/gi,"Seminar");
            titleString = titleString.replace(/(Cours)/gi,"Lecture");
        }

        /* getting the date of the event */
        var startDateTime = null;
        var startJSDate = null;
        var stopDateTime = null;
        var stopJSDate = null;
        var times = entry.getTimes();

        if (times.length > 0) {
        startDateTime = times[0].getStartTime();
        startJSDate = startDateTime.getDate();
        stopDateTime = times[0].getEndTime();
        stopJSDate = stopDateTime.getDate();
        }
        var dateString = padNumber(startJSDate.getDate()) +  "/" + padNumber(startJSDate.getMonth() + 1) +  "/" + "20" + padNumber(startJSDate.getYear()-100);

        /* getting the hour of the event */
        var hourString = null;
        if (!startDateTime.isDateOnly()) {
        hourString = startJSDate.getHours() + ":" + padNumber(startJSDate.getMinutes());
        }

        /* getting the location of the event */
        var location = entry.getLocations()[0].getValueString();
        var locationString = "TBA";
        if (location.length>0) {
            locationString = location;
            locationString = locationString.replace(/, Toulouse, France/gi,"");
            locationString = locationString.replace("Institut de Math\351matiques de Toulouse","IMT");
        }
        
    
        /* getting the description of the event */
        var description = entry.getContent().getText();
        var descriptionString = null;
        if (description.length>0) {
            descriptionString = description;
            descriptionString = descriptionString.replace(/'/gi,"\\'");
            descriptionString = descriptionString.replace(/(\r\n|\n|\r)/gm,"\\n");
        }

        /* beginning the table */
        var arow = document.createElement('tr');
        var acolwho = document.createElement('td');
        var acolwhen = document.createElement('td');
        var acolhour = document.createElement('td');
        var acolwhere = document.createElement('td');
        if (descriptionString != null) {
            entryLink = document.createElement('a');
            //entryLink.setAttribute('onClick', "alert('" + descriptionString + "')");
            //entryLink.setAttribute('onClick', "new_window('" + descriptionString +"')");
            entryLink.setAttribute('onClick', "new_window('" + titleString +"','" + descriptionString +"','" + dateString + "','" + hourString + "','" + locationString +"')");
            entryLink.setAttribute('href', "#");
            entryLink.appendChild(document.createTextNode(titleString));

            acolwhen.className = "semwhen";
            acolhour.className = "semhour";
            acolwho.className = "semwho";
            acolwhere.className = "semwhere";

            acolwho.appendChild(entryLink);
            acolwhen.appendChild(document.createTextNode(dateString));
            acolhour.appendChild(document.createTextNode(hourString));

            if (location.length>0) {
                if (location.substr(0,4) =="http" || location.substr(0,3) =="www") {
                    /* attachement */
                    attachmentLink = document.createElement('a');
                    attachmentLink.setAttribute('href', location);
                    attachmentLink.appendChild(document.createTextNode("[pdf]"));
                    acolwhere.appendChild(attachmentLink);
                }
                else {
                    /* location */
                    locationString = location;
                    locationString = locationString.replace(/, Toulouse, France/gi,"");
                    locationString = locationString.replace("Institut de Math\351matiques de Toulouse","IMT");
                    acolwhere.appendChild(document.createTextNode(locationString));
                }
            }
           
            arow.appendChild(acolwhen);
            arow.appendChild(acolhour);
            arow.appendChild(acolwho);
            arow.appendChild(acolwhere);

            
        } else {

            acolwhen.className = "semwhen";
            acolhour.className = "semhour";
            acolwho.className = "semwho";
            acolwhere.className = "semwhere";

            acolwho.appendChild(document.createTextNode(titleString));
            acolwhen.appendChild(document.createTextNode(dateString));
            acolhour.appendChild(document.createTextNode(hourString));
            acolwhere.appendChild(document.createTextNode(locationString));
            arow.appendChild(acolwhen);
            arow.appendChild(acolhour);
            arow.appendChild(acolwho);
            arow.appendChild(acolwhere);
        }

        /* append the row onto the unordered table */
        atable.appendChild(arow);
    }
    eventDivPast.appendChild(atable);
}
