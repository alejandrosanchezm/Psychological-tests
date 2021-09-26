/*
=========================================================================


            ░█████╗░██╗░░░░░███████╗██╗░░██╗  ░██████╗███╗░░░███╗
            ██╔══██╗██║░░░░░██╔════╝╚██╗██╔╝  ██╔════╝████╗░████║
            ███████║██║░░░░░█████╗░░░╚███╔╝░  ╚█████╗░██╔████╔██║
            ██╔══██║██║░░░░░██╔══╝░░░██╔██╗░  ░╚═══██╗██║╚██╔╝██║
            ██║░░██║███████╗███████╗██╔╝╚██╗  ██████╔╝██║░╚═╝░██║
            ╚═╝░░╚═╝╚══════╝╚══════╝╚═╝░░╚═╝  ╚═════╝░╚═╝░░░░░╚═╝

=========================================================================
*/

/*
            =========================================================================
                                            CLASE CANCELACIÓN
            =========================================================================
*/


let logic;
let already_closed = false;
let n_training;
let n_test;
let target_number;

let minutes = 0;
let seconds = 0;

let data = {
    'desclickados': {},
    'errores': {},
    'correct_clicked': [],
    'error_clicked': [],
    'final_data': 0
};

let results = {};
let sent = false;
let level = "none";

function toggleCheckbox(x) {

    if (level == "training") {
        training_logic(x);
    } else {
        test_logic(x);
    }
}

function check_if_correct_screen_size() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    if (vw >= 1270 && vh >= 720) return true;
    else return false;
}

window.onload = function() {


    if (check_if_correct_screen_size()) {

        target_number = document.getElementById("cancellation").getAttribute("target_number");
        n_training = document.getElementById("cancellation").getAttribute("n_training");
        n_test = document.getElementById("cancellation").getAttribute("n_test");

        show_instructions();

    } else {

        show_screen_error_msg();

    }

};

function show_screen_error_msg() {

    document.getElementById("screen_msg").style.display = "block";
    document.getElementById("bag").style.display = "none";
    document.getElementById("training").style.display = "none";
    document.getElementById("test").style.display = "none";

}

function show_instructions() {

    if (document.getElementById("instructions") != null) {

        setTimeout("closemodal()", 20000);

        $('#instructions').modal('show');

        document.getElementById("screen_msg").style.display = "none";
        document.getElementById("training").style.display = "none";
        document.getElementById("test").style.display = "none";


    } else {

        start_training();
    }

}

function closemodal() {

    if (already_closed == false) {
        already_closed = true;
        $('#instructions').modal('hide');
        start_training();
    }
}

function arrayRemove(arr, value) {

    return arr.filter(function(ele) {
        return ele != value;
    });
}

function training_logic(x) {

    if (x.value == target_number && x.id != "_") {

        if (data['correct_clicked'].includes(x.id)) {

            data['correct_clicked'] = arrayRemove(data['correct_clicked'], x.id)
            n_training++;

        } else {
            data['correct_clicked'].push(x.id);
            n_training--;
            if (n_training == 0 && data['error_clicked'].length == 0) {
                data['correct_clicked'] = [];
                start_test();
            }
        }

    } else if (x.value != target_number) {
        if (data['error_clicked'].includes(x.id)) {
            data['error_clicked'] = arrayRemove(data['error_clicked'], x.id);
            if (n_training == 0 && data['error_clicked'].length == 0) {
                data['correct_clicked'] = [];
                start_test();
            }
        } else {
            data['error_clicked'].push(x.id);
        }
    }

}

function test_logic(x) {

    if (x.value == target_number && x.id != "_") {
        if (data['correct_clicked'].includes(x.id)) {
            data['correct_clicked'] = arrayRemove(data['correct_clicked'], x.id)
            n_test++;
            if (x.id in data['desclickados']) {
                data['desclickados'][x.id]++;
            } else {
                data['desclickados'][x.id] = 1;
            }
        } else {
            data['correct_clicked'].push(x.id);
            n_test--;
            if (n_test == 0 && data['error_clicked'].length == 0) {
                sendDataToBE();
            }
        }
    } else if (x.value != target_number) {

        if (data['error_clicked'].includes(x.id)) {
            data['error_clicked'] = arrayRemove(data['error_clicked'], x.id);
            data['final_errors']--;
            if (n_test == 0 && data['error_clicked'].length == 0) {
                data['correct_clicked'] = [];
                start_test();
            }
        } else {
            data['error_clicked'].push(x.id);
            data['final_errors']++;
            if (x.id in data['errores']) {
                data['errores'][x.id]++;
            } else {
                data['errores'][x.id] = 1;
            }
        }
    }
}

function start_test() {

    level = "test";

    initial_counter();

    document.getElementById("screen_msg").style.display = "none";
    document.getElementById("training").style.display = "none";
    document.getElementById("test").style.display = "block";
}

function start_training() {

    level = "training";

    initial_counter();

    document.getElementById("screen_msg").style.display = "none";
    document.getElementById("training").style.display = "block";
    document.getElementById("test").style.display = "none";

}

function initial_counter() {

    document.getElementById("countdown").style.display = "block";
    var counter = document.getElementById("countdown_text");
    var timer = 5;

    // Update the count down every 1 second
    y = setInterval(function() {
        counter.innerHTML = timer;
        timer--;
        if (timer < 0) {
            clearInterval(y);
            counter.innerHTML = 5;
            document.getElementById("countdown").style.display = "none";
            if (level == "test") {
                countdown();
            }
        }
    }, 1000);

}

function countdown() {

    countDownDate = new Date(new Date().getTime() + 3.03 * 60000).getTime();

    // Update the count down every 1 second
    x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text
        if (distance <= 0) {
            clearInterval(x);
            sendDataToBE();
        }
    }, 1000);

}

function sendDataToBE() {

    if (sent == false) {

        sent = true;

        if ((minutes * 60 + seconds) <= 0) {
            time = 0;
        } else {
            time = minutes * 60 + seconds;
        }

        results = {
            'endTime': time,
            'data': data,
            'type': "F",
            'n_test': n_test,
        };

        $.ajax({
            type: 'POST',
            url: "/store_data",
            data: { "results": JSON.stringify(results) },
            dataType: 'application/json',
            async: false,
            success: window.location.href = "/dashboard"
        });
    }
}