export const es: Record<string, string | ((...args: any[]) => string)> = {
    // String
    required: 'Campo obligatorio.',
    minLength: (n: number) => `El campo debe tener al menos ${n} caracteres.`,
    maxLength: (n: number) => `El campo no puede tener más de ${n} caracteres.`,
    exactLength: (n: number) => `El campo debe tener exactamente ${n} caracteres.`,
    email: 'El formato de correo electrónico no es válido.',
    url: 'El formato de URL no es válido.',
    alpha: 'Solo se permiten letras.',
    alphaNumeric: 'Solo se permiten letras y números.',
    lowerCase: 'Solo se permiten letras minúsculas.',
    upperCase: 'Solo se permiten letras mayúsculas.',
    noWhitespace: 'El campo no debe contener espacios.',
    contains: (v: string) => `El campo debe contener "${v}".`,
    startsWith: (v: string) => `El campo debe comenzar con "${v}".`,
    endsWith: (v: string) => `El campo debe terminar con "${v}".`,
    slug: 'Solo se permiten letras minúsculas, números y guiones.',
    passwordStrength: 'La contraseña debe incluir mayúsculas, minúsculas, un número y un carácter especial.',
    hexColor: 'Formato de color hexadecimal no válido.',
    ipv4: 'Dirección IPv4 no válida.',
    uuid: 'Formato UUID no válido.',
    json: 'Formato JSON no válido.',
    phone: 'Formato de número de teléfono no válido.',
    creditCard: 'Número de tarjeta de crédito no válido.',
    pattern: 'No cumple con el patrón requerido.',
    // Numeric
    digitsOnly: 'El campo solo puede contener dígitos.',
    numberRange: (min: number, max: number) => `El valor debe estar entre ${min} y ${max}.`,
    numberPositive: 'Solo se permiten números positivos.',
    numberNegative: 'Solo se permiten números negativos.',
    integer: 'El campo debe ser un número entero.',
    multipleOf: (n: number) => `El valor debe ser múltiplo de ${n}.`,
    // Date
    dateFormat: (format: string) => `El formato de fecha no es válido. El formato esperado es (${format}).`,
    minDate: (v: string | Date) => `La fecha debe ser el ${v} o posterior.`,
    maxDate: (v: string | Date) => `La fecha debe ser el ${v} o anterior.`,
    futureDate: 'La fecha debe ser en el futuro.',
    pastDate: 'La fecha debe ser en el pasado.',
    // File
    fileType: 'Tipo de archivo no permitido.',
    fileSize: 'El tamaño del archivo supera el límite permitido.',
    fileDimensions: (w: number, h: number) => `Las dimensiones del archivo deben ser ${w}x${h}.`,
    imageAspectRatio: (w: number, h: number) => `La relación de aspecto de la imagen debe ser ${w}:${h}.`,
    imageMinDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`ancho >= ${w}px`);
        if (h !== undefined) parts.push(`alto >= ${h}px`);
        return `Las dimensiones de la imagen deben ser al menos ${parts.join(' y ')}.`;
    },
    imageMaxDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`ancho <= ${w}px`);
        if (h !== undefined) parts.push(`alto <= ${h}px`);
        return `Las dimensiones de la imagen no deben superar ${parts.join(' y ')}.`;
    },
    // Cross-field
    matchField: 'Los campos no coinciden.',
    requiredIf: 'Este campo es obligatorio.',
    // Async
    asyncPattern: 'La validación falló.',
    // --- Nuevos v2.1 ---
    // Numeric
    greaterThan: (n: number) => `El valor debe ser mayor que ${n}.`,
    lessThan: (n: number) => `El valor debe ser menor que ${n}.`,
    precision: (n: number) => `El valor no puede tener más de ${n} decimales.`,
    // Date
    dateAfter: (v: string | Date) => `La fecha debe ser posterior a ${v}.`,
    dateBefore: (v: string | Date) => `La fecha debe ser anterior a ${v}.`,
    // Enum / set
    oneOf: (values: any[]) => `El valor debe ser uno de: ${values.join(', ')}.`,
    // Cross-field
    notMatchField: 'Los campos no deben coincidir.',
    requiredUnless: 'Este campo es obligatorio.',
    // Array
    arrayMinLength: (n: number) => `El array debe tener al menos ${n} elementos.`,
    arrayMaxLength: (n: number) => `El array no puede tener más de ${n} elementos.`,
    arrayUnique: 'El array no debe contener valores duplicados.',
    arrayContains: (v: any) => `El array debe contener "${v}".`,
    // Format
    time: 'Formato de hora no válido.',
    noHTML: 'No se permiten etiquetas HTML.',
    // Finance / geo / other
    iban: 'IBAN no válido.',
    postalCode: 'Código postal no válido.',
    latitude: 'El valor debe ser una latitud válida (-90 a 90).',
    longitude: 'El valor debe ser una longitud válida (-180 a 180).',
    semVer: 'Versión semántica no válida (se esperaba X.Y.Z).',
    base64: 'Cadena Base64 no válida.',
    // v3 — nuevos validadores
    notOneOf: (values: any[]) => `El valor no debe ser ninguno de: ${values.join(', ')}.`,
    ipv6: 'Dirección IPv6 no válida.',
    macAddress: 'Formato de dirección MAC no válido.',
    dataURI: 'Formato Data URI no válido.',
    mimeType: 'Tipo de archivo no permitido.',
    dateRange: 'La fecha de inicio debe ser anterior o igual a la fecha de fin.',
    arrayItems: 'Uno o más elementos del array no son válidos.',
    // v4 — nuevos validadores
    alphaDash: 'Solo se permiten letras, números, guiones bajos y guiones.',
    notEmpty: 'El campo no puede estar en blanco ni contener solo espacios.',
    jwt: 'Formato JWT no válido.',
    finite: 'El valor debe ser un número finito.',
    port: 'El valor debe ser un número de puerto válido (0–65535).',
    greaterThanOrEqual: (n: number) => `El valor debe ser ≥ ${n}.`,
    lessThanOrEqual: (n: number) => `El valor debe ser ≤ ${n}.`,
    dateAfterField: (f: string) => `La fecha debe ser posterior a "${f}".`,
    dateBeforeField: (f: string) => `La fecha debe ser anterior a "${f}".`,
    arrayExactLength: (n: number) => `El array debe tener exactamente ${n} elementos.`,
    // Reglas sintéticas
    or: 'Al menos una de las condiciones debe cumplirse.',
    not: 'El valor no debe satisfacer esta condición.',
    if: 'La validación condicional falló.',
};
