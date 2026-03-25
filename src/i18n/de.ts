export const de: Record<string, string | ((...args: any[]) => string)> = {
    // String
    required: 'Dieses Feld ist erforderlich.',
    minLength: (n: number) => `Mindestens ${n} Zeichen.`,
    maxLength: (n: number) => `Maximal ${n} Zeichen.`,
    exactLength: (n: number) => `Muss genau ${n} Zeichen enthalten.`,
    email: 'Ungültige E-Mail-Adresse.',
    url: 'Ungültige URL.',
    alpha: 'Nur Buchstaben sind erlaubt.',
    alphaNumeric: 'Nur Buchstaben und Zahlen sind erlaubt.',
    lowerCase: 'Nur Kleinbuchstaben sind erlaubt.',
    upperCase: 'Nur Großbuchstaben sind erlaubt.',
    noWhitespace: 'Leerzeichen sind nicht erlaubt.',
    contains: (v: string) => `Muss "${v}" enthalten.`,
    startsWith: (v: string) => `Muss mit "${v}" beginnen.`,
    endsWith: (v: string) => `Muss mit "${v}" enden.`,
    slug: 'Ungültiges Slug-Format.',
    passwordStrength: 'Das Passwort muss mindestens 8 Zeichen, einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.',
    hexColor: 'Ungültige Hexadezimalfarbe.',
    ipv4: 'Ungültige IPv4-Adresse.',
    uuid: 'Ungültige UUID.',
    json: 'Ungültiges JSON.',
    phone: 'Ungültige Telefonnummer.',
    creditCard: 'Ungültige Kreditkartennummer.',
    pattern: 'Ungültiges Format.',
    // Numeric
    digitsOnly: 'Nur Ziffern sind erlaubt.',
    numberRange: (min: number, max: number) => `Der Wert muss zwischen ${min} und ${max} liegen.`,
    numberPositive: 'Der Wert muss positiv sein.',
    numberNegative: 'Der Wert muss negativ sein.',
    integer: 'Der Wert muss eine ganze Zahl sein.',
    multipleOf: (n: number) => `Der Wert muss ein Vielfaches von ${n} sein.`,
    // Date
    dateFormat: (format: string) => `Ungültiges Datumsformat. Verwenden Sie (${format}).`,
    minDate: (v: string | Date) => `Das Datum muss ${v} oder später sein.`,
    maxDate: (v: string | Date) => `Das Datum muss ${v} oder früher sein.`,
    futureDate: 'Das Datum muss in der Zukunft liegen.',
    pastDate: 'Das Datum muss in der Vergangenheit liegen.',
    // File
    fileType: 'Dateityp nicht erlaubt.',
    fileSize: 'Die Datei überschreitet die maximal erlaubte Größe.',
    fileDimensions: (w: number, h: number) => `Die Abmessungen müssen genau ${w}x${h} Pixel betragen.`,
    imageAspectRatio: (w: number, h: number) => `Das Seitenverhältnis des Bildes muss ${w}:${h} sein.`,
    imageMinDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`Breite >= ${w}px`);
        if (h !== undefined) parts.push(`Höhe >= ${h}px`);
        return parts.length > 0
            ? `Das Bild muss mindestens ${parts.join(' und ')} haben.`
            : 'Die Bildabmessungen sind zu klein.';
    },
    imageMaxDimensions: (w?: number, h?: number) => {
        const parts: string[] = [];
        if (w !== undefined) parts.push(`Breite <= ${w}px`);
        if (h !== undefined) parts.push(`Höhe <= ${h}px`);
        return parts.length > 0
            ? `Das Bild darf nicht mehr als ${parts.join(' und ')} haben.`
            : 'Die Bildabmessungen sind zu groß.';
    },
    // Cross-field
    matchField: 'Die Werte stimmen nicht überein.',
    requiredIf: 'Dieses Feld ist erforderlich.',
    // Async
    asyncPattern: 'Validierung fehlgeschlagen.',
    // Numeric v2.1
    greaterThan: (n: number) => `Der Wert muss größer als ${n} sein.`,
    lessThan: (n: number) => `Der Wert muss kleiner als ${n} sein.`,
    precision: (n: number) => `Der Wert darf höchstens ${n} Dezimalstellen haben.`,
    // Date v2.1
    dateAfter: (v: string | Date) => `Das Datum muss nach ${v} liegen.`,
    dateBefore: (v: string | Date) => `Das Datum muss vor ${v} liegen.`,
    // Enum / set
    oneOf: (values: any[]) => `Der Wert muss einer der folgenden sein: ${values.join(', ')}.`,
    // Cross-field v2.1
    notMatchField: 'Die Werte dürfen nicht übereinstimmen.',
    requiredUnless: 'Dieses Feld ist erforderlich.',
    // Array
    arrayMinLength: (n: number) => `Wählen Sie mindestens ${n} Elemente aus.`,
    arrayMaxLength: (n: number) => `Wählen Sie höchstens ${n} Elemente aus.`,
    arrayUnique: 'Alle Elemente müssen eindeutig sein.',
    arrayContains: (v: any) => `Das Array muss "${v}" enthalten.`,
    // Format
    time: 'Ungültiges Zeitformat.',
    noHTML: 'HTML-Tags sind nicht erlaubt.',
    // Finance / geo / other
    iban: 'Ungültige IBAN.',
    postalCode: 'Ungültige Postleitzahl.',
    latitude: 'Der Breitengrad muss zwischen -90 und 90 liegen.',
    longitude: 'Der Längengrad muss zwischen -180 und 180 liegen.',
    semVer: 'Ungültige semantische Version (erwartet: X.Y.Z oder X.Y.Z-pre+build).',
    base64: 'Ungültige Base64-Kodierung.',
    // v3.0
    notOneOf: (values: any[]) => `Der Wert darf keiner der folgenden sein: ${values.join(', ')}.`,
    ipv6: 'Ungültige IPv6-Adresse.',
    macAddress: 'Ungültiges MAC-Adressformat.',
    dataURI: 'Ungültiges Data URI-Format.',
    mimeType: 'Dateityp nicht erlaubt.',
    arrayItems: 'Ein oder mehrere Elemente haben die Validierung nicht bestanden.',
    dateRange: 'Das Startdatum muss vor dem Enddatum liegen.',
    // v4 — neue Validatoren
    alphaDash: 'Nur Buchstaben, Zahlen, Unterstriche und Bindestriche sind erlaubt.',
    notEmpty: 'Das Feld darf nicht leer sein oder nur Leerzeichen enthalten.',
    jwt: 'Ungültiges JWT-Format.',
    finite: 'Der Wert muss eine endliche Zahl sein.',
    port: 'Der Wert muss eine gültige Portnummer sein (0–65535).',
    greaterThanOrEqual: (n: number) => `Der Wert muss ≥ ${n} sein.`,
    lessThanOrEqual: (n: number) => `Der Wert muss ≤ ${n} sein.`,
    dateAfterField: (f: string) => `Datum muss nach "${f}" liegen.`,
    dateBeforeField: (f: string) => `Datum muss vor "${f}" liegen.`,
    arrayExactLength: (n: number) => `Das Array muss genau ${n} Elemente enthalten.`,
    // Synthetische Regeln
    or: 'Mindestens eine der Bedingungen muss erfüllt sein.',
    not: 'Der Wert darf diese Bedingung nicht erfüllen.',
    if: 'Die bedingte Validierung ist fehlgeschlagen.',
};
