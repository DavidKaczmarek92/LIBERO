// src/utils/flags.ts
const FLAGS: Record<string, string> = {
  // Grupa A
  'Meksyk': '🇲🇽', 'RPA': '🇿🇦', 'Korea Południowa': '🇰🇷', 'Czechy': '🇨🇿',
  // Grupa B
  'Kanada': '🇨🇦', 'Bośnia i Hercegowina': '🇧🇦', 'Katar': '🇶🇦', 'Szwajcaria': '🇨🇭',
  // Grupa C
  'Brazylia': '🇧🇷', 'Maroko': '🇲🇦', 'Haiti': '🇭🇹', 'Szkocja': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  // Grupa D
  'USA': '🇺🇸', 'Paragwaj': '🇵🇾', 'Australia': '🇦🇺', 'Turcja': '🇹🇷',
  // Grupa E
  'Niemcy': '🇩🇪', 'Curaçao': '🇨🇼', 'Wybrzeże Kości Słoniowej': '🇨🇮', 'Ekwador': '🇪🇨',
  // Grupa F
  'Holandia': '🇳🇱', 'Japonia': '🇯🇵', 'Szwecja': '🇸🇪', 'Tunezja': '🇹🇳',
  // Grupa G
  'Belgia': '🇧🇪', 'Egipt': '🇪🇬', 'Iran': '🇮🇷', 'Nowa Zelandia': '🇳🇿',
  // Grupa H
  'Hiszpania': '🇪🇸', 'Wyspy Zielonego Przylądka': '🇨🇻', 'Arabia Saudyjska': '🇸🇦', 'Urugwaj': '🇺🇾',
  // Grupa I
  'Francja': '🇫🇷', 'Senegal': '🇸🇳', 'Irak': '🇮🇶', 'Norwegia': '🇳🇴',
  // Grupa J
  'Argentyna': '🇦🇷', 'Algieria': '🇩🇿', 'Austria': '🇦🇹', 'Jordania': '🇯🇴',
  // Grupa K
  'Portugalia': '🇵🇹', 'DR Kongo': '🇨🇩', 'Uzbekistan': '🇺🇿', 'Kolumbia': '🇨🇴',
  // Grupa L
  'Anglia': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Chorwacja': '🇭🇷', 'Ghana': '🇬🇭', 'Panama': '🇵🇦',
  // Dodatkowe (na wszelki wypadek)
  'Polska': '🇵🇱', 'Serbia': '🇷🇸', 'Dania': '🇩🇰', 'Kamerun': '🇨🇲',
  'Chile': '🇨🇱', 'Peru': '🇵🇪', 'Wenezuela': '🇻🇪', 'Boliwia': '🇧🇴',
  'Nigeria': '🇳🇬',
};

export function teamFlag(name: string | undefined): string {
  if (!name) return '🏳️';
  return FLAGS[name] ?? '🏳️';
}
