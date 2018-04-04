# Book Carousels

## Adding carousels to the page

A book carousel can be added to any page on the site, as long as you know the carousel ID number. To do so, you'll need to add a little HTML and JavaScript to a HTML Snippet on your page in SiteExecutive. 

Note: You *must* have Slick installed on your page's template. Verify the following files exists in the page's `<head>` tag:

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.js"></script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css" rel="stylesheet" />
```

### Attributes

- **data-carousel-id** _(required)_ This numeric value is the ID number of the carousel from Polaris.

### JavaScript settings

The following settings must be supplied in a JSON object as shown in the examples below.

- **isGrid** _(optional)_ This should be set to **true** if you want the carousel displayed as a grid. Default value: **false**.
- **isTitleSearch** _(optional)_ This should be set to **true** if you want the links to perform a title search. Default value: **false**.
- **maxSlides** _(optional)_ This numeric value is the maximum number of slides that will display above the 1200px breakpoint. More than likely, this will only be used on full-width pages, and will usually be **4**. Default value: **3**.

### Single Carousel

Add the following code to a HTML snippet on your page:

```HTML
<div class="book-carousel" data-carousel-id="57636"></div>

<script>
	$(function() { bcpl.bookCarousel.init({ isTitleSearch: false, isGrid: false }) });
</script>
```

### Multiple Carousels

Add the following code to a HTML snippet on your page:

```HTML
<div class="book-carousel" data-carousel-id="57636"></div>
<div class="book-carousel" data-carousel-id="42681"></div>
<div class="book-carousel" data-carousel-id="6585"></div>

<script>
	$(function() { bcpl.bookCarousel.init() });
</script>
```

### Single Carousel (full-width)

Add the following code to a HTML snippet on your page:

```HTML
<div class="book-carousel" data-carousel-id="57636"></div>

<script>
	$(function() { bcpl.bookCarousel.init({ maxSlides: 4 }) });
</script>
```

### Multiple Carousels (full-width)

Add the following code to a HTML snippet on your page:

```HTML
<div class="book-carousel" data-carousel-id="57636"></div>
<div class="book-carousel" data-carousel-id="42681"></div>
<div class="book-carousel" data-carousel-id="6585"></div>

<script>
	$(function() { bcpl.bookCarousel.init({ maxSlides: 4 }) });
</script>
```

### Grid 

You can also display books as a grid.

```HTML
<div class="book-carousel" data-carousel-id="57636"></div>

<script>
	$(function() { bcpl.bookCarousel.init({ isGrid: true }) });
</script>
```

### Ttile Search 

You can set the URLs to perform a title search.

```HTML
<div class="book-carousel" data-carousel-id="57636"></div>

<script>
	$(function() { bcpl.bookCarousel.init({ isTitleSearch: true }) });
</script>
```