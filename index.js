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
    // Remove previous (if any)
    localforage.removeItem(filename);
    // Save the new file
    localforage.setItem(filename, contents).then(listSongs);
  };
  reader.readAsArrayBuffer(file);
}

function listSongs() {
  listing = document.getElementById('listing');
  listing.innerText = 'Loading...';
  localforage.keys().then(
    keys => {
      if (keys.length > 0) {
        listing.innerText = "";
        for (const k of keys) {
          listSong(listing, k);
        }
      } else {
        listing.innerText = "No songs";
      }
    });
}

function clickPlayCallback(key) {
  return () => {
    localforage.getItem(key).then(value => {
      document.getElementById("playing").innerText = key;
      const audio = document.getElementById("player");
      audio.src = window.URL.createObjectURL(new Blob([value]));
      audio.play();
    });
  }
}

function clickRemoveSong(key) {
  return () => localforage.removeItem(key).then(listSongs);
}

function listSong(listing, key) {
  var p = document.createElement('p');
  var label = document.createElement('span');
  var spacer = document.createElement('span');
  var button = document.createElement('button');
  var rm = document.createElement('button');

  label.innerText = key;
  spacer.innerHTML= '&nbsp;&nbsp;';
  button.addEventListener('click', clickPlayCallback(key));
  button.innerText = "♫";
  rm.addEventListener('click', clickRemoveSong(key));
  rm.innerText = 'x';

  listing.appendChild(p);
  p.appendChild(button);
  p.appendChild(rm);
  p.appendChild(spacer);
  p.appendChild(label);
}

listSongs();

document.getElementById('song-from-file').addEventListener('change', loadSongFromFile, false);

