(app => {
    'use strict';

    const flatPickrFactory = $window => {
        return $window.flatpickr;
    };

    flatPickrFactory.$inject = ['$window'];

    app.factory('_flatpickr', flatPickrFactory);
})(angular.module('eventsPageApp'));
