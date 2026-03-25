export const fr: Record<string, string | ((...args: any[]) => string)> = {
    // String
    required: 'Ce champ est obligatoire.',
    minLength: (n: number) => `Minimum ${n} caractères.`,
    maxLength: (n: number) => `Maximum ${n} caractères.`,
    exactLength: (n: number) => `Doit contenir exactement ${n} caractères.`,
    email: 'Adresse e-mail invalide.',
    url: 'URL invalide.',
    alpha: 'Seules les lettres sont autorisées.',
    alphaNumeric: 'Seules les lettres et les chiffres sont autorisés.',
    lowerCase: 'Seules les lettres minuscules sont autorisées.',
    upperCase: 'Seules les lettres majuscules sont autorisées.',
    noWhitespace: 'Les espaces ne sont pas autorisés.',
    contains: (v: string) => `Doit contenir "${v}".`,
    startsWith: (v: string) => `Doit commencer par "${v}".`,
    endsWith: (v: string) => `Doit se terminer par "${v}".`,
    slug: 'Format de slug invalide.',
    passwordStrength: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
    hexColor: 'Couleur hexadécimale invalide.',
    ipv4: 'Adresse IPv4 invalide.',
    uuid: 'UUID invalide.',
    json: 'JSON invalide.',
    phone: 'Numéro de téléphone invalide.',
    creditCard: 'Numéro de carte de crédit invalide.',
    pattern: 'Format invalide.',
    // Numeric
    digitsOnly: 'Seuls les chiffres sont autorisés.',
    numberRange: (min: number, max: number) => `La valeur doit être comprise entre ${min} et ${max}.`,
    numberPositive: 'La valeur doit être positive.',
    numberNegative: 'La valeur doit être négative.',
    integer: 'La valeur doit être un nombre entier.',
    multipleOf: (n: number) => `La valeur doit être un multiple de ${n}.`,
    // Date
    dateFormat: (format: string) => `Format de date invalide. Utilisez (${format}).`,
    minDate: (v: string | Date) => `La date doit être le ${v} ou une date ultérieure.`,
    maxDate: (v: string | Date) => `La date doit être le ${v} ou une date antérieure.`,
    futureDate: 'La date doit être dans le futur.',
    pastDate: 'La date doit être dans le passé.',
    // File
    fileType: 'Type de fichier non autorisé.',
    fileSize: 'Le fichier dépasse la taille maximale autorisée.',
    fileDimensions: (w: number, h: number) => `Les dimensions doivent être exactement ${w}x${h} pixels.`,
    imageAspectRatio: (w: number, h: number) => `Le ratio de l'image doit être ${w}:${h}.`,
    imageMinDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`largeur >= ${w}px`);
        if (h !== undefined) parts.push(`hauteur >= ${h}px`);
        return parts.length > 0
            ? `L'image doit avoir au moins ${parts.join(' et ')}.`
            : "Les dimensions de l'image sont trop petites.";
    },
    imageMaxDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`largeur <= ${w}px`);
        if (h !== undefined) parts.push(`hauteur <= ${h}px`);
        return parts.length > 0
            ? `L'image ne doit pas dépasser ${parts.join(' et ')}.`
            : "Les dimensions de l'image sont trop grandes.";
    },
    // Cross-field
    matchField: 'Les valeurs ne correspondent pas.',
    requiredIf: 'Ce champ est obligatoire.',
    // Async
    asyncPattern: 'La validation a échoué.',
    // Numeric v2.1
    greaterThan: (n: number) => `La valeur doit être supérieure à ${n}.`,
    lessThan: (n: number) => `La valeur doit être inférieure à ${n}.`,
    precision: (n: number) => `La valeur ne peut pas avoir plus de ${n} décimales.`,
    // Date v2.1
    dateAfter: (v: string | Date) => `La date doit être postérieure à ${v}.`,
    dateBefore: (v: string | Date) => `La date doit être antérieure à ${v}.`,
    // Enum / set
    oneOf: (values: any[]) => `La valeur doit être l'une des suivantes : ${values.join(', ')}.`,
    // Cross-field v2.1
    notMatchField: 'Les valeurs ne doivent pas correspondre.',
    requiredUnless: 'Ce champ est obligatoire.',
    // Array
    arrayMinLength: (n: number) => `Sélectionnez au moins ${n} éléments.`,
    arrayMaxLength: (n: number) => `Sélectionnez au maximum ${n} éléments.`,
    arrayUnique: 'Tous les éléments doivent être uniques.',
    arrayContains: (v: any) => `Le tableau doit contenir "${v}".`,
    // Format
    time: 'Format d\'heure invalide.',
    noHTML: 'Les balises HTML ne sont pas autorisées.',
    // Finance / geo / other
    iban: 'IBAN invalide.',
    postalCode: 'Code postal invalide.',
    latitude: 'La latitude doit être comprise entre -90 et 90.',
    longitude: 'La longitude doit être comprise entre -180 et 180.',
    semVer: 'Version sémantique invalide (format attendu : X.Y.Z ou X.Y.Z-pre+build).',
    base64: 'Encodage Base64 invalide.',
    // v3.0
    notOneOf: (values: any[]) => `La valeur ne doit pas être l'une de : ${values.join(', ')}.`,
    ipv6: 'Adresse IPv6 invalide.',
    macAddress: 'Format d\'adresse MAC invalide.',
    dataURI: 'Format Data URI invalide.',
    mimeType: 'Type de fichier non autorisé.',
    arrayItems: 'Un ou plusieurs éléments ont échoué la validation.',
    dateRange: 'La date de début doit être antérieure à la date de fin.',
    // v4 — nouveaux validateurs
    alphaDash: 'Seules les lettres, chiffres, tirets bas et tirets sont autorisés.',
    notEmpty: 'Le champ ne doit pas être vide ou contenir uniquement des espaces.',
    jwt: 'Format JWT invalide.',
    finite: 'La valeur doit être un nombre fini.',
    port: 'La valeur doit être un numéro de port valide (0–65535).',
    greaterThanOrEqual: (n: number) => `La valeur doit être ≥ ${n}.`,
    lessThanOrEqual: (n: number) => `La valeur doit être ≤ ${n}.`,
    dateAfterField: (f: string) => `La date doit être après "${f}".`,
    dateBeforeField: (f: string) => `La date doit être avant "${f}".`,
    arrayExactLength: (n: number) => `Le tableau doit contenir exactement ${n} éléments.`,
    // Règles synthétiques
    or: 'Au moins une des conditions doit être remplie.',
    not: 'La valeur ne doit pas satisfaire cette condition.',
    if: 'La validation conditionnelle a échoué.',
};
