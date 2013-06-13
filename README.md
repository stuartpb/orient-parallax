# orientParallax.js

Create style rules to emulate background parallax scrolling with device
orientation like [iOS 7](http://img.gawkerassets.com/img/18qf1wgjcxuongif/ku-xlarge.gif).

See [the demo](http://stuartpb.github.io/orient-parallax/demo.html) (only works
on browser + device combos that support deviceorientation events - otherwise
it's pretty much just going to stay still).

## Usage

First, include orientParallax somewhere on your page (near the bottom of the
body is recommended for load performance reasons):

```html
<script src="orientParallax.js"></script>
```

Then, when your document.head is ready, call the `orientParallax` function to
insert a style rule (with the selector defaulting to `.orient-parallax`) that
will be updated on device orientation update, offsetting the
background-position property based on the angle of the screen.

```html
<script>
  orientParallax();
</script>
```

Putting it all together:

```html
<head>
  <!-- make your page the size of the screen -->
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <style>
    body {
      background-image: url('background.jpg');
      background-size: 150%;
    }
  </style>
</head>
<body class="orient-parallax">
  <!-- Put your buttons and what not here... -->
  <script src="orientParallax.js"></script>
  <script>orientParallax()</script>
</body>
```

## Options

The function's default options use 50% for both the initial offsets from the
top-left corner (when the screen is dead-center), and the range of movement
from these offsets. These work well for a portrait CSS background image that is
sized to 150% of the page width.

If you wish to override these defaults, the xOffset and yOffset values of the
orientParallax function's option object parameter specify the offset percentage
for the horizontal and vertical positions, and the xFactor and yFactor values
specify the percentage that the position will change based on orientation. The
"selector" value will override the default ".orient-parallax" selector of the
rule.

So, if you wanted to make a single-element background that only slides left to
right slightly and is anchored at the top, you could use:

```js
var listener = orientParallax({
  yOffset:0, yFactor:0, xFactor: 15, selector: '#horSlider'
});
```

## A note on horizontal position

The orientation of the device in alpha (left-to-right turning) that is
"facing the user" is determined when the deviceorientation handler is first
called: after that, it remains constrained to a 90-degree angle from this
established center, meaning that if the device moves 50 degrees to the left,
the established "center angle" will be moved to the left by 5 degrees.

## Techniques

To get an overlay with a blurred background like the panel at the bottom of the
iOS 7 screen, you can create another element with the same size as your
background image, subject to the same orient-parallax selector, and with
`background-attachment: fixed`, then use a blurred and lightened version of
your main background image (here's how you can do it using ImageMagick):

    convert background.jpg +level 25,100% -blur 0x7 frosted-background.jpg

See demo.html for an example.

This is pretty much your only solution. At time of writing (June 2013), the
ability to create blurred elements *at all* is
[beginning](http://dabblet.com/LeaVerou/1522085) to pop up, and even then
[only in WebKit](http://caniuse.com/#feat=css-filters) (which has spotty
deviceorientation support on mobile- see next section), and even then not for
blurring the content *beneath* an element as a proper implementation might.

## The state of deviceorientation

At time of writing (June 2013),
[caniuse's page on deviceorientation](http://caniuse.com/deviceorientation)
only tells half the story.

On iOS Safari, deviceorientation presumably works perfectly. I don't actually
own an iPhone, so I can't speak to its Safari implementation's efficacy.

On Chrome for Android, it's a jittery mess. Everything twitches all over the
place, and alpha values are so arbitrary and irregular that they might as well
not exist at all. There's
[a bug](https://code.google.com/p/chromium/issues/detail?id=223229) in the
Chromium bug tracker for this with some degree of an explanation (that I just
bumped today): here's to hoping it gains some traction.

Firefox for Android has much more accurate orientation support, but the values
it returns, at least for beta and gamma, seem to be opposite what the spec
declares they're supposed to be (beta is -90 when the device is right-side-up
and 90 when it's upside-down). This script currently fixes this with user agent
sniffing. Bugzilla doesn't seem to have any bugs on this at the moment, and
the doocumentation only states that
["this is an experimental technology"](https://developer.mozilla.org/en-US/docs/WebAPI/Detecting_device_orientation)
and state that
[Chrome and Firefox are reversed on some axes](https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Events/Orientation_and_motion_data_explained) -
ignoring that Chrome is following the directions stated by the W3C spec (albeit
unreliably). Frankly, I'd file a bug on Bugzilla to this effect, but the one
reference implementation I can refer to is so shoddy that it just doesn't seem
right at the moment. We'll see what happens if and when Chrome gets its act
together.
