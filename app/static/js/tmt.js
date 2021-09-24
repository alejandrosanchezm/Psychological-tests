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
                                            CLASE NODO
            =========================================================================
*/

class Node {

    //=========================================================
    //                   Constructor de nodo
    //=========================================================        
    constructor(x, y, size, text, fig) {

        this._x = x;
        this._y = y;
        this._size = size;
        this._text = text;
        this._fig = fig;
        this._checked = false;
        this._time = 0;

        this.red = [255, 155, 155];
        this.green = [151, 255, 75];
        this.white = [255, 255, 255];
        this.black = [0, 0, 0];
        this.transparency = 127;

        this.lock = false;
    }

    //=========================================================
    //                         Getters
    //=========================================================

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get fig() {
        return this._fig;
    }

    get text() {
        return this._text;
    }

    get size() {
        return this._size;
    }

    get time() {
        return this._time;
    }

    //=========================================================
    //                         Setters
    //=========================================================

    set xVal(val) {
        this._x = val;
    }

    set yVal(val) {
        this._y = val;
    }

    set fig(val) {
        this._fig = val;
    }

    set text(val) {
        this._text = val;
    }

    set size(val) {
        this._size = val;
    }

    set time(val) {
        this._time = val;
    }

    //=========================================================
    //                        Functions
    //=========================================================

    checked(val) {
        this._checked = true;
        this._time = val;
    }

    isChecked() {
        return this._checked;
    }

    draw_circle() {
        // Si el nodo ya ha sido pasado, lo dibujamos verde
        if (this.isChecked()) {

            // Dibujamos el círculo
            fill(this.green[0], this.green[1], this.green[2], 255);
            ellipse(this.x, this.y, this.size, this.size);

            // Dibujamos el texto
            fill(this.black[0], this.black[1], this.black[2], 255);
            text(this.text, this.x - 1, this.y + 1);

        }

        // Si no, lo dibujamos normal
        else {

            if (this.lock == false) {

                // Dibujamos el círculo
                fill(this.white[0], this.white[1], this.white[2], this.transparency);
                ellipse(this.x, this.y, this.size, this.size);

                // Dibujamos el texto
                fill(this.black[0], this.black[1], this.black[2], 255);
                text(this.text, this.x - 1, this.y + 1);
            } else {

                // Dibujamos el círculo
                fill(this.red[0], this.red[1], this.red[2], this.transparency);
                ellipse(this.x, this.y, this.size, this.size);

                // Dibujamos el texto
                fill(this.black[0], this.black[1], this.black[2], 255);
                text(this.text, this.x - 1, this.y + 1);
            }

        }
    }

    draw_rectangle() {

        // Si el nodo ya ha sido pasado, lo dibujamos verde
        if (this.isChecked()) {

            // Dibujamos el círculo
            fill(this.green[0], this.green[1], this.green[2], 255);
            rect(this.x - (this.size) / 2, this.y - (this.size) / 2, this.size * 3, this.size);

            // Dibujamos el texto
            fill(this.black[0], this.black[1], this.black[2], 255);
            text(this.text, this.x + 2 * (this.size) / 3, this.y + 1);

        }

        // Si no, lo dibujamos normal
        else {

            if (this.lock == false) {

                // Dibujamos el círculo
                fill(this.white[0], this.white[1], this.white[2], this.transparency);
                rect(this.x - (this.size) / 2, this.y - (this.size) / 2, this.size * 3, this.size);

                // Dibujamos el texto
                fill(this.black[0], this.black[1], this.black[2], 255);
                text(this.text, this.x + 2 * (this.size) / 3, this.y + 1);

            } else {

                // Dibujamos el círculo
                fill(this.red[0], this.red[1], this.red[2], this.transparency);
                rect(this.x - (this.size) / 2, this.y - (this.size) / 2, this.size * 3, this.size);

                // Dibujamos el texto
                fill(this.black[0], this.black[1], this.black[2], 255);
                text(this.text, this.x + 2 * (this.size) / 3, this.y + 1);
            }

        }

    }

    draw_circle_square() {

        // Si el nodo ya ha sido pasado, lo dibujamos verde
        if (this.isChecked()) {

            // Dibujamos el círculo
            fill(this.green[0], this.green[1], this.green[2], 255);
            rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            fill(this.green[0], this.green[1], this.green[2], 255);
            ellipse(this.x, this.y, this.size, this.size);

            // Dibujamos el texto
            fill(this.black[0], this.black[1], this.black[2], 255);
            text(this.text, this.x - 1, this.y + 1);

        }

        // Si no, lo dibujamos normal
        else {

            if (this.lock == false) {

                // Dibujamos el círculo
                fill(this.white[0], this.white[1], this.white[2], 255);
                rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                fill(this.white[0], this.white[1], this.white[2], 255);
                ellipse(this.x, this.y, this.size, this.size);

                // Dibujamos el texto
                fill(this.black[0], this.black[1], this.black[2], 255);
                text(this.text, this.x - 1, this.y + 1);

            } else {

                // Dibujamos el círculo
                fill(this.red[0], this.red[1], this.red[2], 255);
                rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                fill(this.red[0], this.red[1], this.red[2], 255);
                ellipse(this.x, this.y, this.size, this.size);

                // Dibujamos el texto
                fill(this.black[0], this.black[1], this.black[2], 255);
                text(this.text, this.x - 1, this.y + 1);
            }

        }
    }

    display() {

        switch (this.fig) {
            case 'circle':
                this.draw_circle();
                break;
            case 'rectangle':
                this.draw_rectangle();
                break;
            case 'circle_square':
                this.draw_circle_square();
                break;
        }
    }

    isInNode(x, y) {
        switch (this.fig) {
            case 'circle':
                var d = dist(x, y, this.x, this.y);
                if (d <= this.size / 2) return true;
                else return false;
            case 'rectangle':
                if (x >= (this.x - (this.size / 2)) &&
                    y >= (this.y - (this.size / 2)) &&
                    x <= (this.x + (this.size / 2) * 5) &&
                    y <= (this.y + (this.size / 2))) return true;
                else return false;
            case 'circle_square':
                if (x >= (this.x - (this.size / 2)) &&
                    y >= (this.y - (this.size / 2)) &&
                    x <= (this.x + (this.size / 2)) &&
                    y <= (this.y + (this.size / 2))) return true;
                else return false;
        }

    }

    async error() {
        if (this.lock == false) {
            this.lock = true;
            var audio = new Audio('/static/sounds/error.wav');
            audio.play();
            await this.sleep(1000);
            this.lock = false;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

/*
            =========================================================================
                                            CLASE JUEGO
            =========================================================================
*/
class Game {


    //=========================================================
    //                   Constructor de nodo
    //=========================================================

    constructor(n_nodes, test_type, pos) {

        this._n_nodes = n_nodes;
        this._pos = pos;

        /*
        Comprobamos que el número de posiciones introducidas se corresponde
        con el número de nodos a realizar; si no, lanzamos una excepción
        */
        if (Object.keys(pos).length != n_nodes) {
            throw new Error('Build error: pos length does not match with n_nodes number');
        }

        /*
        Comprobamos el tipo de prueba que se va a realizar. 
        Si no es A ni B mayúsculas, lanzamos una excepción
        */
        if (test_type != 'A' && test_type != 'B' && test_type != 'C' && test_type != 'D' && test_type != 'E') {
            throw new Error('Type error: test_type must be A,B,C,D');
        } else {
            this._test_type = test_type;
        }

        this._size = 35;
        this._nodes = [];
        this._completed = 0;
        this._end = false;
        this._n_errors = 0;
        this._lock = false;

        /*
        Una vez hemos realizado las comprobaciones adecuadas, comenzamos a construir el tablero.
        Para ello, se utilizarán los datos para construir una lista de objetos de la clase Nodo.
        */
        this.buildGame();

    }

    //=========================================================
    //                         Getters
    //=========================================================

    get n_nodes() {
        return this._n_nodes;
    }

    get end() {
        return this._end;
    }

    get pos() {
        return this._pos;
    }

    get test_type() {
        return this._test_type;
    }

    get nodes() {
        return this._nodes;
    }

    get size() {
        return this._size;
    }

    get completed() {
        return this._completed;
    }

    get n_errors() {
        return this._n_errors;
    }

    get lock() {
        return this._lock;
    }

    //=========================================================
    //                         Setters
    //=========================================================

    set completed(val) {
        this._completed = val;
    }

    set end(val) {
        this._end = val;
    }

    set n_errors(val) {
        this._n_errors = val;
    }

    set lock(val) {
        this._lock = val;
    }

    //=========================================================
    //                        Functions
    //=========================================================
    /*
    En caso de que la prueba sea de tipo A, devuelve el valor introducido
    En caso de que sea la prueba B, devuelve valores alternos entre
    número y letra; ejemplo: 1A2B3C4D5E...
    */
    castToCorrectText(i) {

        // Tiene que ser un número mayor de 0
        if (typeof i != 'number' || i <= 0) {
            throw new Error('Value error: i must be a number higher than 0');
        } else {
            switch (this.test_type) {
                case 'A':
                    return i;
                case 'B':
                    if (i % 2 == 0) {
                        var val = Math.floor(i / 2);
                        return String.fromCharCode(96 + val).toUpperCase();
                    } else {
                        return Math.floor(i / 2) + 1;
                    }
                case 'C':
                case 'D':
                    return Math.floor((i - 1) / 2 + 1);
                case 'E':
                    var months = ['Enero', 'Uno', 'Febrero', 'Dos', 'Marzo', 'Tres', 'Abril', 'Cuatro', 'Mayo', 'Cinco', 'Junio', 'Seis', 'Julio', 'Siete', 'Agosto', 'Ocho', 'Septiembre', 'Nueve', 'Octubre', 'Diez', 'Noviembre', 'Once', 'Diciembre', 'Doce']
                    return months[i - 1]

            }
        }
    }

    /*
    Se encarga de construir los nodos a partir de la información del constructor, y los añade a la lista
    'nodes' de la clase 
    */
    buildGame() {

        let i, node;
        for (i = 0; i < this.n_nodes; i++) {
            switch (this.test_type) {
                case 'A':
                case 'B':
                    var fig = 'circle';
                    break;
                case 'C':
                case 'D':
                    if ((i + 1) % 2 != 0) {
                        var fig = 'circle';
                    } else {
                        var fig = 'circle_square';
                    }
                    break;
                case 'E':
                    var fig = 'rectangle';
                    break;
            }
            if (this.test_type == 'E') {
                var text = this.castToCorrectText(i + 1);
                node = new Node(pos[text][0], pos[text][1], this.size, text, fig);
            } else {
                node = new Node(pos[i][0], pos[i][1], this.size, this.castToCorrectText(i + 1), fig);
            }
            this.nodes.push(node);
        }

    }

    /*
    Se encarga de representar los nodos de la lista
    */
    display() {

        for (var i = 1; i < this._n_nodes; i++) {
            if (this.nodes[i].isChecked()) {
                line(this.nodes[i - 1].x, this.nodes[i - 1].y, this.nodes[i].x, this.nodes[i].y);
            }
        }
        this.nodes.forEach(node => { node.display(); });
    }

    checkNode(millis) {
        this.nodes[this.completed].checked(millis);
        this.completed++;
    }

    isGameEnd() {
        if (this.completed == this.n_nodes) return true;
        else return false;
    }

    logic(mouseX, mouseY, millis) {

        var inNode = false;

        // Para cada nodo
        for (var i = 0; i < this.nodes.length; i++) {

            // Si el ratón está dentro de él
            if (this.nodes[i].isInNode(mouseX, mouseY) && this.nodes[i].isChecked() == false) {

                inNode = true;

                // Si el nodo es el correcto, lo marcamos como check;
                if (i == this.completed) {

                    // Cerrojo (Solo contabilizamos que el nodo ha sido tocado una vez)

                    if (this.lock == false) {
                        this.checkNode(millis);
                        this.lock = true;

                        if (this.isGameEnd()) {
                            this.end = true;
                        }
                    }

                }
                // si no, ejecutamos la acción del nodo de error
                else {
                    // Cerrojo (sirve para no contar más de una vez un error aunque el cursor permanezca en el nodo)

                    if (this.lock == false) {
                        this.lock = true;
                        this.nodes[i].error();
                        this.n_errors++;
                        console.log(this.n_errors);
                    }
                }

            }

        };

        // Si no estamos dentro de ningún nodo, desbloqueamos el candado

        if (inNode == false) {
            this.lock = false;
        }

    }

}

/*
            =========================================================================
                                    REGLAS INICIALES DEL SCRIPT
            =========================================================================
*/

//const urlParams = new URLSearchParams(window.location.search);
//let test_type = urlParams.get('test_type');

let test_type = document.getElementById("tmt").getAttribute("test_type");

let game, time, button, results = {};
let w_width, w_height;
let startTime, endTime;
let timer;
let test_number = 1;
let pos, n_nodes;
let sent = false;
const timer_var = 6;
let fixed_fc;
let showed_instructions = false;
var timeout_interval = null;

function closemodal() {

    $('#instructions').modal('hide');
}


function show_instructions() {

    if (!showed_instructions) {
        showed_instructions = true;
        if (document.body.contains(document.getElementById("instructions"))) {
            $('#instructions').modal("show");
            setInterval("closemodal()", 20000);
        }

        document.getElementById("screen_msg").style.display = "none";
    }
}

function show_screen_error_msg() {

    document.getElementById("instructions").style.display = "none";
    document.getElementById("screen_msg").style.display = "block";

}

function check_if_correct_screen_size() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    if (vw >= 1270 && vh >= 720) return true;
    else return false;
}

/*
            =========================================================================
                           PRELOAD (SE CARGA ANTES DE INICIAR EL JUEGO)
            =========================================================================
*/

function preload() {

    if (check_if_correct_screen_size()) {

        // Mostramos las instrucciones

        show_instructions();

        // Recogemos las variables para la creación del juego del archivo de configuración

        pos = config[test_type][test_number]['pos'];
        n_nodes = config[test_type][test_number]['n_nodes'];
        timer = timer_var;

        // Cargamos la clase d¡el juego

        game = new Game(n_nodes, test_type, pos);
        start_node = new Node(config[test_type][test_number]['start_node'][0], config[test_type][test_number]['start_node'][1], game.size, "", 'circle');
        is_in_pos = false;

        console.log(test_number);

        // Comprobamos las medidas de la pantalla

    } else {

        show_screen_error_msg();

    }


}

/*
            =========================================================================
                            SETUP (SE CARGA AL INICIO DEL JUEGO)
            =========================================================================
*/
function setup() {

    var cnv;

    // Si el tamaño de la pantalla es mayor o igual al requerido, creamos el canvas del tamaño de 17 pulgadas
    if (check_if_correct_screen_size()) {

        cnv = createCanvas(1280, 720);
        cnv.style('display', 'block');
        // Lo centramos al medio de la pantalla

        var x = (windowWidth - width) / 2;
        var y = (windowHeight - height) / 2;
        cnv.position(x, y);

        // Establecemos la fuente

        textFont('Roboto');
        textStyle(NORMAL);

    } else {
        document.getElementById("defaultCanvas0").style.display = "none";
    }



}

/*
    WRITETIMER: dibuja el temporizador en la esquina inferior de la pantalla
*/
function writeTimer() {

    // Mientras el juego no haya terminado, actualiza la variable del contador

    if (game.isGameEnd() == false) {
        time = Math.round(millis() - startTime);
    }

    // Escribe el contador en el canvas

    fill(0, 0, 0, 255);
    text('Milisegundos: ' + time, 85, 680);

}

/*
    COUNTDOWN: dibuja la cuenta atrás
*/
function countDown() {

    textAlign(CENTER, CENTER);
    fill(0, 0, 0, 255);
    textSize(100);
    text(timer, 1280 / 2, 720 / 2);

    if ((frameCount - fixed_fc) % 60 == 0 && timer > 0) {
        // Decrementa el contador de la cuenta atrás
        timer--;

        // Si el contador llega a cero, guardamos los milisegundos de inicio
        if (timer == 0) startTime = millis();
    }
}

/*
    SLEEP: realiza la función de un sleep normal
*/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function sendDataToBE() {
    if (sent == false) {

        sent = true;
        var node_time = []
        game.nodes.forEach(node => { node_time.push(node.time) })

        results = {
            'endTime': endTime,
            'n_errors': game.n_errors,
            'times': node_time,
            'type': test_type
        };

        // Si hemos terminado las partidas, enviamos los resultados
        if (test_number == config[test_type]['n_test']) {
            $.ajax({
                type: 'POST',
                url: "/store_data",
                data: { "results": JSON.stringify(results) },
                dataType: 'application/json',
                async: true,
                success: redirect_to_dashboard()
            });
        }
    }

}

function redirect_to_dashboard() {
    window.location.replace("/dashboard");
}

/*
    PROGRAMLOGIC: contiene la lógica del programa cuando se va a dibujar
*/
async function programLogic() {

    // Si el cursor está en el nodo de inicio, lo marca a verdadero
    if (start_node.isInNode(mouseX, mouseY) && timer == timer_var) {
        await this.sleep(0.08);
        is_in_pos = true;
    }

    // Si no, representa el nodo de inicio
    else if (start_node.isInNode(mouseX, mouseY) == false && timer == timer_var && is_in_pos == false) {
        textSize(22);
        textAlign(CENTER);
        var txt = text('Situe el cursor en el círculo para comenzar.', width / 2, height - 20);
        start_node.display();
    }

    // Si ya se ha situado en el inicio
    if (is_in_pos && timer > 0) {

        // Realiza la cuenta atrás
        if (timer == timer_var) {
            fixed_fc = frameCount;
        }
        countDown();

    }

    /* 
    Cuando ya no esté en el nodo de inicio, solo será válido
    Si ya se ha situado previamente
    */
    else {
        // Cuando ya ha terminado la cuenta atrás
        if (timer <= 0) {
            // Ejecutamos la lógica del juego
            // y luego mostramos los elementos 
            textSize(14);

            game.logic(mouseX, mouseY, time);
            game.display();

            writeTimer();

            if (game.isGameEnd() && test_number <= config[test_type]['n_test']) {

                endTime = millis() - startTime;

                if (test_number == config[test_type]['n_test']) {
                    // registerResults();
                    sendDataToBE();

                } else {

                    test_number++;
                    preload();
                    setup();
                   // set_timeout();
                }


            }
        }

    }
}

function set_timeout() {

    if (timeout_interval != null) clearInterval(timeout_interval);
    var timeout_interval = setInterval(show_end_timeout(), 60 * 2 * 1000);
}

function show_end_timeout() {

    $("#timeout").modal("show");
    setInterval(redirect_to_dashboard(), 5000);
}

/*
            =========================================================================
                                DRAW (SE EJECUTA POR CADA FRAME)
            =========================================================================
*/
function draw() {

    if (check_if_correct_screen_size()) {
        // Pintamos el fondo

        background(247);

        // En caso de que la resolución sea la adecuada
        programLogic();

    }


}