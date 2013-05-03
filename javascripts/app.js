// SINE WAVE
var sine = []; 
for (var i=0; i<10000; i++) sine[i] = 128+Math.round(127*Math.sin(i/5));
var sinewave = new RIFFWAVE(sine);

/* leadingZero: put zeroes in front of decimal values that are less than ten */
function leadingZero(value) {
    if (value < 10) return "0" + value.toString();
    return value.toString();
}

/* setTimerDisplay: take a value in seconds, and convert it to minutes/seconds, 
 * or finish the timer if we've reached zero.
 */
function setTimerDisplay(timer, seconds) {
    var text;
    if (seconds > 0) {
        var minutes = Math.floor(seconds / 60); 
        text = leadingZero(Math.floor(seconds / 60)) + ":" 
            + leadingZero(seconds % 60);
    }
    else { // if we've exhausted our time
        // create our alarm audio, and append it to the timer
        var audio = new Audio(sinewave.dataURI);
        timer.append(audio);
        audio.play();

        //set various styles and text
        text = "Done!"; 
        timer.find("a.cancel").text("Dismiss");
    }

    timer.find("h2").text(text);
}

/* addTimerToDOM: take a timer, and add it to the DOM creating new rows
 * wherever necessary.
 */
function addTimerToDOM(timer) {
    var timers = $("#timers");
    var last_row = timers.children(":last");
    
    if (last_row.length) {
        if (last_row.children().length > 1) {
            timers.append(
                    $("<div>", { 'class': "row" }).append(timer)
            );
        }
        else {
            last_row.append(timer);
        }
        
        return;
    }

    timers.append(
            $("<div>", { 'class': "row" }).append(timer)
    );
}

/* reorganizeTimers: traverse the DOM, and make sure that each row has two
 * timers in it, unless it's the last row.
 */
function reorganizeTimers() {
    var timers = $("#timers");

    timers.children().each(function () {
        if ($(this).children().length < 2) {
            var next_row = $(this).next();
            if (next_row.children().length > 0) {
                var next_element = next_row.children(":first");
                next_element.detach();
                $(this).append(next_element);
            }
        }
    });
}

$(document).ready(function() {
    $("#add-timer").submit(function(e) {
        e.preventDefault();
        var rawInput = $(this).find("input:text").val();
        var time = juration.parse(rawInput); 

        var timer = $('<div>', { 'class': "timer large-6 columns" }).append( 
            $('<div>', { 'class': "panel" }).append(
                $('<h2>', { 'text': time })
            )
        );
        timer.data('tf', {
            method: function (self) {
                self.data('tf').ticks--;
                setTimerDisplay(self, self.data('tf').ticks);

                // if we haven't reached zero, re-set our interval
                // TODO make this calculate actual milliseconds for timeout
                if (self.data('tf').ticks > 0)
                    setTimeout(function() { 
                        self.data('tf').method(self); 
                    }, 1000)
            },
            ticks: time,
            canceled: false,
            cancel: function(self) {
                var parent_row = self.parent();
                self.data('tf').canceled = true; 
                self.fadeOut(400, function() { 
                    self.remove(); 
                    if (parent_row.children().length < 1) parent_row.remove();
                    reorganizeTimers();
                });
            },
            snooze: function(self) {
            }
        });

        // set initial display and start timer
        setTimerDisplay(timer, time);
        setTimeout(function() { 
            timer.data('tf').method(timer);
        }, 1000);

        timer.find(".panel").append(
            $("<a>", { 'text': "Cancel", 
                       'href': "#",
                       'class': "small cancel button" }).click(function(e) {
                e.preventDefault();
                timer.data('tf').cancel(timer);
            })
        );
        addTimerToDOM(timer);
    });
});

