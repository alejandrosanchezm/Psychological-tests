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

var valid_name = false;
var valid_dni = false;

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

    if (name != "" && surname != "" && dni != "" && validateDNI(dni)) {
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
    } else if (validateDNI(dni) == false) {
        if (document.getElementById("valid-msg").childNodes.length == 0) {
            var newtext = document.createTextNode("Introduce un DNI válido.");
            valid_data = false;
            document.getElementById("rst-btn").disabled = true;
            document.getElementById("valid-msg").appendChild(newtext)
        }
    }


};


$("#form").on("change", function() {
    if (valid_data && document.getElementById("ocupation").value != 0) {
        document.getElementById("rst-btn").disabled = false;
    } else {
        document.getElementById("rst-btn").disabled = true;
    }
});

function validateDNI(dni) {
    var numero,
        let, letra;
    var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    dni = dni.toUpperCase();

    if (expresion_regular_dni.test(dni) === true) {
        numero = dni.substr(0, dni.length - 1);
        numero = numero.replace('X', 0);
        numero = numero.replace('Y', 1);
        numero = numero.replace('Z', 2);
        let = dni.substr(dni.length - 1, 1);
        numero = numero % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(numero, numero + 1);
        if (letra !=
            let) {
            //alert('Dni erroneo, la letra del NIF no se corresponde');
            return false;
        } else {
            //alert('Dni correcto');
            return true;
        }
    } else {
        //alert('Dni erroneo, formato no válido');
        return false;
    }
}