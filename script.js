const MDBAPIKey = 'ba52c91a2a4420e8af20bc1f8d3ae86f';
const YoutubeAPIKey = 'AIzaSyCp3p6J0vMOVgB4xtInEszElwMrR-Yq5JY';
const YoutubeURL = 'https://www.googleapis.com/youtube/v3/search';



/**************************************************************************************************  
HTML to add the clips info from Youtube
info includes title and clickable thumbnail to take user to video
****************************************************************************************************/
function clipsHTML(items) {

    return `
    <div class="movies">
    <p class="video-title"> ${items.snippet.title} </p>
    <a href="https://youtube.com/watch?v=${items.id.videoId}" target="_blank" class="thumbnail-img" role=none title="${items.snippet.title}-video-thumbnail">
    <img src="${items.snippet.thumbnails.medium.url}" alt="${items.snippet.title}-video-thumbnail"></a>
    </div>
    
    `

}

/**************************************************************************************************  
callback function for Youtube API search
displays the results of the clips related to title 
****************************************************************************************************/
function displayClips(data) {
    const clips = data.items.map(function (item) {
        return clipsHTML(item);
    });
    $('.js-results').html(clips);
}

/**************************************************************************************************  
function searches Youtube API for titles of movies
****************************************************************************************************/
function searchYoutube(title) {
    const ajaxObject = {
        url: YoutubeURL,
        data: {
            part: 'snippet',
            key: YoutubeAPIKey,
            q: `${title}`,
            maxResults: 5,
            type: ''
        },
        dataType: 'json',
        type: 'GET',
        success: displayClips

    }

    $.ajax(ajaxObject);

}

/**************************************************************************************************  
function handles click to watch clips of certain titles
****************************************************************************************************/
function handleClips() {

    $(document).on('click', '.watch-clip', function (event) {
        event.preventDefault();
        const title = $('.title-search').val();
        searchYoutube(title);

    });

}

/*************************************************************
 * function adds html for the movie titles, release date 
 * and the synopsis of the movie
 ***************************************************************/
function movieHTML(item) {

    return `
        <div> 
            <option class="title-search" value="${item.title}">Title: ${item.title} </option>
            <p>Release Date: ${item.release_date}</p>
            <p>Summary: ${item.overview}</p>
            <button class="watch-clip"> See Clips</button>
        </div>
    
    `
}

/*************************************************************
 * this is callback function from genre search
 * function maps over the data from the API and
 * calls addMovieHTML to display movies on page
 ***************************************************************/
function displayMovies(data) {

    const result = data.results.map(function (item) {
        return movieHTML(item);
    });

    $('.js-results').html(result);

}


/********************************************************* 
Search MDBA API for movies of a specific genre
***********************************************************/
function searchMovieAPI(genre) {

    const settings = {
        url: `https://api.themoviedb.org/3/genre/${genre}/movies?api_key=${MDBAPIKey}&language=en-US&include_adult=false&sort_by=created_at.asc`,
        success: displayMovies
    }
    $.ajax(settings);

}



/**************************************************************************************************  
function handles initial search buttons for genres 
****************************************************************************************************/
function handleSearch() {

    $(document).on('click', '.search', function (event) {
        event.preventDefault();
        let genre = $('#search-by-genre').val();
        console.log(genre);
        searchMovieAPI(genre);

    });

}


/**********************************************************************************  
function to call event listeners 
**********************************************************************************/
function handleClicks() {

    handleSearch();
    handleClips();

    
}

/*Call handleClicks when Document ready*/
$(handleClicks);