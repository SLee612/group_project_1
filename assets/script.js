//news search form
var searchBtn = $('#search-news-button');
// var searchForm= $('.form-control');
//clear historybutton
var clearHistoryBtn = $('#clear-history');
var searchedNewsListEl = $('.list-group');
var saveList = $('<li>');
var newsSearchInputText = ''
var savedSearches = []
var newsSearchInputEl = $('input')
var savedSearchUnorderedListEl = $('<ul>')
var previousSearchShown = false;

var currentDate = moment().format('dddd MMMM Do YYYY, h:mm a');
$("#current-date").text("" + currentDate + "");

//news carousel global variables
var newsStory= $('#News-Story');
var newsRow =$('#newsrow');
var reportSlide = 0;
var newsRow =$('#newsrow');
var newsArray = newsRow[0].children || [];

var searchInputSaved = JSON.parse(localStorage.getItem('searches'));

newsSearchInputEl.on('click', init)

// //get saved search and display on list
function init(){
  // console.log(searchInputSaved.length)
  if (!previousSearchShown){
  if (searchInputSaved != null){
    savedSearches= searchInputSaved
  }
  for (let i = 0; i < savedSearches.length; i++) {
    $('#test-list').append('<li class = "list-group-item">' + savedSearches[i] + '</li>')
  }
  previousSearchShown = true;
  }
}

    // if(searchInputSaved != null){
    //     savedSearches = searchInputSaved;
    // }
    // for (let i = 0; i < searchInputSaved.length; i++) {
    //     $('#test-list').append.$(saveList)
    //     saveList.text(searchInputSaved[i])
    // }



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
function getFormInfo(){
   newsSearchInputText = newsSearchInputEl.val(); 
   newsSearchInputText = newsSearchInputText.charAt(0).toUpperCase() + newsSearchInputText.slice(1);
    console.log(newsSearchInputText)

    savedSearches.push(newsSearchInputText);

   if(!newsSearchInputText){
       return
   }
   var searchedNewsListItem = $('<li>');
    searchedNewsListItem.attr('class', 'list-group-item');

    searchedNewsListItem.text(newsSearchInputText);

    searchedNewsListEl.append(searchedNewsListItem);
    newsSearchInputEl.val('');
    
  newsSearch(newsSearchInputText);
  redditData(newsSearchInputText);
  storeInputToLocalStorage()
}

//store news user input to local storage
function storeInputToLocalStorage(){
    var stringSearchInput = JSON.stringify(savedSearches);
    localStorage.setItem('searches', stringSearchInput);

}
function setInitNewsPost(){
  newsArray[newsArray.length - 1].classList.add('prev');
  newsArray[0].classList.add('active');
  newsArray[0].classList.add('next');
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
      newsArray[oldNext].classList.remove('next');

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
    newsArray[reportSlide].classList.remove('active');
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
    newsArray[reportSlide].classList.remove('active');
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
        var newsCard =$('<figure>');
        newsCard.addClass('news_card col-md-4');
        
        var newsImage =$('<img>');
        newsImage.attr('src',response.articles[i].image)
        newsImage.attr('style', 'height:300px; width:300px; object-fit:contain')
        
        var newsTitle = $('<h5>')
        newsTitle.text(response.articles[i].title);
        var newsDescription = $('<p>')
        newsDescription.text(response.articles[i].description);

        var newsSourceName= $('<p>')
        newsSourceName.text((response.articles[i].source.name))
        var newsSourceUrl= $('<p>')
        newsSourceUrl.text((response.articles[i].source.url))  

        newsCard.append(newsTitle)
        newsCard.append(newsDescription)
        newsCard.append(newsImage)
        newsCard.append(newsSourceName)
        newsCard.append(newsSourceUrl)

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
        var redditCard =$('<figure>');
          redditCard.addClass('col-md-3');
          redditCard.attr('style', 'background-color:lightgrey')

        var redditImage =$('<img>');
          if (["self", "default", "image"].includes(response.data.children[i].data.thumbnail)) {
            i++;
            continue;
          }

          redditImage.attr('src', response.data.children[i].data.thumbnail);
          redditImage.attr('style', 'height:200px; width:200px; object-fit:contain; border-radius:5px');
        
        var redditTitle = $('<p>');
          redditTitle.text(response.data.children[i].data.title);
          redditTitle.attr('style', 'font-size: 15px');
  
        var redditSource= $('<a>');
         redditSource.attr( 'href', 'https://reddit.com' + response.data.children[i].data.permalink);
         redditSource.attr('target', '_new')
         
          redditSource.text("view here");

          redditCard.append(redditImage);
          redditCard.append(redditTitle);
          redditCard.append(redditSource);
          redditRow.append(redditCard);
          
          count++;
          i++;
      }
   });
  }



  //make carousel for news section/maybe reddit section?
  //design for cards? 
  //for fun section?
  //add date to top
  //set up default display
    //on opening, have top news/reddit displayed?
  //


  //<div>
      //<a href = https://reddit.com