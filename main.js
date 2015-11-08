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
 *	Sets lightbox to specified gallery entry
 */
var setSelected = function(index) {
	var gallery = document.getElementById('gallery');
	var numChildren = gallery.childElementCount;

	if(index != null && index >= 0 && numChildren >= 0 && index < numChildren) {
		var entry = gallery.children[index]; // use childNode for < IE 9
		
		// Changes lightbox to the specified element
		// Assumes entry structure of 2 children elements, img and figcaption
		var selected = document.getElementById('lightbox-selected');
		selected.replaceChild(entry.children[0].cloneNode(true), selected.children[0]) 
		selected.replaceChild(entry.children[1].cloneNode(true), selected.children[1])
	}
	else{
		console.log('Error setting lightbox');
	}
}

/**
 *	Creates and appends elements to DOM
 */
var appendImages = function(photos, num_photos) {
	var gallery = document.getElementById('gallery');
	for(var i = 0; i < num_photos; i++) {
		var curr = photos[i];
		
		// creates dom elements
		var figure = document.createElement('figure');
		var img = document.createElement('img');
		var figcaption = document.createElement('figcaption');
		
		// insert api data
		img.className = 'photo';
		img.src = 'https://farm'+curr.farm+'.staticflickr.com/'+curr.server+'/'+curr.id+'_'+curr.secret+'_z.jpg';
		
		figcaption.className = 'caption';
		figcaption.innerHTML = curr.title;
		
		figure.appendChild(img);
		figure.appendChild(figcaption);
		figure.className = 'entry';
		// IIFE, creates scope for 'i'
		(function(index, entry){
			entry.addEventListener("click", function() {
				setSelected(index)
			});
  	 })(i, figure);
		
		gallery.appendChild(figure);
	}
};

/**
 *	Asynchronously gets images from flickr 
 */
var loadImages = function(num) {
	// API url
	var api_key = '7b408cc78c673ca31f5f105d9a28c601';
	var user_id = '110189904@N02' 	// my friend's flickr id
	var base_url = 'https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=';
	var user = '&user_id=' + user_id;
	var format = '&format=json&nojsoncallback=1'	// json not jsonp
	var url = base_url + api_key + user + format;

	// Flickr API call
	ajaxCall(url, function(response) {
		var data = JSON.parse(response);	// Assumes response is in json format
		if(data.stat != 'fail') {
			var photos = data.photos.photo;
			var num_photos = Math.min(photos.length, num);
			
			appendImages(photos, num_photos);		// Appends to gallery
			setSelected(0);		// Sets first image to be selected in lightbox
		}
		else {
			console.log('API call error');	
		}
	});
};

/**
 * 	Initializes page
 */
var init = function() {
	// Currently only loading 25
	// could load more by adding a 'page' parameter to the Flickr api call
	// Automatic loading when scrolling to the bottom would be cool too :)
	loadImages(25);
	
	// initalizes next and back navigation
	var index = 0;
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