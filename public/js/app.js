var mfModule = angular.module('mfModule',['ngRoute']);

mfModule.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/mfRes",{ templateUrl: "partials/mfResults.jade"})
        .when("/mfRes/:id", { templateUrl: "../partials/details.jade" })
        .otherwise("/");
}]);

//mfModule.config(['$routeProvider', function($routeProvider) {
//    $routeProvider
//        .when("/mf", { templateUrl: "partials/mfResults.jade", controller: "MainCtrl" })
//        .when("/details", { templateUrl: "partials/details.jade", controller: "MainCtrl" })
//        .otherwise({ redirectTo: "/" });
//}]);
//mfModule.controller("MainCtrl", function($scope) {
//    console.log('main controller invoked');
//});
//mfModule.directive('bartMap',function(){
//    var map;
//    var mtgsPinLayer = new Microsoft.Maps.EntityCollection();
//
//    return {
//        restrict : 'A',
//        link: function(scope,elem,attrs){
//            //Create the map, and replace the initial div with it
//            Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', {
//                callback: function(){
//                    console.log('calling directive mtgs-map');
//                    //Setup the default map options, and set your API key....
//                    var mapOptions = {
//                        credentials: "AucmoT6cAyH9TeXeGGqsB8LIYoJhvs-zciuv2aS1N04nujJw0_hZoP_wgC6l4bRN",
//                        center: new Microsoft.Maps.Location(47.5, -122.3),
//                        zoom: 9,
//                        mapTypeId: Microsoft.Maps.MapTypeId.road,
//                        theme: new Microsoft.Maps.Themes.BingTheme()
//
//                        //Play with these other options if you like:
//                        //showDashboard: true,
//                        //showScalebar: false,
//                        //enableClickableLogo: false,
//                        //enableSearchLogo: false,
//                        //showMapTypeSelector: true,
//                        //showBreadcrumb: false
//                    };
//
//                    //Initialize the map control
//                    map = new Microsoft.Maps.Map(elem[0], mapOptions);
//                    //Add the (initially empty) stationPinLayer
//                    map.entities.push(mtgsPinLayer);
//
//                }
//            });
//        }
//    }
//
//});
mfModule.directive("mtgsPaginate", function () {
    var template = "<div ></div>";
    return {
        restrict:'A',

        link: function(scope,elem,attrs){
            scope.$watch('locationResults', function (locationResults) {
                if(locationResults) {
                    scope.totalCount = locationResults.TotalCount;

                    if(Math.floor((scope.totalCount - ((scope.page-1)*scope.resPerPage))/scope.resPerPage )>=1){
                        console.log(Math.floor((scope.totalCount - ((scope.page-1)*scope.resPerPage))/scope.resPerPage ));
                        scope.nextText = ' Next ' + scope.resPerPage + ' Results';
                        scope.paginationText = 'Results '+ ((scope.page-1)*scope.resPerPage + 1) + '-' + (scope.page*scope.resPerPage) + ' of ' + scope.totalCount;

                    }else{
                        scope.nextText = '';
                        scope.paginationText = 'Results '+ ((scope.page-1)*scope.resPerPage + 1) + '-' + scope.totalCount + ' of ' + scope.totalCount;
                    }

                    if(scope.page>1){
                        scope.prevText = ' Previous ' + scope.resPerPage + ' Results';
                    }else{
                        scope.prevText = '';
                    }
                    console.log(scope.paginationText );
                    console.log(scope.nextText);
                    console.log('from inside directive - Total count = ' + scope.totalCount);
                }
            })
        }


    }
});

mfModule.directive("mtgsMap", function () {

    //Initialize a variable to reference the Bing map control.
    var map;
    var mtgsPinLayer = new Microsoft.Maps.EntityCollection();

    return {
        restrict: 'A', //require the mtgs-map "A"ttribute on the target element
        link: function (scope, elem, attrs) {
            var map = null;
            var infobox;
            var mtgsPinLayer = new Microsoft.Maps.EntityCollection();
            var infoboxLayer = new Microsoft.Maps.EntityCollection();


            //Create the map, and replace the initial div with it
            Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', {
                callback: function () {

                    //Setup the default map options, and set your API key....
                    var mapOptions = {
                        credentials: "AucmoT6cAyH9TeXeGGqsB8LIYoJhvs-zciuv2aS1N04nujJw0_hZoP_wgC6l4bRN", //get your api key from http://www.bingmapsportal.com
                        mapTypeId: Microsoft.Maps.MapTypeId.road,
                        zoom: 12,
                        //center: new Microsoft.Maps.Location(40.73, -73.67),
                        theme: new Microsoft.Maps.Themes.BingTheme(),

                        //Play with these other options if you like:
                        showDashboard: true,
                        showScalebar: true,
                        //enableClickableLogo: false,
                        //enableSearchLogo: false,
                        //showMapTypeSelector: true,
                        showBreadcrumb: true
                    };

                    //Initialize the map control
                    map = new Microsoft.Maps.Map(elem[0], mapOptions);

                    //Add the (initially empty) mtgsPinLayer
                    map.entities.push(mtgsPinLayer);
                    map.entities.push(infoboxLayer);

                    infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false, offset: new Microsoft.Maps.Point(0, 20) });
                    infoboxLayer.push(infobox);
                }
            });

            //Watch for the $scope.position value to change.  If it doesn, re-center the view
//            scope.$watch('position', function (value) {
//                if (value.latitude && map) {
//                    var centerLocation = new Microsoft.Maps.Location(scope.position.latitude, scope.position.longitude);
//                    map.setView({ center: centerLocation });
//                    var pin = new Microsoft.Maps.Pushpin(centerLocation);
//                    map.entities.push(pin);
//                }
//            });
//
            //Watch for the $scope.locations  to change.  If they do, create their pushpins
            scope.$watch('locations', function (locations) {
                console.log('locations updated');
                console.log(locations);
//                console.log(Object.prototype.toString.call(locations));
                console.log(map);
                if (Object.prototype.toString.call(locations) == "[object Array]" && map) {
                    console.log('inside if');
                    //Empty the collection
                    mtgsPinLayer.clear();
                    locations.forEach(function (location,key) {
                        var mtgLocation = new Microsoft.Maps.Location(location.Address.GPSCoordinates.Latitude, location.Address.GPSCoordinates.Longitude);
                        var mtgPin = {
                            icon: '/MF/img/bubble-icon.png',
                            width: 18,
                            height: 24,
                            text : key
                        };

                        var mtgPushPin = new Microsoft.Maps.Pushpin(mtgLocation, mtgPin);
                        mtgPushPin.Title=location.Name;
                        mtgPushPin.Description = location.Address.Address1 + ' ' +location.Address.Address2 + ' ' + location.Address.City + ' ' + location.Address.ZipCode;

                        Microsoft.Maps.Events.addHandler(mtgPushPin, 'click', displayInfobox);
                        //console.log(mtgPushPin);
                        //console.log(mtgLocation);
                        mtgsPinLayer.push(mtgPushPin);
                    });

                    function displayInfobox(e) {
                        console.log(e.target);
                        if (e.targetType == 'pushpin') {
                            infobox.setLocation(e.target.getLocation());
                            infobox.setOptions({ visible: true, title: e.target.Title, description: e.target.Description});
                        }
                    }

                    scope.$watch('center', function (center) {
                        console.log('center changed');
                        map.setView({center:new Microsoft.Maps.Location(center.latitude,center.longitude)});
                    })

                }
            });
        }
    }
});
