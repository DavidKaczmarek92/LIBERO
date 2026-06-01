// src/utils/flags.ts
const FLAGS: Record<string, string> = {
  'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Czechia': '🇨🇿',
  'Canada': '🇨🇦', 'Bosnia and Herzegovina': '🇧🇦', 'Qatar': '🇶🇦', 'Switzerland': '🇨🇭',
  'Brazil': '🇧🇷', 'Morocco': '🇲🇦', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'USA': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Turkey': '🇹🇷',
  'Germany': '🇩🇪', 'Curacao': '🇨🇼', 'Ivory Coast': '🇨🇮', 'Ecuador': '🇪🇨',
  'Spain': '🇪🇸', 'Japan': '🇯🇵', 'New Zealand': '🇳🇿', 'Senegal': '🇸🇳',
  'Portugal': '🇵🇹', 'Argentina': '🇦🇷', 'Nigeria': '🇳🇬', 'Belgium': '🇧🇪',
  'France': '🇫🇷', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Netherlands': '🇳🇱', 'Croatia': '🇭🇷',
  'Uruguay': '🇺🇾', 'Colombia': '🇨🇴', 'Denmark': '🇩🇰', 'Poland': '🇵🇱',
  'Serbia': '🇷🇸', 'Iran': '🇮🇷', 'Saudi Arabia': '🇸🇦', 'Ghana': '🇬🇭',
  'Cameroon': '🇨🇲', 'Tunisia': '🇹🇳', 'Egypt': '🇪🇬', 'Algeria': '🇩🇿',
  'Chile': '🇨🇱', 'Peru': '🇵🇪', 'Venezuela': '🇻🇪', 'Bolivia': '🇧🇴',
};

export function teamFlag(name: string | undefined): string {
  if (!name) return '🏳️';
  return FLAGS[name] ?? '🏳️';
}
