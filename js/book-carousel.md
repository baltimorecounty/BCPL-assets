# Book Carousels

## Adding carousels to the page

A book carousel can be added to any page on the site, as long as you know the carousel ID number. To do so, you'll need to add a little HTML and JavaScript to a HTML Snippet on your page in SiteExecutive. 

Note: You *must* have Slick installed on your page's template. Verify the following files exists in the page's `<head>` tag:

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.js"></script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css" rel="stylesheet" />
```

### Single Carousel

Add the following code to a HTML snippet on your page:

```HTML
<div class="book-carousel" data-carousel-id="57636"></div>

<script>
	$(function() { bcpl.bookCarousel.init() });
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