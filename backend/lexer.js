const TokenTypes = require('./tokenTypes');
const Errors = require('./errors');

const KEYWORDS = {
    "AVANZAR": TokenTypes.COMMAND,
    "RETROCEDER": TokenTypes.COMMAND,
    "GIRAR_DERECHA": TokenTypes.COMMAND,
    "GIRAR_IZQUIERDA": TokenTypes.COMMAND,
};

class Lexer {
    constructor(sourceCode) {
        this.source = sourceCode;
        this.tokens = [];
        this.errors = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.startOfLine = 0;
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push({
            type: TokenTypes.EOF,
            lexeme: "",
            value: null,
            line: this.line,
            column: this.current - this.startOfLine + 1
        });
        return { tokens: this.tokens, errors: this.errors };
    }

    isAtEnd() {
        return this.current >= this.source.length;
    }

    scanToken() {
        const char = this.advance();
        switch (char) {
            case ' ':
            case '\r':
            case '\t':
                // Ignorar espacios en blanco
                break;
            case '\n':
                this.line++;
                this.startOfLine = this.current;
                break;
            case '#':
                // Un comentario va hasta el final de la línea.
                while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
                break;
            case '-':
                if (this.isDigit(this.peek())) {
                    this.number();
                } else {
                    this.addError(Errors.lexical.INVALID_CHARACTER, `Carácter inesperado: ${char}`);
                }
                break;
            default:
                if (this.isDigit(char)) {
                    this.number();
                } else if (this.isAlpha(char)) {
                    this.identifier();
                } else {
                    this.addError(Errors.lexical.INVALID_CHARACTER, `Carácter inesperado: ${char}`);
                }
                break;
        }
    }

    advance() {
        this.current++;
        return this.source.charAt(this.current - 1);
    }

    peek() {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }

    addToken(type, value = null) {
        const lexeme = this.source.substring(this.start, this.current);
        this.tokens.push({
            type,
            lexeme,
            value,
            line: this.line,
            column: this.start - this.startOfLine + 1
        });
    }

    addError(code, message) {
        this.errors.push({
            code,
            message,
            line: this.line,
            column: this.start - this.startOfLine + 1
        });
    }

    number() {
        while (this.isDigit(this.peek())) this.advance();

        if (this.isAlpha(this.peek())) {
            while (this.isAlphaNumeric(this.peek())) this.advance();
            const badLexeme = this.source.substring(this.start, this.current);
            this.addError(Errors.lexical.INVALID_NUMBER, `Número mal formado: ${badLexeme}`);
            return;
        }

        const lexeme = this.source.substring(this.start, this.current);
        this.addToken(TokenTypes.NUMBER, parseFloat(lexeme));
    }

    identifier() {
        // Se simplifica el identificador. Ahora solo lee una palabra (que puede incluir '_')
        // y la busca en las palabras reservadas. Se elimina la lógica compleja de lookahead
        // para evitar ambigüedades.
        while (this.isAlpha(this.peek())) {
            this.advance();
        }

        const text = this.source.substring(this.start, this.current);
        const upperText = text.toUpperCase();
        const type = KEYWORDS[upperText];

        if (type) {
            this.addToken(type, upperText); // El valor es el propio comando
        } else {
            this.addError(Errors.lexical.UNKNOWN_COMMAND, `Comando desconocido: ${text}`);
        }
    }

    isDigit(char) {
        return char >= '0' && char <= '9';
    }

    isAlpha(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
    }

    isAlphaNumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }
}

function analisislexico(sourceCode) {
    const lexer = new Lexer(sourceCode);
    return lexer.scanTokens();
}

module.exports = { analisislexico };