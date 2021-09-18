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


var route;

function redirect_to_test(completed, test_type) {
    if (completed == 'False') {
        window.location = '/tests/' + test_type.replace(/\s/g, '');
    }
}

function redirect() {
    window.location = route;
}

function start(test_type) {
    route = String(document.currentScript + '/game/' + test_type).replace("null/", "");
    var menu = document.getElementById("menu");
    menu.classList.add("fade-out");
    setTimeout(redirect, 1000);
}

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})