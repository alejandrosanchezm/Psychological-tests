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


var valid_data = false;


var timer = null;

$("#name").keydown(function() {
    clearTimeout(timer);
    timer = setTimeout(donetyping, 1000)
});


$("#surname").keydown(function() {
    clearTimeout(timer);
    timer = setTimeout(donetyping, 1000)
});


$("#dni").keydown(function() {
    clearTimeout(timer);
    timer = setTimeout(donetyping, 1000)
});


function donetyping() {

    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var dni = document.getElementById("dni").value;

    if (name != "" && surname != "" && dni != "") {
        $.ajax("/check_if_valid_data", {
            type: "POST",
            data: {
                'name': name,
                'surname': surname,
                'dni': dni
            },
            success: function(resp) {
                if (resp == "valid") {
                    valid_data = true;
                    document.getElementById("rst-btn").disabled = false;
                    if (document.getElementById("valid-msg").childNodes.length > 0) {
                        document.getElementById("valid-msg").innerText = "";
                    }
                } else {
                    if (document.getElementById("valid-msg").childNodes.length == 0) {
                        var newtext = document.createTextNode("Esta persona ya se ha registrado. Por favor, introduzca otros datos.");
                        valid_data = false;
                        document.getElementById("rst-btn").disabled = true;
                        document.getElementById("valid-msg").appendChild(newtext)
                    }
                }
            }
        });
    }
};


$("#form").on("change", function() {
    if (valid_data && document.getElementById("ocupation").value != 0) {
        document.getElementById("rst-btn").disabled = false;
    } else {
        document.getElementById("rst-btn").disabled = true;
    }
});

function validate() {
    var f1 = document.getElementById("name");
    var f2 = document.getElementById("surname");
    var f3 = document.getElementById("education");
    var f4 = document.getElementById("dni");
    var f5 = document.getElementById("place");
    var ferror = [f1, f2, f3, f4, f5];
    var i;
    for (i = 0; i < ferror.length; i++) {
        if (ferror[i].value.length < 1) {
            ferror[i].style.backgroundColor = "red";
        }
    }
}