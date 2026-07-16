const Errors = require('./errors');

class SemanticAnalyzer {
    constructor(ast) {
        this.ast = ast;
        this.errors = [];
        this.robotMoves = [];
    }

    analyze() {
        if (this.ast && this.ast.body) {
            for (const node of this.ast.body) {
                this.visit(node);
            }
        }
        return {
            robotMoves: this.robotMoves,
            errors: this.errors
        };
    }

    visit(node) {
        if (!node) return;
        switch (node.type) {
            case 'MoveCommand':
                this.visitMoveCommand(node);
                break;
            default:
                // No debería ocurrir con el parser actual
                break;
        }
    }

    visitMoveCommand(node) {
        const { command, value, line, column } = node;
        let isValid = true;

        if (value < 0) {
            this.addError(Errors.semantic.NEGATIVE_VALUE, `El valor para ${command} no puede ser negativo.`, line, column);
            isValid = false;
        }

        switch (command) {
            case 'AVANZAR':
                if (value > 400) {
                    this.addError(Errors.semantic.OUT_OF_RANGE_AVANZAR, `${command} admite valores entre 0 y 400. Se recibió ${value}.`, line, column);
                    isValid = false;
                }
                break;
            case 'RETROCEDER':
                if (value > 400) {
                    this.addError(Errors.semantic.OUT_OF_RANGE_RETROCEDER, `${command} admite valores entre 0 y 400. Se recibió ${value}.`, line, column);
                    isValid = false;
                }
                break;
            case 'GIRAR_DERECHA':
            case 'GIRAR_IZQUIERDA':
                if (value > 360) {
                    const errorCode = command === 'GIRAR_DERECHA' ? Errors.semantic.OUT_OF_RANGE_GIRAR_DERECHA : Errors.semantic.OUT_OF_RANGE_GIRAR_IZQUIERDA;
                    this.addError(errorCode, `${command} admite valores entre 0 y 360. Se recibió ${value}.`, line, column);
                    isValid = false;
                }
                break;
        }

        if (isValid) {
            this.robotMoves.push({ action: command, value: value });
        }
    }

    addError(code, message, line, column) {
        this.errors.push({ code, message, line, column, type: 'ERROR_SEMANTICO' });
    }
}

function analyze(ast) {
    const analyzer = new SemanticAnalyzer(ast);
    return analyzer.analyze();
}

module.exports = { analyze };