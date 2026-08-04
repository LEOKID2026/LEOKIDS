/** Header title: "Math — Grade 1" instead of "Math Book — Grade 1". Strips leading/trailing "Book"/"كتاب" word. */
export function formatBookShellTitle(bookTitle) {
  return String(bookTitle || "")
    .trim()
    .replace(/^كتاب\s+/u, "")
    .replace(/^Book\s+/i, "")
    .replace(/\s+Book$/i, "");
}

/** @deprecated Use formatBookShellTitle */
export function formatBookShellTitleHe(bookTitleHe) {
  return formatBookShellTitle(bookTitleHe);
}
