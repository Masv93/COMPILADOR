const TokenTypes = require('./tokenTypes');
const Errors = require('./errors');

class ParseError extends Error {
    constructor(error) {
        super(error.message);
        this.error = error;
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens.filter(t => t.type !== TokenTypes.COMMENT); // Ignorar comentarios
        this.current = 0;
        this.errors = [];
    }

    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            const stmt = this.statement();
            if (stmt) {
                statements.push(stmt);
            }
        }
        return {
            ast: { type: 'Program', body: statements },
            errors: this.errors
        };
    }

    statement() {
        try {
            if (this.match(TokenTypes.COMMAND)) {
                return this.commandStatement();
            }
            // Si encontramos un token que no inicia una declaración, es un error.
            if (!this.isAtEnd()) {
                this.error(this.peek(), "Se esperaba un comando.");
                this.synchronize();
            }
            return null;
        } catch (e) {
            if (e instanceof ParseError) {
                this.errors.push(e.error);
                this.synchronize();
                return null;
            }
            throw e;
        }
    }

    commandStatement() {
        const commandToken = this.previous();
        const valueToken = this.consume(TokenTypes.NUMBER, `Se esperaba un valor numérico después de ${commandToken.lexeme}.`);

        return {
            type: 'MoveCommand',
            command: commandToken.value, // 'AVANZAR', 'RETROCEDER', etc.
            value: valueToken.value,
            line: commandToken.line,
            column: commandToken.column
        };
    }

    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    consume(type, message) {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message);
    }

    check(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    isAtEnd() {
        return this.peek().type === TokenTypes.EOF;
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    error(token, message) {
        return new ParseError({
            code: Errors.syntax.INVALID_INSTRUCTION,
            message,
            line: token.line,
            column: token.column
        });
    }

    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            // Una estrategia simple de sincronización: buscar el próximo comando.
            if (this.peek().type === TokenTypes.COMMAND) return;
            this.advance();
        }
    }
}

function parse(tokens) {
    const parser = new Parser(tokens);
    return parser.parse();
}

module.exports = parse;