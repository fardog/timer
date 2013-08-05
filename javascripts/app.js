/* Copyright (c) 2013 Far Dog LLC and Nathan Wittstock (http://www.fardogllc.com/)
 * Licensed under an MIT license. The the attached LICENSE.txt for details. 
 */

$(document).foundation();

var COLUMN_VALUE = 4;
var COLUMN_TOTAL = 12;

var alarmSound = new Audio();

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
    var prefix = "";
    if (seconds < 0 && !timer.hasClass("done")) { // if we've exhausted our time
        timer.addClass("done");
        timer.data('tf').sound.play();

        //set various styles and text
        text = "Done!"; 
        var panel = timer.find(".panel");
        panel.animate( { backgroundColor: "#31ff3f" }, 1000);
        var cancel_button = timer.find("a.cancel");
        cancel_button.text("Clear");
        cancel_button.removeClass("cancel");
        cancel_button.addClass("large success expand");
		timer.children("div").append(
			$("<a>", { 'text': "Silence",
					   'href': "#",
					   'class': "large alert button expand" }).click(function(e) {
				e.preventDefault();
				timer.data('tf').silence(timer);
				$(this).text("Silenced");
				$(this).addClass("disabled");
			})
		);
    }

    if (seconds < 0) {
        seconds = 0 - seconds;
        prefix = "+";
    }

    var minutes = Math.floor(seconds / 60); 
    var hours = Math.floor(minutes / 60);
    text = leadingZero(minutes - hours * 60) + ":" 
        + leadingZero(seconds % 60);
    if (hours > 0) {
        text = hours.toString() + " hr. <small>" + text + "</small>";
        timer.find("h2").addClass("hours");
    }
    else
        timer.find("h2").removeClass("hours");
    timer.find("h2").empty().append(prefix + text);

    
}

/* addTimerToDOM: take a timer, and add it to the DOM creating new rows
 * wherever necessary.
 */
function addTimerToDOM(timer) {
    var timers = $("#timers");
    var last_row = timers.children(":last");

    var intro = $("#intro");
    if (intro.length) intro.remove();
    
    if (last_row.length) {
        if (last_row.children().length * COLUMN_VALUE >= COLUMN_TOTAL) {
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
        if ($(this).children().length * COLUMN_VALUE < COLUMN_TOTAL) {
            var next_row = $(this).next();
            if (next_row.children().length > 0) {
                var next_element = next_row.children(":first");
                next_element.detach();
                $(this).append(next_element);
            }
            if (next_row.children().length < 1) {
                next_row.remove();
            }
        }
    });
}

function setError(textInput, message) {
    textInput.parent().addClass("error");
    textInput.parent().children("small").remove();
    textInput.parent().append(
            $("<small>", { 'text': message })    
    );
}

function createTimer(time) {
	
	var timer = $('<div>', { 'class': "timer large-" + COLUMN_VALUE + " columns" }).append( 
		$('<div>', { 'class': "panel" }).append(
			$('<h2>', { 'text': time })
		)
	);
	timer.data('tf', {
		method: function (self) {
			var now = new Date();
			var remainder = 
				self.data('tf').finishTime.valueOf() - now.valueOf();
			setTimerDisplay(self, Math.ceil(remainder / 1000));

			// if we haven't reached zero, re-set our interval
			setTimeout(function() { 
				self.data('tf').method(self); 
			});
		},
		finishTime: new Date(Date.now() + time * 1000),
		canceled: false,
		cancel: function(self) {
			var parent_row = self.parent();
			self.data('tf').sound.pause();
			self.data('tf').canceled = true; 
			self.fadeOut(400, function() { 
				self.remove(); 
				if (parent_row.children().length < 1) parent_row.remove();
				reorganizeTimers();
			});
		},
		silenced: false,
		silence: function(self) {
			self.data('tf').sound.pause();
			self.data('tf').silenced = true;
		},
		sound: alarmSound.cloneNode(true)
	});

	// set initial display and start timer
	setTimerDisplay(timer, time);
	setTimeout(function() { 
		timer.data('tf').method(timer);
	}, 1000);

	timer.children("div").append(
		$("<a>", { 'text': "Cancel", 
					'href': "#",
					'class': "large cancel button expand" }).click(function(e) {
			e.preventDefault();
			timer.data('tf').cancel(timer);
		})
	);
	
	addTimerToDOM(timer);
}

$(document).ready(function() {
    $("#time").focus();

	//Load our alarm sound
    alarmSound.src = 
		Modernizr.audio.ogg 
			? 'assets/sounds/78562__joedeshon__alarm-clock-ringing-01.ogg' :
		Modernizr.audio.mp3 
			? 'assets/sounds/78562__joedeshon__alarm-clock-ringing-01.mp3' :
			  'assets/sounds/78562__joedeshon__alarm-clock-ringing-01.m4a';
	alarmSound.load();

	var getTimers = $(document).getUrlParam("timers");
	//console.log(getTimers);
	

	//When the add-timer button is clicked, parse input and set timer if valid
    $("#add-timer").submit(function (e) {
		e.preventDefault();
		var textInput = $(this).find("input:text"); 
		var rawInput = textInput.val();

		try {
			var time = juration.parse(rawInput); 
		}
		catch (e) {
			setError(textInput, "Sorry, we didn't understand that. Try again?");
			return;
		}

		if (time > 60*60*100 - 1) {
			setError(textInput, "That's a long time! Try a smaller span.");
			return;
		}

		// Remove the error state if there is one, we were successful this time
		if (textInput.parent().hasClass("error")) { 
			textInput.parent().removeClass("error"); 
			textInput.parent().children("small").remove();
		}

		createTimer(time);
	});
});

