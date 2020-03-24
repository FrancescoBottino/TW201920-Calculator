function calculatorState(calcolatrice) {
    this.calcolatrice = calcolatrice;

    this.pressione_tasto = function (tipo, codice, valore) {
        throw new Error("Cannot call abstract method");
    };
}

function Vuoto(calcolatrice) {
    calculatorState.call(this, calcolatrice);

    this.pressione_tasto = function (tipo, codice, valore) {
        if( tipo === 'n' ) {
            this.calcolatrice.cambiaStato(new Iniziale(this.calcolatrice));
            return false;
        } else if (tipo === 'o') {
            this.calcolatrice.num2 = "0";
            this.calcolatrice.cambiaStato(new Operatore(this.calcolatrice));
            return false;
        } else if (tipo === 's') {
            switch(codice) {
                case "point":
                    this.calcolatrice.num1 = "0.";
                    this.calcolatrice.cambiaStato(new Iniziale(this.calcolatrice));
                    return true;
                default:
                    return true;
            }
        } else if (tipo === 'x') {
            return true;
        }
    };
}

function Iniziale(calcolatrice) {
    calculatorState.call(this, calcolatrice);

    this.pressione_tasto = function (tipo, codice, valore) {
        if( tipo === 'n' ) {
            if(this.calcolatrice.num1 !== "0")
                this.calcolatrice.num1 += codice;
            else
                this.calcolatrice.num1 = codice;
            return true;
        } else if (tipo === 'o') {
            this.calcolatrice.num2 = this.calcolatrice.num1;
            this.calcolatrice.num1 = "";
            this.calcolatrice.cambiaStato(new Operatore(this.calcolatrice));
            return false;
        } else if (tipo === 's') {
            switch(codice) {
                case "clear":
                    this.calcolatrice.clear();
                    return true;
                case "sign":
                    this.calcolatrice.num1 = (parseFloat(this.calcolatrice.num1) * (-1)).toString();
                    return true;
                case "point":
                    if( !this.calcolatrice.num1.includes('.') ) {
                        this.calcolatrice.num1+='.';
                    }
                    return true;
                default:
                    return true;
            }
        } else if (tipo === 'x') {
            this.calcolatrice.num2 = this.calcolatrice.num1;
            this.calcolatrice.num1 = "";
            this.calcolatrice.op = "";
            this.calcolatrice.cambiaStato(new Finale(this.calcolatrice));
            return true;
        }
    };
}

function Operatore(calcolatrice) {
    calculatorState.call(this, calcolatrice);

    this.pressione_tasto = function (tipo, codice, valore) {
        if( tipo === 'n' ) {
            this.calcolatrice.cambiaStato(new Secondario(this.calcolatrice));
            return false;
        } else if (tipo === 'o') {
            this.calcolatrice.op = valore;
            return true;
        } else if (tipo === 's') {
            switch(codice) {
                case "clear":
                    this.calcolatrice.clear();
                    return true;
                case "point":
                    this.calcolatrice.num1 = "0.";
                    this.calcolatrice.cambiaStato(new Secondario(this.calcolatrice));
                    return true;
                default:
                    return true;
            }
        } else if (tipo === 'x') {
            this.calcolatrice.num1 = "0";
            this.calcolatrice.cambiaStato(new Finale(this.calcolatrice));
            return false;
        }
    };
}

function Secondario(calcolatrice) {
    calculatorState.call(this, calcolatrice);

    this.pressione_tasto = function (tipo, codice, valore) {
        if( tipo === 'n' ) {
            if(this.calcolatrice.num1 !== "0")
                this.calcolatrice.num1 += codice;
            else
                this.calcolatrice.num1 = codice;
            return true;
        } else if (tipo === 'o') {
            this.calcolatrice.cambiaStato(new Finale(this.calcolatrice));
            return false;
        } else if (tipo === 's') {
            switch(codice) {
                case "clear":
                    this.calcolatrice.clear();
                    return true;
                case "sign":
                    this.calcolatrice.num1 = (parseFloat(this.calcolatrice.num1) * (-1)).toString();
                    return true;
                case "point":
                    if( !this.calcolatrice.num1.includes('.') ) {
                        this.calcolatrice.num1+='.';
                    }
                    return true;
                case "percent":
                    this.calcolatrice.num1 = this.calcolatrice.percent(parseFloat(this.calcolatrice.num2),parseFloat(this.calcolatrice.num1)).toString();
                    return true;
                default:
                    return true;
            }
        } else if (tipo === 'x') {
            this.calcolatrice.cambiaStato(new Finale(this.calcolatrice));
            return false;
        }
    };
}

function Finale(calcolatrice) {
    calculatorState.call(this, calcolatrice);

    this.pressione_tasto = function (tipo, codice, valore) {
        if( tipo === 'n' ) {
            this.calcolatrice.clear();
            this.calcolatrice.cambiaStato(new Vuoto(this.calcolatrice));
            return true;
        } else if (tipo === 'o') {
            this.calcolatrice.num1 = "";
            this.calcolatrice.cambiaStato(new Operatore(this.calcolatrice));
            return false;
        } else if (tipo === 's') {
            switch(codice) {
                case "clear":
                    this.calcolatrice.clear();
                    return true;
                case "sign":
                    this.calcolatrice.num1 = this.calcolatrice.num2;
                    this.calcolatrice.num2 = "";
                    this.calcolatrice.op = "";
                    this.calcolatrice.cambiaStato(new Iniziale(this.calcolatrice));
                    return false;
                case "point":
                    if( !this.calcolatrice.num1.contains('.') ) {
                        this.calcolatrice.num1 = this.calcolatrice.num2;
                        this.calcolatrice.num2 = "";
                        this.calcolatrice.op = "";
                        this.calcolatrice.cambiaStato(new Iniziale(this.calcolatrice));
                        return false;
                    }
                    return true;
                default:
                    return true;
            }
        } else if (tipo === 'x') {
            this.calcolatrice.num2 = this.calcolatrice.calcola(parseFloat(this.calcolatrice.num2), this.calcolatrice.op, parseFloat(this.calcolatrice.num1)).toString();
            return true;
        }
    };
}

function Calcolatrice(top_display_id, op_display_id, bot_display_id) {
    this.num1 = "";
    this.num2 = "";
    this.op = "";

    this.top_display_id = top_display_id;
    this.op_display_id = op_display_id;
    this.bot_display_id = bot_display_id;

    this.display_top = document.getElementById(this.top_display_id);
    this.display_op = document.getElementById(this.op_display_id);
    this.display_bot = document.getElementById(this.bot_display_id);

    this.cambiaStato = function (stato) {
        this.stato = stato;
    };
    this.pressione_tasto = function (tasto) {
        let id = tasto.id.split('_');
        let tipo = id[0];
        let codice = id[1];
        let valore = tasto.textContent;

        let consumedEvent;
        do {
            consumedEvent = this.stato.pressione_tasto(tipo, codice, valore);
        } while(!consumedEvent);

        this.aggiorna_display();
    };
    this.clear = function () {
        this.num1 = "";
        this.num2 = "";
        this.op = "";
        this.cambiaStato(new Vuoto(this));
    };
    this.percent = function (num, percent) {
        return num * percent / 100;
    };
    this.aggiorna_display = function () {
        this.display_top.textContent = this.num2;
        this.display_bot.textContent = this.num1;
        this.display_op.textContent = this.op;
    };
    this.calcola = function ( x, op, y ) {
        switch(op) {
            case "+":
                return x+y;
            case "-":
                return x-y;
            case "÷":
                return x/y;
            case "×":
                return x*y;
        }
    };

    this.cambiaStato(new Vuoto(this));
}