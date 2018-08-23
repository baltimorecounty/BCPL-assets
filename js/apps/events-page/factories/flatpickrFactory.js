(app => {
    'use strict';

    const flatPickrFactory = $window => {
        if ($window.flatpickr) {
        }
        return $window.flatpickr;
    };

    flatPickrFactory.$inject = ['$window'];

    app.factory('_flatpickr', flatPickrFactory);
})(angular.module('eventsPageApp'));
