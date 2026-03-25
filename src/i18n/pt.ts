export const pt: Record<string, string | ((...args: any[]) => string)> = {
    // String
    required: 'Este campo é obrigatório.',
    minLength: (n: number) => `Mínimo ${n} caracteres.`,
    maxLength: (n: number) => `Máximo ${n} caracteres.`,
    exactLength: (n: number) => `Deve ter exatamente ${n} caracteres.`,
    email: 'Endereço de e-mail inválido.',
    url: 'URL inválida.',
    alpha: 'Apenas letras são permitidas.',
    alphaNumeric: 'Apenas letras e números são permitidos.',
    lowerCase: 'Deve conter apenas letras minúsculas.',
    upperCase: 'Deve conter apenas letras maiúsculas.',
    noWhitespace: 'Não são permitidos espaços.',
    contains: (v: string) => `Deve conter "${v}".`,
    startsWith: (v: string) => `Deve começar com "${v}".`,
    endsWith: (v: string) => `Deve terminar com "${v}".`,
    slug: 'Formato de slug inválido.',
    passwordStrength: 'A senha deve ter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial.',
    hexColor: 'Cor hexadecimal inválida.',
    ipv4: 'Endereço IPv4 inválido.',
    uuid: 'UUID inválido.',
    json: 'JSON inválido.',
    phone: 'Número de telefone inválido.',
    creditCard: 'Número de cartão de crédito inválido.',
    pattern: 'Formato inválido.',
    // Numeric
    digitsOnly: 'Apenas dígitos são permitidos.',
    numberRange: (min: number, max: number) => `O valor deve estar entre ${min} e ${max}.`,
    numberPositive: 'O valor deve ser positivo.',
    numberNegative: 'O valor deve ser negativo.',
    integer: 'O valor deve ser um número inteiro.',
    multipleOf: (n: number) => `O valor deve ser múltiplo de ${n}.`,
    // Date
    dateFormat: (format: string) => `Formato de data inválido. Use (${format}).`,
    minDate: (v: string | Date) => `A data deve ser ${v} ou posterior.`,
    maxDate: (v: string | Date) => `A data deve ser ${v} ou anterior.`,
    futureDate: 'A data deve ser futura.',
    pastDate: 'A data deve ser passada.',
    // File
    fileType: 'Tipo de arquivo não permitido.',
    fileSize: 'O arquivo excede o tamanho máximo permitido.',
    fileDimensions: (w: number, h: number) => `As dimensões devem ser exatamente ${w}x${h} pixels.`,
    imageAspectRatio: (w: number, h: number) => `A proporção da imagem deve ser ${w}:${h}.`,
    imageMinDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`largura >= ${w}px`);
        if (h !== undefined) parts.push(`altura >= ${h}px`);
        return parts.length > 0
            ? `A imagem deve ter pelo menos ${parts.join(' e ')}.`
            : 'As dimensões da imagem são muito pequenas.';
    },
    imageMaxDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`largura <= ${w}px`);
        if (h !== undefined) parts.push(`altura <= ${h}px`);
        return parts.length > 0
            ? `A imagem não deve exceder ${parts.join(' e ')}.`
            : 'As dimensões da imagem são muito grandes.';
    },
    // Cross-field
    matchField: 'Os valores não coincidem.',
    requiredIf: 'Este campo é obrigatório.',
    // Async
    asyncPattern: 'A validação falhou.',
    // Numeric v2.1
    greaterThan: (n: number) => `O valor deve ser maior que ${n}.`,
    lessThan: (n: number) => `O valor deve ser menor que ${n}.`,
    precision: (n: number) => `O valor deve ter no máximo ${n} casas decimais.`,
    // Date v2.1
    dateAfter: (v: string | Date) => `A data deve ser posterior a ${v}.`,
    dateBefore: (v: string | Date) => `A data deve ser anterior a ${v}.`,
    // Enum / set
    oneOf: (values: any[]) => `O valor deve ser um dos seguintes: ${values.join(', ')}.`,
    // Cross-field v2.1
    notMatchField: 'Os valores não devem coincidir.',
    requiredUnless: 'Este campo é obrigatório.',
    // Array
    arrayMinLength: (n: number) => `Selecione pelo menos ${n} itens.`,
    arrayMaxLength: (n: number) => `Selecione no máximo ${n} itens.`,
    arrayUnique: 'Todos os itens devem ser únicos.',
    arrayContains: (v: any) => `O array deve conter "${v}".`,
    // Format
    time: 'Formato de hora inválido.',
    noHTML: 'Tags HTML não são permitidas.',
    // Finance / geo / other
    iban: 'IBAN inválido.',
    postalCode: 'Código postal inválido.',
    latitude: 'O valor deve ser uma latitude válida (-90 a 90).',
    longitude: 'O valor deve ser uma longitude válida (-180 a 180).',
    semVer: 'Versão semântica inválida (formato esperado: X.Y.Z ou X.Y.Z-pre+build).',
    base64: 'Codificação Base64 inválida.',
    // v3.0
    notOneOf: (values: any[]) => `O valor não deve ser nenhum dos seguintes: ${values.join(', ')}.`,
    ipv6: 'Endereço IPv6 inválido.',
    macAddress: 'Formato de endereço MAC inválido.',
    dataURI: 'Formato de Data URI inválido.',
    mimeType: 'Tipo de arquivo não permitido.',
    arrayItems: 'Um ou mais itens não passaram na validação.',
    dateRange: 'A data de início deve ser anterior à data de término.',
    // v4 — novos validadores
    alphaDash: 'Apenas letras, números, sublinhados e hífens são permitidos.',
    notEmpty: 'O campo não pode estar em branco ou conter apenas espaços.',
    jwt: 'Formato JWT inválido.',
    finite: 'O valor deve ser um número finito.',
    port: 'O valor deve ser um número de porta válido (0–65535).',
    greaterThanOrEqual: (n: number) => `O valor deve ser ≥ ${n}.`,
    lessThanOrEqual: (n: number) => `O valor deve ser ≤ ${n}.`,
    dateAfterField: (f: string) => `A data deve ser posterior a "${f}".`,
    dateBeforeField: (f: string) => `A data deve ser anterior a "${f}".`,
    arrayExactLength: (n: number) => `O array deve ter exatamente ${n} elementos.`,
    // Regras sintéticas
    or: 'Pelo menos uma das condições deve ser atendida.',
    not: 'O valor não deve satisfazer esta condição.',
    if: 'A validação condicional falhou.',
};
