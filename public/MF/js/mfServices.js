'use strict';

mfModule.factory('mfService', function( $http, $log, $q,$window,$rootScope, $filter){


    var service = {

        searchMeetingLocations : function(searchCriteria){
            $log.debug(" mfService.searchMeetingLocations invoked : " );
            console.log(searchCriteria);
            return $http({
                method:'POST',
                url: 'https://mobile.weightwatchers.com/MeetingsService.svc/Find',
                data:searchCriteria
            }).then(function(response){
                console.log(response);
                return response;
            },function(response){
                return $q.reject(response);
            });
        },
        getLocationDetails: function(location){
            $log.debug(" mfService.getLocationDetails invoked for : " );
            //console.log(location);
            return $http({
                method:'POST',
                url: 'https://mobile.weightwatchers.com/MeetingsService.svc/details',
                data: location
//                data:{"Id":1184030,"Latitude":"40.777618","Longitude":"-73.779821"}
            }).then(function(response){

                return response;
            },function(response){
                return $q.reject(response);
            });
        },
//        getLocationsHttp: function(lon, lat) {
//            $log.info("lon: " + lon);
//            var url = "https://spatial.virtualearth.net/REST/v1/data/e8c7dd36fbae4a21b22843820e21616f/WWUSMFDATAQA/WWMeetingLocations?spatialFilter=nearby(40.777618,-73.779821,75)&$select=Location_ID,LocationName,AddressLine,Locality,AdminDistrict,PostalCode,Latitude,Longitude,__Distance&$top=10&key=AucmoT6cAyH9TeXeGGqsB8LIYoJhvs-zciuv2aS1N04nujJw0_hZoP_wgC6l4bRN&$format=json";
//            console.log(url);
//            return $http({  method: 'GET',
//                url: url,
//                headers : {
//                    'Content-Type' : 'application/json',
//                    'crossDomain' : true
//                }
//            })
//                .success(function(d) { $log.info("Successfully retrieved locations from BING."); })
//                .error(function(d) { $log.info("Error retrieving locations from BING"); })
//                .then(function(response) {
//                    var data = response.data.d.results;
//                    var results = [];
//                    for (var locIndex in data)
//                    {
//                        // Skip the first result because its an object
//                        $log.info(data[locIndex].AddressLine + ", " + data[locIndex].Locality + ", " + data[locIndex].PostalCode);
//
//                        results.push(
//                            {
//                                address: data[locIndex].AddressLine,
//                                city: data[locIndex].Locality,
//                                zip: data[locIndex].PostalCode,
//                                locationId : data[locIndex].Location_ID
//                            });
//                    }
//
//                    return results;
//                });
//        },
        getGeoLocation : function(){
            console.log('get geo location invoked');
            var deferred = $q.defer();
            if (!$window.navigator) {
                return 'Geolocation is not supported';
            }else {
                $window.navigator.geolocation.getCurrentPosition(function (position) {
                    $rootScope.$apply(function () {
                        deferred.resolve(position);
                    });
                }, function (error) {
                    $rootScope.$apply(function () {
                        deferred.reject(error);
                    });
                });
            }

            return deferred.promise;
        },
        sharedData : {}


    };

    return service;
});