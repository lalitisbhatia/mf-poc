var map = null;
function GetMap()
{
    console.log('calling map');
    Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', { callback: themesModuleLoaded });
}

function themesModuleLoaded()
{
    // Load the map using the Bing theme style.
    map = new Microsoft.Maps.Map(document.getElementById("myMap"), {credentials: "AucmoT6cAyH9TeXeGGqsB8LIYoJhvs-zciuv2aS1N04nujJw0_hZoP_wgC6l4bRN", center: new Microsoft.Maps.Location(47.5, -122.3), zoom: 9, theme: new Microsoft.Maps.Themes.BingTheme() });

}


