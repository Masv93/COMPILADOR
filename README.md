# COMPILADOR PROTOTIPO FASE INCIAL
es un compilador que procesa un lenguaje de dominio específico (DSL) escrito en español, orientado al control básico de un robot simulado o físico en ESP32

Análisis Léxico, Sintáctico y Semántico: El sistema interpreta las instrucciones en el DSL (como comandos de avance, giro, pausas o lectura de datos) y valida que la estructura del código cumpla con las reglas gramaticales del lenguaje diseñado.

Generación de Código: Una vez que el árbol de sintaxis es validado, el compilador traduce estas órdenes lógicas al español hacia lenguajes estructurados de nivel intermedio o bajo, generando instrucciones en JavaScript o directamente en C++.

Integración de Hardware: El código resultante está empaquetado y optimizado para ser compatible con la arquitectura de microcontroladores ESP32 (y entornos basados en Arduino), traduciendo la lógica de software en señales eléctricas concretas.
