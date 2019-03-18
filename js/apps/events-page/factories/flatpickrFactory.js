/** Pattern for using a third party script as a injection */
(app => {
    'use strict';
    function FlatpickrFactory($window) {
        if (!$window.flatpickr) {
            // If lodash is not available you can now provide a
            // mock service, try to load it from somewhere else,
            // redirect the user to a dedicated error page, ...
        }
        return $window.flatpickr;
    }

    // Define dependencies
    FlatpickrFactory.$inject = ['$window'];

    // Register factory
    app.factory('flatpickr', FlatpickrFactory);
})(angular.module('eventsPageApp'));
