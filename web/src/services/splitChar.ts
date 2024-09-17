export function splitByFirstOccurrence(str: string | undefined, char: string) {
  if (!str) {
    return ["", ""];
  }
  // Найти индекс первого вхождения символа
  const index = str.indexOf(char);

  // Если символ не найден, вернуть исходную строку и пустую строку
  if (index === -1) {
    return ["", ""];
  }

  // Разбить строку по первому вхождению символа
  const firstPart = str.slice(0, index);
  const secondPart = str.slice(index + 1); // +1 чтобы не включать сам символ

  return [firstPart, secondPart];
}
