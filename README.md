# FOUT Loader - Flash of Unstyled Text with a class

A font loader that implements the Flash of Unstyled Text ("FOUT with a class") algorithm, as described by [Zach Leat](https://www.zachleat.com/web/comprehensive-webfonts/#fout-class).

This library simplifies the process of styling and loading web fonts in such a way that the user notices minimal "flash" while your fonts are still loading. It works by loading fonts in the background using [Font Face Observer](https://fontfaceobserver.com/) and setting a custom class on a (configurable) DOM element once each font loads. On subsequent loads of your page, FOUT Loader checks [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for a key unique to each web font as a heuristic for whether the font has been cached, in which case by definition we don't need to load the font again.

The result is a much smoother experience for the end user and a practically instantaneous rendering of web fonts on subsequent page loads.

## Installation

```bash
npm install fout-loader --save
```

## Usage

```js
import fout from 'fout-loader'

fout({
  fontName: 'Merriweather', // required; works for any font supported by Font Face Observer
  fontLoadedClass: 'merriweather-loaded', // required
  container: document.querySelector('.my-container'), // defaults to document.documentElement
  localStorageKey: 'merriweather-loaded', // defaults to `fout-loader__${options.fontName}`
})
```

### On-font-loaded callback

The `fout()` function returns the Promise returned by Font Face Observer, so if you want to do anything extra once your font has loaded, you can do so in a `then()` callback:

```js
fout({ /* ... */ }).then(() => {
  console.log('did some other stuff')
})
```

### Loading multiple fonts

Just like with Font Face Observer, you can simply call it multiple times. It's just a function, so you don't need to instantiate anything:

```js
fout({
  fontName: 'Lato',
  fontLoadedClass: 'Lato',
})
fout({
  fontName: 'Lora',
  fontLoadedClass: 'Lora',
})
```

### Avoiding shifting text

To avoid jarring shifts in the rendered text as the font changes, I _highly_ recommend you check out the awesome [Font Style Matcher](https://meowni.ca/font-style-matcher/) by Monica Dinculescu. Using this tool, you can hone in a good fallback style to apply to a system font while your web font loads. It only takes a couple minutes of fiddling, and it's actually pretty fun to play with!

Once you arrive at a good combination of fallback/web font styles, apply them in your CSS by nesting the desired styles under the `fontLoadedClass` selector. For example, if your `fontLoadedClass` is `"merriweather-loaded"`, use this CSS:

```css
.copy-text-selector {
  font-family: Georgia;
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: -0.35px;
  word-spacing: -0.35px;
}

.merriweather-loaded .copy-text-selector {
  font-family: Merriweather;
  line-height: 1.6;
}
```

## Caveats

* Even if fonts are cached, instantaneous web font renders rely on `localStorage` being available. If `localStorage` is not available or the key for a given font has been deleted for any reason, FOUT Loader will fall back to loading the font over the network, resulting in a FOUT. This is the case even if the font is actually cached: the key word here is _heuristic_, the technical term for "pretty good indicator."
* Conversely, if the user has cleared their cache but not `localStorage`, the class will be added prematurely and a flash will occur as FOUT Loader downloads it. This won't occur under normal circumstances.
