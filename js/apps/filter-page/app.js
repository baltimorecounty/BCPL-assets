(() => {
  "use strict";

  angular
    .module("filterPageApp", ["ngAnimate"])
    .config(function($locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    });
})();
