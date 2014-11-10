mfModule.controller('mfController',['$scope', 'mfService',function($scope ,mfService){
    $scope.init = function(){
        console.log('mfController invoked');
        $scope.criteria ={};
        $scope.locations = [];
        $scope.loaded = false;
        $scope.position={};

        $scope.page = 1;
        $scope.resPerPage = 5;
        $scope.paginationText='';

        $scope.showdetails=false;
//        mfService.getLocationsHttp(40.777618,-73.779821).then(function(data){
//            console.log(data);
//        });
        $scope.zipcode=10010;
        $scope.mapData={};
        //$scope.totalCount=0;
        $scope.getMeetingLocations($scope.zipcode,$scope.page);
        $scope.center = {};
        $scope.showSearchBox=false;
        //$scope.GetMap();
        mfService.getGeoLocation().then(function(data){
            $scope.position=data;
            console.log($scope.position);
            $scope.center.latitude = $scope.position.coords.latitude;
            $scope.center.longitude = $scope.position.coords.longitude;
        })
    };

    $scope.getMeetingLocations = function(zip,page){
        //console.log('Results '+ (($scope.page-1)*$scope.resPerPage + 1) + '-' + ($scope.page*$scope.resPerPage));
        $scope.zipcode = zip;
        //console.log('method called with zipcode '+ $scope.zipcode);
        $scope.criteria = {"Page":page,"Count":$scope.resPerPage,"Type":"Zip","Country":"US","ZipCode":$scope.zipcode};
        mfService.searchMeetingLocations($scope.criteria).then(function(response){
            $scope.loaded=true;
            $scope.locationResults = response.data;
            $scope.locations=response.data.Locations;
            //$scope.totalCount=response.data.TotalCount;
            //$scope.paginationText = 'Results '+ (($scope.page-1)*$scope.resPerPage + 1) + '-' + ($scope.page*$scope.resPerPage) + ' of ' + $scope.totalCount;

            //console.log($scope.paginationText );
            console.log($scope.locations);

            var count = 0;
            var center={};
            //$scope.mapData = {"center":'',zoom:11,infobox:""};
            angular.forEach($scope.locations, function(location){
                //console.log(loc);
                count++;
                var loc = {"Id":location.Id,"Latitude":location.Address.GPSCoordinates.Latitude,"Longitude":location.Address.GPSCoordinates.Longitude};
                if(count==1){
                    center={"center":location.Address.GPSCoordinates.Latitude + ' ' + location.Address.GPSCoordinates.Longitude};
                    $scope.center = {
                        latitude : location.Address.GPSCoordinates.Latitude,
                        longitude : location.Address.GPSCoordinates.Longitude
                    }
                }
                //mapData.infobox+=
                mfService.getLocationDetails(JSON.stringify(loc)).then(function(response){
                    location.Detail=response.data;
                    //console.log(location);
                });

            })
        })
    };

    $scope.detectLocation = function() {
        if (navigator.geolocation) {
            var timeoutVal = 10 * 1000 * 1000;
            navigator.geolocation.getCurrentPosition(
                function(response){
                    console.log(response)
                },
                function(error){
                    console.log(error)
                },
                { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
            );
        }
        else {
            alert("Geolocation is not supported by this browser");
        }
    };

    $scope.showDetails = function(){
        console.log('button clicked');
        $('#basic-modal-content-2').modal();
//        return false;
//        $scope.showdetails=true;
    };
    $scope.hideModal = function(){
        $.modal.close();
    };

    $scope.changeZip = function(){
        $('#basic-modal-content').modal();
    };
    var map = null;
    $scope.GetMap = function()
    {
        console.log('calling map');
        Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', { callback: $scope.themesModuleLoaded() });
    };

    $scope.themesModuleLoaded = function()
    {
        // Load the map using the Bing theme style.
        map = new Microsoft.Maps.Map(document.getElementById("myMap"), {credentials: "AucmoT6cAyH9TeXeGGqsB8LIYoJhvs-zciuv2aS1N04nujJw0_hZoP_wgC6l4bRN", center: new Microsoft.Maps.Location(47.5, -122.3), zoom: 9, theme: new Microsoft.Maps.Themes.BingTheme() });

    };

    $scope.incrementPage = function(incr){
        $scope.page+=incr;
        console.log('page number = ' + $scope.page);
    };

    $scope.setSharedData = function(loc){
        mfService.sharedData = loc;
        console.log(mfService.sharedData );
    };


//    function showMap() {
//        window.appMenu.setTitle(locale.navTitles.finder);
//        appMenu.templateSubMenu($('#map-submenu-template'));
//        appMenu.toggleMenu('submenu');
//
//        mainView.template = $('#meeting-map-template');
//        mainView.render();
//
//        $("#map-list-toggle").removeClass('hidden');
//
//        $('#map-list-toggle').attr('href', window.navrules.url(window.navrules.mobile_finder_results_list.routeKey()));
//
//        var resultData, requestData;
//        //Map stuff//
//        if (typeof window.appState.getItem('requestData') !== "undefined")
//            requestData = JSON.parse(window.appState.getItem('requestData'));
//
//        if (typeof window.appState.getItem('FinderData') !== "undefined")
//            finderData = JSON.parse(window.appState.getItem('FinderData'));
//
//        Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', { callback: function () {
//            var map = new Microsoft.Maps.Map(document.getElementById('map'), {
//                credentials: config.bingMapsKey,
//                showScalebar: false,
//                theme: new Microsoft.Maps.Themes.BingTheme(),
//                useInertia: false,
//                showMapTypeSelector: false,
//                enableSearchLogo: false,
//                showBreadcrumb: false
//            });
//
//            map.entities.clear();
//
//            var offset = new Microsoft.Maps.Point(0, 5);
//            var pushpinOptions = { text: '1', visible: true, textOffset: offset };
//
//            if (typeof finderData !== 'undefined' && finderData !== null) {
//                // var locations = resultData.Locations;
//                var locations = finderData;
//                var startCount = (window.appState.getItem('FinderPage') * 10) - 9;
//                var firstPin = locations[startCount];
//
//                map.setView({ center: new Microsoft.Maps.Location(firstPin.Address.GPSCoordinates.Latitude, firstPin.Address.GPSCoordinates.Longitude), zoom: 11 });
//
//                var location = null,
//                    clickEvent,
//                    pushpin,
//                    Infobox;
//
//                var pushpinClick = function (pin) {
//                    var location = this.target.getLocation();
//                    map.setView({ center: new Microsoft.Maps.Location(location.latitude + 0.05, location.longitude + 0.07), zoom: 11 });
//                };
//
//                var logEvent = function (evt) {
//
//
//                    window.location.hash = evt.target._options.link;
//                };
//
//                for (location in locations) {
//
//                    pushpinOptions.text = (parseFloat(location)) + "";
//
//                    pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(locations[location].Address.GPSCoordinates.Latitude, locations[location].Address.GPSCoordinates.Longitude), pushpinOptions);
//                    clickEvent = Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClick);
//
//                    var infoboxOptions =
//                    {
//                        link: window.navrules.relative( window.navrules.mobile_finder_result.routeKey() ) + locations[location].Id,
//                        pushpin: pushpin,
//                        title: '<a href="' + window.navrules.relative( window.navrules.mobile_finder_result.routeKey() ) + locations[location].Id + '">' + locations[location].Name + '</a>',
//                        description: '<a href="' + window.navrules.relative( window.navrules.mobile_finder_result.routeKey() ) + locations[location].Id  + '">' + locations[location].Address.Address1 + '<br /> <span class="moreinfo">' +  finder_locale.finder.result.moreInfo + '</span></a>'
//
//                    };
//
//                    var infoBox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(locations[location].Address.GPSCoordinates.Latitude, locations[location].Address.GPSCoordinates.Longitude), infoboxOptions);
//                    Microsoft.Maps.Events.addHandler(infoBox, 'click', logEvent);
//                    map.entities.push(infoBox);
//                    map.entities.push(pushpin);
//                }
//            }
//        }
//        });
//
//    };

}]);

mfModule.controller('locDetailsController',['$scope','$routeParams', 'mfService',function($scope ,$routeParams, mfService){
    $scope.init = function(){
        $scope.sharedData = mfService.sharedData;
        console.log($scope.sharedData);
    }
}]);