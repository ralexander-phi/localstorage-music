var statusDiv = document.getElementById('status');
statusDiv.innerText = "Script loading...";


var audio = document.getElementById("player");
var listing = document.getElementById('listing');
var nameField = document.getElementById('song-name');
var urlField = document.getElementById('song-url');

function loadSongFromFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.fileName = file.name;
  reader.onload = function(e) {
    var contents = e.target.result;
    var filename = e.target.fileName;
    storeSong(filename, contents);
  };
  reader.readAsArrayBuffer(file);
}

function loadSongFromUrl(e) {
  statusDiv.innerText = "Clicked load";
  var url = urlField.value;
  var name = nameField.value;
  urlField.value = '';
  nameField.value = '';

  var xhttp= new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      storeSong(name, xhttp.response);
    }
  };
  xhttp.responseType = "arraybuffer";
  xhttp.open("GET", url, true);
  xhttp.send();
  statusDiv.innerText = "Request running";
}

function storeSong(name, buffer) {
  statusDiv.innerText = "Storing " + name;
  // Remove previous (if any)
  localforage.removeItem(name);
  statusDiv.innerText = "Storing... " + name;
  localforage.setItem(name, buffer).then(listSongs);
}


function listSongs() {
  statusDiv.innerText = "Listing";
  listing.innerText = 'Loading...';
  localforage.keys().then(
    function(keys) {
      if (keys.length > 0) {
        listing.innerText = "";
        for (var k of keys) {
          listSong(listing, k);
        }
      } else {
        listing.innerText = "No songs";
      }
    }
  );
}

function clickPlayCallback(key) {
  return function() {
    statusDiv.innerText = "Playing " + key;
    localforage.getItem(key).then(
      function(value) {
      audio.src = window.URL.createObjectURL(new Blob([value]));
      audio.play();
    });
  };
}

function clickRemoveSong(key) {
  return function() {
    localforage.removeItem(key).then(listSongs);
  };
}

function listSong(listing, key) {
  var a = document.createElement('a');
  var label = document.createElement('span');
  var button = document.createElement('button');
  var rm = document.createElement('button');

  a.classList.add('panel-block');
  label.innerText = key;
  label.className = 'is-size-5';
  button.addEventListener('click', clickPlayCallback(key));
  button.innerText = "♫ Play";
  button.className = "button is-small is-primary is-light has-text-weight-bold mr-1";
  rm.addEventListener('click', clickRemoveSong(key));
  rm.className = "delete is-small mr-4";

  listing.appendChild(a);
  a.appendChild(button);
  a.appendChild(rm);
  a.appendChild(label);
}

listSongs();

document.getElementById('song-from-file').addEventListener('change', loadSongFromFile, false);
document.getElementById('load-song-url').addEventListener('click', loadSongFromUrl, false);

statusDiv.innerText = "Script loaded";
