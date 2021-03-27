quoteBlock = $('#quoteblock');
  const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://type.fit/api/quotes",
      "method": "GET"
    }
    $.ajax(settings).done(function (response) {
      const data = JSON.parse(response);
      console.log(data);
      var randomQuote = Math.floor(Math.random()
      * data.length);
      console.log(randomQuote)
      console.log(data[randomQuote].text)
      console.log(data[randomQuote].author)
      var author = data[randomQuote].author  || "Unknown"
      console.log(author)
      quoteBlock.text(data[randomQuote].text +" - " + author)
    });


//news search form
var searchBtn = $('#search-news-button');
var searchedNewsListEl = $('.list-group');
var newsSearchInputText = 'top news'
var savedSearches = []
var newsSearchInputEl = $('input')
var savedSearchUnorderedListEl = $('<ul>')
var previousSearchShown = false;
//current date
var currentDate = moment().format('dddd MMMM Do YYYY, h:mm a');
$("#current-date").text("" + currentDate + "");

//news carousel global variables
var newsStory= $('#News-Story');
var newsRow =$('#newsrow');
var reportSlide = 0;
var newsRow =$('#newsrow');
var newsArray = newsRow[0].children || [];


//set default display to top news
function init(){
  newsSearch(newsSearchInputText);
  redditData(newsSearchInputText);
}

//saved items
var searchInputSaved = JSON.parse(localStorage.getItem('searches'));

//when search bar is clicked, list stored items
newsSearchInputEl.on('click', displayPreviousSearched);

// $(document).on('click', function(event){
//   event.preventDefault();
//   if (event.currentTarget !== newsSearchInputEl){
//     $('#test-list').empty();
//     previousSearchShown = false;
//   }
// });

//when previously searched item is clicked on, search that word.
$(document).on('click', '.list-group-search', function(){
  var clickedItem = $(this).text();
  redditData(clickedItem);
  newsSearch(clickedItem);
});

//get saved search and display on list
function displayPreviousSearched(){
  if (!previousSearchShown) {
  if (searchInputSaved != null) {
    savedSearches= searchInputSaved;
  }
  //limit previously saved array to 5
  if (savedSearches.length > 5) savedSearches.length = 5;
  //create list elements for saved searches
  for (let i = 0; i < savedSearches.length; i++) {
    $('#test-list').append('<li class = "list-group-search">' + savedSearches[i] + '</li>');
    $('#test-list').attr('style', 'border-radius:8px; text-align:center; color:grey;');

  }
  previousSearchShown = true;
  }
}

//news search button click
$.fn.enterKey = function (fnc) {
  return this.each(function () {
      $(this).keypress(function (ev) {
          var keycode = (ev.keyCode ? ev.keyCode : ev.which);
          if (keycode == '13') {
              fnc.call(this, ev);
          }
      })
  })
}

newsSearchInputEl.enterKey (function(event){
  if (event.which === 13){
    event.preventDefault();
    console.log("hello")
    
    $('#test-list').empty();
    previousSearchShown = false;
    getFormInfo();
  }
});

//news search get user input
function getFormInfo() {
  newsSearchInputText = newsSearchInputEl.val(); 
  //change all searches to have the first character capitalized.
  newsSearchInputText = newsSearchInputText.charAt(0).toUpperCase() + newsSearchInputText.slice(1);
    console.log(newsSearchInputText);

  //add searched item to beginning of saved search array for local storage
  savedSearches.unshift(newsSearchInputText);

  //if nothing is entered, return(nothing happens)
  if(!newsSearchInputText) {
    return;
  }
  //create new list item to store searched word
  var searchedNewsListItem = $('<li>');
    searchedNewsListItem.attr('class', 'list-group-search');
    searchedNewsListItem.text(newsSearchInputText);
    //append list item to unordered list
    searchedNewsListEl.append(searchedNewsListItem);
    
  //reset search form 
  newsSearchInputEl.val('');
    
  newsSearch(newsSearchInputText);
  redditData(newsSearchInputText);
  storeInputToLocalStorage();
}

//store news user input to local storage
function storeInputToLocalStorage() {
    var stringSearchInput = JSON.stringify(savedSearches);
    localStorage.setItem('searches', stringSearchInput);
}

function setInitNewsPost(){
  newsArray[newsArray.length - 1].classList.add('prev');
  newsArray[reportSlide].classList.add('active');
  newsArray[reportSlide+1].classList.add('next');
};

function setNewsListeners(){
  var next = $('.carousel__button--next')[0];
  var prev = $('.carousel__button--prev')[0];

  next.addEventListener('click', moveNext);
  prev.addEventListener('click', movePrev);
};

function moveCarouselTo(reportSlide) {
    // Preemptively set variables for the current next and previous slide, as well as the potential next or previous slide.
    var newPrevious = reportSlide - 1;
    var newNext = reportSlide + 1;
    var oldPrevious = reportSlide - 2;
    var oldNext = reportSlide + 2;
  // Test if carousel has more than three items
 
    // Checks if the new potential slide is out of bounds and sets slide numbers
    if (newPrevious <= 0) {
      oldPrevious = (newsArray.length - 1);
    } else if (newNext >= (newsArray.length - 1)){
      oldNext = 0;
    }

    // Check if current slide is at the beginning or end and sets slide numbers
    if (reportSlide === 0) {
      newPrevious = (newsArray.length - 1);
      oldPrevious = (newsArray.length - 2);
      oldNext = (reportSlide + 1);
    } else if (reportSlide === (newsArray.length -1)) {
      newPrevious = (reportSlide - 1);
      newNext = 0;
      oldNext = 1;
    }

    // Now we've worked out where we are and where we're going, by adding and removing classes, we'll be triggering the carousel's transitions.
  
    // Based on the current slide, reset to default classes.

      newsArray[oldPrevious].classList.remove('prev');
      newsArray[reportSlide].classList.remove('prev');
      newsArray[oldNext].classList.remove('next');
      newsArray[reportSlide].classList.remove('next');
      newsArray[newPrevious].classList.remove('active');
      newsArray[newNext].classList.remove('active');

      // Add the new classes
      newsArray[newPrevious].classList.add('prev')
      newsArray[reportSlide].classList.add('active')
      newsArray[newNext].classList.add('next')
}


// Next navigation handler
function moveNext() {
  console.log("Works!")

  // If it's the last slide, reset to 0, else +1
  if (reportSlide === (newsArray.length - 1)) {
    reportSlide = 0;
  } else {
    reportSlide++;
  }

  // Move carousel to updated slide
  moveCarouselTo(reportSlide);
}

  // Previous navigation handler
function movePrev() {
  console.log("Works Too!")

  // If it's the first slide, set as the last slide, else -1
  if (reportSlide === 0) {
    reportSlide = (newsArray.length - 1);
  } else {
    reportSlide--;
}

  // Move carousel to updated slide
  moveCarouselTo(reportSlide);
}

function newsSearch(newsSearchInputText){
  $.ajax({

url:`https://gnews.io/api/v4/search?q=${newsSearchInputText}&country=us&token=18d2019f6d1a88d1affb0b498acceb23`,

      method:'GET',
    }).then(function(response){
      console.log(response)
      newsRow.text("");
      for ( var i = 0; i < response.articles.length; i++ ){
        var newsCard=$('<figure>');
        newsCard.addClass('news_card col-10')
        
        var newsImage =$('<img>');

          newsImage.attr('src',response.articles[i].image)
          newsImage.attr('style', 'width:100%; object-fit:contain; border-radius:4px;')
    

        
        var newsTitle = $('<h5>')
          newsTitle.attr('style', 'text-align:center;')        
        var newsDescription = $('<p>')
          newsDescription.text(response.articles[i].description);
          newsDescription.attr('style', 'font-size: 17px')

        var newsSourceName= $('<a>');
         newsSourceName.attr( 'href', response.articles[i].url);
         newsSourceName.attr('class', 'news_link')
         newsSourceName.attr('target', '_new');
         newsSourceName.text(response.articles[i].title)
         newsSourceName.attr('style', 'text-decoration:none;')

        newsCard.append(newsTitle)
        newsCard.append(newsDescription)
        newsCard.append(newsImage)
        newsCard.append(newsSourceName)
        // newsCard.append(newsSourceUrl)
        newsRow.append(newsCard)
      }
      function initNewsCarousel(){
        setInitNewsPost();
        setNewsListeners();
      }
      initNewsCarousel();
  });
}


function redditData(newsSearchInputText){
  $.ajax({
    url: `https://www.reddit.com/r/memes/search.json?q=${newsSearchInputText}`,
    method: 'GET',
    }).then(function (response){
      console.log(response);

      $('#Reddit-Story').text("");
      var redditRow =$('<row>');
            redditRow.addClass('row')
            $('#Reddit-Story').append(redditRow)

      var count = 0;
      var i = 0;

      while(count < 4) {
        var redditCard =$('<figure class = "reddit_card">');
          redditCard.addClass('col-md-3');

        var redditImage =$('<img>');
          //avoid blank thumbnails, if blank, iterate through loop again 
          if (["self", "default", "image"].includes(response.data.children[i].data.thumbnail)) {
            i++;
            continue;
          }
          redditImage.attr('src', response.data.children[i].data.thumbnail);
          redditImage.attr('style', 'width:100%; object-fit:contain; border-radius:5px');
        
        var redditTitle = $('<p>');
          redditTitle.attr('style', 'font-size: 8px');
  
        var redditSource= $('<a>');
         redditSource.attr( 'href', 'https://reddit.com' + response.data.children[i].data.permalink);
         redditSource.attr('target', '_new');
         redditSource.text(response.data.children[i].data.title);
        
        redditCard.append(redditImage);
        // redditCard.append(redditTitle);
        redditCard.append(redditSource);
        redditRow.append(redditCard);
          
        count++;
        i++;
      }
   });
  }

  


init();