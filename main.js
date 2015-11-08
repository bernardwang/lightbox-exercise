/**
 *	Ajax call helper function
 */
var ajaxCall = function(url, callback) {
	// IE7+, Firefox, Chrome, Opera, Safari
  var request = new XMLHttpRequest();
	request.open('GET', url, true);
  request.send();
	
  request.onreadystatechange = function() {
  	if(request.readyState == 4 && request.status == 200) { 	// readyState DONE status SUCCESSFUL
			callback(request.responseText);
  	}
  }
};

/**
 *	Asyncronously inserts images from flickr into the gallery
 */
var loadImages = function(num) {
	// api url
	var api_key = '7b408cc78c673ca31f5f105d9a28c601';
	var user_id = '110189904@N02' 	// my friend's flickr id
	var base_url = 'https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=';
	var user = '&user_id=' + user_id;
	var format = '&format=json&nojsoncallback=1'	// json not jsonp
	var url = base_url + api_key + user + format;

	// flickr api call
	ajaxCall(url, function(response) {
		var data = JSON.parse(response);	// assumes response is in json format
		if(data.stat != 'fail') {	// success!
			var photos = data.photos.photo;
			var gallery = document.getElementById('gallery');
			var num_photos = Math.min(photos.length, num);	// number of photos to load

			// appends photos to gallery
			for(var i = 0; i < num_photos; i++) {
				// creates dom elements
				var figure = document.createElement('figure');
				var img = document.createElement('img');
				var figcaption = document.createElement('figcaption');
				
				// insert api data
				var curr = photos[i];
				img.className = 'photo';
				img.src = 'https://farm'+curr.farm+'.staticflickr.com/'+curr.server+'/'+curr.id+'_'+curr.secret+'_z.jpg';
				figcaption.className = 'caption';
				figcaption.innerHTML = curr.title;
				figure.className = 'entry';
				
				// append to dom and entries array
				figure.appendChild(img);
				figure.appendChild(figcaption);
				gallery.appendChild(figure);
			}
			setSelected(0);
		}
		else {
			console.log('API call error');	
		}
	});
};

var setSelected = function(index) {
	var gallery = document.getElementById('gallery');
	var numChildren = gallery.childElementCount;
	if(index >= 0 && numChildren >= 0 && index < numChildren) {
		var selected = document.getElementById('lightbox-selected');
		var entry = gallery.children[index]; // use childNode for < IE 9
		selected.replaceChild(entry.children[0].cloneNode(true), selected.children[0]) // use childNode for < IE 9
		selected.replaceChild(entry.children[1].cloneNode(true), selected.children[1])
	}
}

var init = function() {
	var index = 0;
	loadImages(25);
	
	var back = document.getElementById('lightbox-back');
	var next = document.getElementById('lightbox-next');
	back.addEventListener("click", function(){
    setSelected(--index);
	});
	next.addEventListener("click", function(){
    setSelected(++index);
	});
	
};

init();