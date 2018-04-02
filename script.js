/**************************************************************************************************  
* STORE stores the results from the mdb api search, as well as youtube keys and url 
****************************************************************************************************/
const STORE = {
    page: 1,
    totalPages: null,
    genre: null,
    searchType: null,
    YoutubeAPIKey: 'AIzaSyCp3p6J0vMOVgB4xtInEszElwMrR-Yq5JY',
    YoutubeURL: 'https://www.googleapis.com/youtube/v3/search'
};

/**************************************************************************************************  
* HTML to add the clips info from Youtube
* info includes title and clickable thumbnail to take user to video
****************************************************************************************************/
function clipsHTML(items) {

    return `
    <div class="movies">
    <p class="video-title"> ${items.snippet.title} </p>
    <a href="https://youtube.com/watch?v=${items.id.videoId}" target="_blank" id="thumbnail-img" role=none title="${items.snippet.title}-video-thumbnail">
    <img src="${items.snippet.thumbnails.medium.url}" alt="${items.snippet.title}-video-thumbnail"></a>
    </div>
    
    `
}

/**************************************************************************************************  
* callback function for Youtube API search
* displays the results of the clips related to title 
****************************************************************************************************/
function displayClips(data) {
    const clips = data.items.map(function (item) {
        return clipsHTML(item);
    });
    $('.js-results').html(clips);
}

/**************************************************************************************************  
* function searches Youtube API for titles of movies
****************************************************************************************************/
function searchYoutube(title) {
    const ajaxObject = {
        url: STORE.YoutubeURL,
        data: {
            part: 'snippet',
            key: STORE.YoutubeAPIKey,
            q: `${title}`,
            maxResults: 7,
            type: ''
        },
        dataType: 'json',
        type: 'GET',
        success: displayClips

    }

    $.ajax(ajaxObject);

}

/**************************************************************************************************  
* function handles click to watch clips of certain titles
****************************************************************************************************/
function handleClips() {

    $(document).on('click', '.watch-youtube', function (event) {
        event.preventDefault();
        const title = $(this).val();
        searchYoutube(title);

    });

}

/*************************************************************
 * function adds html for the movie titles, release date 
 * and the synopsis of the movie
 ***************************************************************/
function movieHTML(item) {

    return `
        <div class="movies"> 
            <option class="movie-title">${item.title} </option>
            <p><strong>Release Date:</strong> ${item.release_date}</p>
            <p><strong>Summary:</strong> ${item.overview}</p>
            <p class="watch"><strong>See:</strong></p>
            <div class="youtube-container">
                <button class="watch-youtube" value="${item.title}"><img src="./youtube-logo.png" alt="youtube-logo" class="youtube-logo"/></button>
            <div>
        </div>
    
    `
}

/*************************************************************
 * this is callback function from genre search
 * function maps over the data from the API and
 * calls addMovieHTML to display movies on page
 ***************************************************************/
function displayMovies(data) {
    STORE.totalPages = data.total_pages;

    const result = data.results.map(function (item) {
        return movieHTML(item);
    });

    $('.hidden').prop('hidden', false);
    $('.js-results').html(result);
    

    if(STORE.page > 1) {
        $('.js-results').append('<button class="search prev"> Prev </button>');
    }

    if(STORE.page < STORE.totalPages) {
        $('.js-results').append('<button class="search next"> Next </button>');
    }
    
}


/********************************************************* 
* Search MDBA API for movies of a specific genre or by popularity
***********************************************************/
function searchMovieAPI() {
    if (STORE.searchType === 'genre') {
       
        const settings = {
            url: `https://api.themoviedb.org/3/genre/${STORE.genre}/movies?api_key=ba52c91a2a4420e8af20bc1f8d3ae86f&language=en-US&include_adult=false&sort_by=created_at.asc&page=${STORE.page}`,
            success: displayMovies
        }
        $.ajax(settings);
    }
    else {
       
        const settings = {
            url: `https://api.themoviedb.org/3/discover/movie?api_key=ba52c91a2a4420e8af20bc1f8d3ae86f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${STORE.page}`,
            success: displayMovies
        }
        $.ajax(settings);

    }
    
}


/***************************************************************
 * function handles the next 20 results of the next page
 **********************************************************/
function handleNext() {

    $(document).on('click', '.next', function (event) {
        event.preventDefault();
        $(window).scrollTop(0);
        STORE.page++;
        searchMovieAPI();
        
    });

}

/***************************************************************
 * function handles the next 20 results of the next page
 **********************************************************/
function handlePrev() {

    $(document).on('click', '.prev', function (event) {
        event.preventDefault();
        $(window).scrollTop(0);
        STORE.page--;
        searchMovieAPI();
        
    });

}

/**************************************************************************************************  
* function handles initial search buttons for genres and popular movies
****************************************************************************************************/
function handleSearch() {

    $(document).on('click', '.search-by-genre', function (event) {
        event.preventDefault();
        
        let genre = $('#search-by-genre').val();
        STORE.genre = genre;
        STORE.searchType = 'genre';
        searchMovieAPI();
        
    });

    $(document).on('click', '.search-popular', function (event) {
        event.preventDefault();
       
        STORE.searchType = 'popular';
        searchMovieAPI();
    });

}


/**********************************************************************************  
* function to handle all event listeners 
**********************************************************************************/
function handleClicks() {

    handleSearch();
    handleClips();
    handleNext();
    handlePrev();
}

/**********************************************************************************  
* calls handleClicks when document is ready
**********************************************************************************/
$(handleClicks);

