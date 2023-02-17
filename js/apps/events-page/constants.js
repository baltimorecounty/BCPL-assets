(() => {
  "use strict";

  const app = angular.module("events", []);

  var constants = {
    baseUrl: "https://services.bcpl.info",
    serviceUrls: {
      events: "/api/evanced/signup/events",
      eventRegistration: "/api/evanced/signup/registration",
      eventTypes: "/api/evanced/signup/eventtypes",
      downloads: "/api/evanced/signup/download",
    },
    remoteServiceUrls: {
      ageGroups: "https://bcpl.evanced.info/api/signup/agegroups",
      locations: "https://bcpl.evanced.info/api/signup/locations",
    },
    templateUrls: {
      datePickersTemplate: "/_js/apps/events-page/templates/datePickers.html",
      eventsListTemplate: "/_js/apps/events-page/templates/eventsList.html",
      filtersTemplate: "/_js/apps/events-page/templates/filters.html",
      filtersExpandosTemplate:
        "/_js/apps/events-page/templates/filters-expandos.html",
      loadMoreTemplate: "/_js/apps/events-page/templates/loadMore.html",
      featuredEventsTemplate:
        "/_js/apps/events-page/templates/featuredEvents.html",
    },
    partialUrls: {
      eventListPartial: "/_js/apps/events-page/partials/eventList.html",
      eventDetailsPartial: "/_js/apps/events-page/partials/eventDetails.html",
      eventRegistrationPartial:
        "/_js/apps/events-page/partials/eventRegistration.html",
    },
    requestChunkSize: 10,
    ageDisclaimer: {
      message: "Children under 8 must be accompanied by an adult",
      ageGroupIds: [12, 13, 1050, 1051, 1052], // This is a list of ID's from evanced where the category is for ages under 8 so this message can be displayed with the event card, https://bcpl.evanced.info/api/signup/agegroups
    },
    eventDetailsError: {
      message:
        "There was a problem loading this event's details. Please select a different event.",
    },
    dateOffsets: {
      registrationStart: {
        numberOfUnits: 365,
        unit: "days",
      },
      registrationEnd: {
        numberOfUnits: 0,
        unit: "days",
      },
    },
    analytics: {
      bcplEventsCategory: "BCPL Events",
    },
  };

  app.constant("events.CONSTANTS", constants);
})();
