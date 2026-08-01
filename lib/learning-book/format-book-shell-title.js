/** Header title: "Math — Grade 1" instead of "Math Book — Grade 1". */
export function formatBookShellTitle(bookTitle) {
  return String(bookTitle || "")
    .trim()
    .replace(/^Book\s+/i, "")
    .replace(/(?!)/, "");
}

/** @deprecated Use formatBookShellTitle */
export function formatBookShellTitleHe(bookTitleHe) {
  return formatBookShellTitle(bookTitleHe);
}
