import FontFaceObserver from 'fontfaceobserver'

/**
 * Use the "FOUT with a Class" strategy for loading webfonts
 * https://www.zachleat.com/web/comprehensive-webfonts/#fout-with-a-class
 */
function fout(options) {
  if (!options.fontName || !options.fontLoadedClass) {
    throw new Error(
      'fontName or fontLoadedClass missing from fout() arguments!'
    )
  }

  // Determine which DOM element we're going to add a class to,
  // and where we're going to store the font cache indicator in localStorage
  const container = options.container || document.documentElement
  const storedKey = options.localStorageKey || `fout-loader__${options.fontName}`

  // Check for localStorage support and for the presence of the font we want
  // in localStorage as a heuristic for whether the font has been cached.
  if (window.localStorage && localStorage.getItem(storedKey)) {
    // Assume the font is already in the cache; we can apply the loaded
    // styles immediately.
    container.classList.add(options.fontLoadedClass)
  } else {
    // Assume the font has not been cached.
    const font = new FontFaceObserver(options.fontName)
    return font.load().then(() => {
      // Font has finished loading, so apply the loaded styles and indicate to
      // future intrepid loaders that this happened.
      container.classList.add(options.fontLoadedClass)
      localStorage.setItem(storedKey, 1)
    })
  }
}

export default fout
