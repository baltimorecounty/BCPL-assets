# Featured Events Widget

## Markup



## Usage
**Special note**: Always include a comment with the snippet that describes what data is being pulled. This will allow future editors to read in plain English what the widget is intended to display. IDs are hard to read!

### Basic Usage
Show all events. Will show all branches, event types and will not prioritize featured events.
```html
<featured-events /> <!-- return the first three events of any event type and from any library branch -->
```

### Filter by Branch
To show events for a certain branch, use the following snippet. In this case we are showing all events for the Essex Branch.
```html
<featured-events
    branches="[4]" /> <!-- show the first three events from the essex branch -->
```
**Note**: You will need to know the branch ID. You can get this (put something here on where to get it).

The following snippet will show all events for the Arbutus and Essex branches. This will return the first 3 events that occur in chronological order, so it's possible the events shown will be at one branch.
```html
<featured-events
    branches="[1, 4]" /> <!-- show the first three events from the arbutus and essex branches -->
```

### Filter by Event Type
To show certain event types, use the following snippet.
```html
<featured-events
    event-types="[7]" /> <!-- show the first three events events with the event type family -->
```
**Note**: You will need to know the event type ID. You can get this (put something here on where to get it).

```html
<featured-events
    branches="[7, 28]" /> <!-- show the first three events with event types of 'Family' and 'Story Time' -->
```
**Note**: This will return the first 3 events that occur in chronological order, so it's possible the events shown will be at one branch.

### Adjust the Number of Results Being Displayed
To show certain event types, use the following snippet. If this attribute is excluded the default number of results to display is *3*. If you want to return 3 results, you do not need to include this attribute.
```html
<featured-events
    results-to-display="4" /> <!-- show the first four events from any branch -->
```

```html
<featured-events
    results-to-display="2" /> <!-- show the first two events from any branch -->
```

### Prioritize Featured Events
Sometimes you may want to give featured events priority. To do this, use the following snippet:
```html
<featured-events
    prioritize-featured="true" /> <!-- show 3 events, if there are 3 featured events all will be featured, otherwise it will return any featured events and then non featured events that add up to 3 and display in chronilogical order -->
```

### Combining Attributes
Any of the attributes above can be used together. Here are a couple of common examples to get you started.
```html
<featured-events
    event-types="[7]"
    prioritize-featured="false" /> <!-- show 3 events from the Hereford Branch, with the event type of 'Family'  -->
```

```html
<featured-events
    branches="[5]"
    prioritize-featured="true" /> <!-- show 3 events from the Hereford Branch, where featured content will be displayed if available  -->
```

```html
<featured-events
    branches="[5]"
    event-types="[7, 28]"
    prioritize-featured="true" /> <!-- show 3 events from the Hereford Branch, where featured content will be displayed if available, and those events will either by of the event type 'Family' or 'Story Time'  -->
```

```html
<featured-events
    branches="[5]"
    event-types="[7, 28]"
    results-to-display="5"
    prioritize-featured="true" /> <!-- show 5 events from the Hereford Branch, where featured content will be displayed if available, and those events will either by of the event type 'Family' or 'Story Time'  -->
```
