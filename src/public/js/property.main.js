var map;
var marker;
var key = "&key=AIzaSyBwhrpQUNvleCxLuHiF1MGJ9Xo_801P2zk";
var coord_requrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var name_requrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
document.addEventListener("DOMContentLoaded", function (event) {

    bodyLoaded();
    selectSetCountry();
    selectSetState();
});

function initMap(latitude, longitude) {

    var center = new google.maps.LatLng(-51.2833, 36.8167);
    var mapcanvas = document.getElementById('mymap');
    var mapoptions = {
        center: center,
        zoom: 15,
        panControl: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        rotateControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapcanvas, mapoptions);
    marker = new google.maps.Marker({
        position: center,
        map: map,
        draggable: true
    });


    google.maps.event.addListener(marker, 'dragend', function (event) {
        var latitude = parseFloat(event.latLng.lat());
        var longitude = parseFloat(event.latLng.lng());
        console.log(latitude + ', ' + longitude);
        setMapevent(latitude, longitude);
        getlocationName(latitude, longitude);
    });
}

function setMapevent(lat, lng) {
    marker.setPosition(new google.maps.LatLng(lat, lng));
    map.setZoom(15);
    map.setCenter({lat: lat, lng: lng});
    $("#hidden_latitude").val(lat);
    $("#hidden_longitude").val(lng);
}

function bodyLoaded() {
    $(".chosen-select").chosen();

    $('#inputCountry').chosen().change(async function () {
        var country = $("#inputCountry option:selected").text();
        var location = await getCordinateByName(country);
        setMapevent(location.coordinate.lat, location.coordinate.lng);
    });
    $('#inputCounty').chosen().change(async function () {
        var country = $("#inputCountry option:selected").text();
        var county = $("#inputCounty option:selected").text();
        var location = await getCordinateByName(county + "+" + country);
        setMapevent(location.coordinate.lat, location.coordinate.lng);
    });
    $('#inputregion').chosen().change(async function () {
        var country = $("#inputCountry option:selected").text();
        var county = $("#inputCounty option:selected").text();
        var region = $("#inputregion option:selected").text();
        var location = await getCordinateByName(region + "+" + county + "+" + country);
        setMapevent(location.coordinate.lat, location.coordinate.lng);
    });

}

async function getCordinateByName(name) {
    var location = {
        address: "",
        coordinate: {}
    };
    var requrl = coord_requrl + name + key;
    await $.getJSON(requrl, function (data) {
        location.coordinate = data.results[0].geometry.location;
        location.address = data.results[0].formatted_address;
    });
    setMaplocationtext(location.address);
    return location;
}

async function getlocationName(lat, lng) {
    var location = {
        address: "",
        coordinate: {}
    };
    var requrl = name_requrl + lat + "," + lng + key;
    await $.getJSON(requrl, async function (data) {

        location.address = await generateAddressArray(data.results);
        console.log("my",location);
        setMaplocationtext(location.address);
    });
}

function setMaplocationtext(address) {
    $("#maplocationtext").text(address);
    $("input[name=address]").val(address);
}

const generateAddressArray = (addressarray) => {

    let addressholderArray = []
    var address;
    for (var i = 0; i < addressarray.length; i++) {
        var address = addressarray[i].formatted_address.split(",").reverse();
        if (address.length > 3) {
            addressholderArray.push(address.slice(0, 2));
        } else {
            addressholderArray.push(address)
        }

    }
    addressholderArray.sort(function (a, b) {
        return b.length - a.length;
    });
    return addressholderArray[0];
}
const selectSetCountry = async () => {
    let countries = await fetch("/data/countries.json").then(function (response) {
        return response.json();
    });
    var option = "";
    countries.forEach((country) => {
        option += "<option value='" + country.code + "'>" + country.name + "</option>";
    });
    $("#inputCountry").html(option);
    setCountry();
    selectSetState();

}
const selectSetState = async () => {
    let states = await fetch("/data/kestate.json").then(function (response) {
        return response.json();
    });
    var option = "";
    states.forEach((state) => {
        option += "<option value='" + state.code + "'>" + state.name + "</option>";
    });
    $("#inputCounty").html(option);
}
function setCountry() {
    
    $.get("https://ipinfo.io", function (response) {
        $('#inputCountry').val(response.country);
        $('#inputCounty').val(response.city);
        $('.chosen-select').trigger("chosen:updated");
        var loc = response.loc.split(',');
        var lat = parseFloat(loc[0]);
        var lng = parseFloat(loc[1]);
        setMapevent(lat, lng);
        setMaplocationtext(response.country+response.city);
    }, "jsonp");
}