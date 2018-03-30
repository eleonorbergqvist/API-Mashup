var FLICKER_TOKEN = '';
var BIGHUGELABS_TOKEN = '';

$(function() {
    var searchInput = $('#searchInput');
    var searchButton = $('#searchButton');

    searchButton.click(function(e) {
        e.preventDefault();

        var searchTerm = searchInput.val();

        search(searchTerm);
    });

    function search(term) {
        getPhotos(term);
        getSynonyms(term);

        searchInput.val(term);
    }

    function getPhotos(term) {
        fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+FLICKER_TOKEN+'&text='+term+'&format=json&nojsoncallback=1')
        //fetch('flickr-fixture.json')
        .then(function(resp) {
            return resp.json();
        })
        .then(onDataReady);
    }

    function onDataReady(data) {
        var photos = data.photos.photo;
        
        photos = photos.map(function(photo){
            return {
                title: photo.title,
                image: "https://farm2.static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg",
                url: 'https://www.flickr.com/photos/' + photo.owner + '/' + photo.id + '/'
            }
        });

        updateList(photos);
    }

    function updateList(photos) {
        var cardsList = $('#cardsList');
        cardsList.empty();

        var elements = photos.map(createCardFactory);
        cardsList.append(elements);
    }

    function createCardFactory(photo) {
        return $(
            '<div class="card" style="width: 46rem;">'+
            '   <div class="card-body">'+
            '       <h5 class="card-title">'+photo.title+'</h5>'+
            '       <img style="display: block;" src="'+photo.image+'" />'+
            '       <a href="'+photo.url+'" class="card-link">Visit image</a>'+
            '   </div>'+
            ' </div>'
        );
    }

    // Suggested Words
    function getSynonyms(term) {
        fetch('http://words.bighugelabs.com/api/2/'+BIGHUGELABS_TOKEN+'/'+term+'/json')
        //fetch('synonyms-fixture.json')
        .then(function(resp) {
            return resp.json();
        })
        .then(onSynonymsReady)
    }

    function onSynonymsReady(data) {
        var words = data.noun.syn;
        updateSynonyms(words);
    }

    function updateSynonyms(words) {
        var synonymsList = $('#synonymsList');
        synonymsList.empty();

        var elements = words.map(createListFactory);
        synonymsList.append(elements);

        var suggestedInput = $('.suggestedInput');
        suggestedInput.click(function(e) {
            e.preventDefault();

            var term = $(this).text();
            search(term);
        });
    }

    function createListFactory(word) {
        return $(
            '<li class="list-group-item"><a class="suggestedInput" href="#">'+word+'</a></li>'
        );
    }
});