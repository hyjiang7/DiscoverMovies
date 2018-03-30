const MDBAPIKey = 'ba52c91a2a4420e8af20bc1f8d3ae86f';
const YoutubeAPIKey = 'AIzaSyCp3p6J0vMOVgB4xtInEszElwMrR-Yq5JY';
const YoutubeURL = 'https://www.googleapis.com/youtube/v3/search';
const MDBAURL = 'https://api.themoviedb.org/3/discover/movie?api_key=ba52c91a2a4420e8af20bc1f8d3ae86f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false';
const STORE = {
    //MDBResults: [],
    page: 1,
    totalPages: null,
   //fetchNextPage: false,
    genre: null
};


/**************************************************************************************************  
When page loads, function automatically searchs MDBAPI for current popular movies
success calls fucntion displayPopular
****************************************************************************************************/
function searchPopular() {
    const settings = {
        url: MDBAURL,
        success: displayPopular
    }
    $.ajax(settings);
}

/**************************************************************************************************  
displays the popular movies from MDBAPI
****************************************************************************************************/
function displayPopular(data) {
    const popular = data.results.map(function (item){
        return movieHTML(item);
    });
    
    $('.js-popular-movies').html(popular);
}

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
        <div class="movie"> 
            <option class="title-search" ">${item.title} </option>
            <p>Release Date: ${item.release_date}</p>
            <p>Summary: ${item.overview}</p>
            <button class="watch-clip" value="${item.title}"> Search Youtube</button>
        </div>
    
    `
}

/*************************************************************
 * this is callback function from genre search
 * function maps over the data from the API and
 * calls addMovieHTML to display movies on page
 ***************************************************************/
function displayMovies(data) {
    STORE.MDBResults = data.results;
    STORE.page = data.page;
    STORE.totalPages = data.total_pages;
    STORE.fetchNextPage = false;

    const result = data.results.map(function (item, index) {
        console.log(index);
        if(index > 9) {
            return;
        }
        return movieHTML(item);
    });
    
    $('.movies').prop('hidden', false);
    $('.js-results').prop('hidden', false);
    $('.js-results').html(result);
    if(STORE.MDBResults.length > 10) {
        $('.js-results').append('<button class="next"> Next </button>');
    }

}


/********************************************************* 
Search MDBA API for movies of a specific genre
***********************************************************/
function searchMovieAPI() {

    const settings = {
        url: `https://api.themoviedb.org/3/genre/${STORE.genre}/movies?api_key=${MDBAPIKey}&language=en-US&include_adult=false&sort_by=created_at.asc&page=${STORE.page}`,
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
        STORE.genre = genre;
        searchMovieAPI();
        
        
    });

}

function renderPage (nextResults) {

    const pageHTML = nextResults.map(function (item, index) {
        return movieHTML(item);
    });
    
    $('.js-results').html(pageHTML);
   if(STORE.MDBResults.length > 10) {
        $('.js-results').append('<button class="next"> Next </button>');
    }

}

function handleNext () {

    $(document).on('click', '.next', function (event) {
        event.preventDefault();
        //alert('next button');
        if(!STORE.fetchNextPage) {
            const nextResults = STORE.MDBResults.slice(10);
            renderPage(nextResults);
            STORE.fetchNextPage = true;
        }
        else {
            if (STORE.page < STORE.totalPages) {
                STORE.page++;
                searchMovieAPI();
            }
        }
    })

}


/**********************************************************************************  
function to call event listeners 
**********************************************************************************/
function handleClicks() {
    searchPopular();
    handleSearch();
    handleClips();
    handleNext();
}

/*Call handleClicks when Document ready*/
$(handleClicks);

