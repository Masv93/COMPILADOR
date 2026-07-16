const Errors = {

    lexical: {

        INVALID_CHARACTER: "ERR_LEX_01",

        UNKNOWN_COMMAND: "ERR_LEX_02",

        INVALID_NUMBER: "ERR_LEX_03"

    },



    syntax: {

        MISSING_PARAMETER: "ERR_SYN_01",

        EXTRA_PARAMETER: "ERR_SYN_02",

        INVALID_INSTRUCTION: "ERR_SYN_03"

    },



    semantic: {
        OUT_OF_RANGE_AVANZAR: "ERR_SEM_01",
        OUT_OF_RANGE_RETROCEDER: "ERR_SEM_02",
        OUT_OF_RANGE_GIRAR_IZQUIERDA: "ERR_SEM_03",
        OUT_OF_RANGE_GIRAR_DERECHA: "ERR_SEM_04",
        NEGATIVE_VALUE: "ERR_SEM_05"
    }

};

module.exports = Errors;