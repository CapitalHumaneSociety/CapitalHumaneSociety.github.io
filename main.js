//Temporary CSV files for data entry - replace with database at later date
let URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAypGns6yfeFXjIjBsw71TC8HSqDn2KO0LId3qwDdY50euIk2P2Rz5ywWoS5YcFO3aUrT9vt0resGo/pub?gid=0&single=true&output=csv"

window.addEventListener("DOMContentLoaded", init);

//create map and sidebar
let map;
let sidebar;
let panelID = "my-info-panel";

//load map and sidebar panel on start
function init() {
    map = L.map("map").setView([40.8136, -96.68170], 12);

    //load map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //create sidebar
    sidebar = L.control.sidebar({
        container: "sidebar",
        closeButton: true,
        position: "right",
    }).addTo(map);
    
    //Create panel content to be loaded before a map point is selected
    let panelContent = {
        id: panelID,
        tab: "<i class='fa fa-bars active'></i>",
        pane: "<p id='sidebar-content'>Select a point on the map to display animal info.</p>",
        title: "<h2 id='sidebar-title'>Nothing selected</h2>",
    };
    sidebar.addPanel(panelContent);

    //close sidebar when the map is clicked
    map.on("click", function () {
        sidebar.close(panelID);
    }); 

    //grab CSV files
    Papa.parse(URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: addPoints,
    });
}

//add markers to map from CSV (change to database at later date)
function addPoints(data) {
    data = data.data;

    //set up marker clusters when markers too close to one another
    let cluster = L.markerClusterGroup().addTo(map);

    //create subgroups of cluster group to avoid breaking layer control
    let lostCatGroupLayer = L.featureGroup.subGroup(cluster).addTo(map);
    let lostDogGroupLayer = L.featureGroup.subGroup(cluster).addTo(map);
    let foundCatGroupLayer = L.featureGroup.subGroup(cluster).addTo(map);
    let foundDogGroupLayer = L.featureGroup.subGroup(cluster).addTo(map);
    let lostOtherGroupLayer = L.featureGroup.subGroup(cluster).addTo(map);
    let foundOtherGroupLayer = L.featureGroup.subGroup(cluster).addTo(map);

    //add layers to group for layer control
    let overlayMaps = {
        "Lost Cats": lostCatGroupLayer,
        "Lost Dogs": lostDogGroupLayer,
        "Found Cats": foundCatGroupLayer,
        "Found Dogs": foundDogGroupLayer,
        "Other Lost": lostOtherGroupLayer,
        "Other Found": foundOtherGroupLayer,
    }

    //create layer control
    layerControl = L.control.layers(null, overlayMaps, {
        position: "topleft",
        collapsed: false,
    }).addTo(map);

    //add markers to layers based on designation in csv (change to database at later date)
    for(let row = 0; row < data.length; row++) {
        if (data[row].type == "lost cat") {
            let marker;
            
            //create marker and give alt name for screen reader
            marker = L.marker([data[row].lat, data[row].lon],
                {alt: 'Lost cat'});
        
            marker.addTo(lostCatGroupLayer);

            marker.addTo(cluster);

            //create features from CSV rows
            marker.feature = {
                properties: {
                    name: data[row].name,
                    breed: data[row].breed,
                    color: data[row].color,
                    age: data[row].age,
                    sex: data[row].sex,
                    date: data[row].date,
                    photo: data[row].photo,
                    owner: data[row].owner,
                    phone: data[row].phone,
                    address: data[row].address,
                },
            };

            //put information into sidebar when marker is clicked and also on keypress for keyboard only users
            marker.on({
                click: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you have found a cat matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
                keydown: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you have found a cat matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
            });
        }    

        //repeat for dogs/other/found pets - can probably condense this at a later date
        if (data[row].type == "lost dog") {
            let marker;
        
            marker = L.marker([data[row].lat, data[row].lon],
                {alt: "Lost dog"});
        
            marker.addTo(lostDogGroupLayer);

            marker.feature = {
                properties: {
                    name: data[row].name,
                    breed: data[row].breed,
                    color: data[row].color,
                    age: data[row].age,
                    sex: data[row].sex,
                    date: data[row].date,
                    photo: data[row].photo,
                    owner: data[row].owner,
                    phone: data[row].phone,
                    address: data[row].address,
                },
            };
            marker.on({
                click: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you have found a dog matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
                keydown: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you have found a dog matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
            });
        }    

        if (data[row].type == "found cat") {
            let marker;
        
            marker = L.marker([data[row].lat, data[row].lon],
                {alt: "Found cat"});
        
            marker.addTo(foundCatGroupLayer);

            marker.feature = {
                properties: {
                    name: data[row].name,
                    breed: data[row].breed,
                    color: data[row].color,
                    age: data[row].age,
                    sex: data[row].sex,
                    date: data[row].date,
                    photo: data[row].photo,
                    owner: data[row].owner,
                    phone: data[row].phone,
                    address: data[row].address,
                },
            };
            marker.on({
                click: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you are missing a cat matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
                keydown: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you are missing a cat matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
            });
        } 

        if (data[row].type == "found dog") {
            let marker;
        
            marker = L.marker([data[row].lat, data[row].lon],
                {alt: "Found dog"});
        
            marker.addTo(foundDogGroupLayer);

            marker.feature = {
                properties: {
                    name: data[row].name,
                    breed: data[row].breed,
                    color: data[row].color,
                    age: data[row].age,
                    sex: data[row].sex,
                    date: data[row].date,
                    photo: data[row].photo,
                    owner: data[row].owner,
                    phone: data[row].phone,
                    address: data[row].address,
                },
            };
            marker.on({
                click: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you are missing a dog matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
                keydown: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you are missing a dog matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
            });
        }    
    
        if (data[row].type == "other lost") {
            let marker;
        
            marker = L.marker([data[row].lat, data[row].lon],
                {alt: "Other lost"});
        
            marker.addTo(lostOtherGroupLayer);

            marker.feature = {
                properties: {
                    name: data[row].name,
                    breed: data[row].breed,
                    color: data[row].color,
                    age: data[row].age,
                    sex: data[row].sex,
                    date: data[row].date,
                    photo: data[row].photo,
                    owner: data[row].owner,
                    phone: data[row].phone,
                    address: data[row].address,
                },
            };
            marker.on({
                click: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you have found a pet matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
                keydown: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you have found a pet matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
            });
        }    
   
        if (data[row].type == "other found") {
            let marker;
        
            marker = L.marker([data[row].lat, data[row].lon],
                {alt: "Other found"});
        
            marker.addTo(foundOtherGroupLayer);

            marker.feature = {
                properties: {
                    name: data[row].name,
                    breed: data[row].breed,
                    color: data[row].color,
                    age: data[row].age,
                    sex: data[row].sex,
                    date: data[row].date,
                    photo: data[row].photo,
                    owner: data[row].owner,
                    phone: data[row].phone,
                    address: data[row].address,
                },
            };
            marker.on({
                click: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you are missing a pet matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
                keydown: function (e) {
                    L.DomEvent.stopPropagation(e);
                    document.getElementById("sidebar-title").innerHTML = 
                    e.target.feature.properties.name;
                    document.getElementById("sidebar-content").innerHTML = 
                    ("Breed: " + e.target.feature.properties.breed + "<br>Color: " + e.target.feature.properties.color + "<br>Age: " + e.target.feature.properties.age + "<br>Sex: " + e.target.feature.properties.sex + "<br>Address: " + e.target.feature.properties.address + "<br>Reported on: " + e.target.feature.properties.date + '<br> <br>If you are missing a pet matching this description, please contact: <br>' + e.target.feature.properties.owner + '<br>' + e.target.feature.properties.phone + '<br> <br>' + e.target.feature.properties.photo);
                    sidebar.open(panelID);
                },
            });
        }    
    }
}


