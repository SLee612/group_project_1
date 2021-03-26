//news search form
var searchBtn = $('#search-news-button');
// var searchForm= $('.form-control');
//clear historybutton
var clearHistoryBtn = $('#clear-history');
var searchedNewsListEl = $('.list-group');
var saveList = $('<li>');
var newsSearchInputText = ''
var savedSearches = []
var newsStory= $('#News-Story');
var newsSearchInputEl = $('input')
var savedSearchUnorderedListEl = $('<ul>')
var previousSearchShown = false;

var currentDate = moment().format('dddd MMMM Do YYYY, h:mm a');
$("#current-date").text("" + currentDate + "");

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

    var articleSearch = `https://gnews.io/api/v4/search?q=${newsSearchInputText}&country=us&token=90f87db7a7e3e07626c4b9f81f1d9d6e`;
        $.ajax({
            url:articleSearch,
            method:'GET',
        }).then(function(response){
            console.log(response)
            newsStory.text("");
            var newsRow =$('<row>');
            newsRow.addClass('row')
            newsStory.append(newsRow)
            for ( var i = 0; i < 3; i++ ){
              var newsCard =$('<figure>');
              newsCard.addClass('col-md-4');

              var newsImage =$('<img>');
              newsImage.attr('src',response.articles[i].image)
              newsImage.attr('style', 'height:300px; width:300px; object-fit:contain')
              
              var newsTitle = $('<h5>')
              newsTitle.text(response.articles[i].title);
              var newsDescription = $('<p>')
              newsDescription.text(response.articles[i].description);
            //   var newsImage = $('<img>')
            //   newsImage.addClass('newspic')
            //   newsImage.attr('src','response.articles[i].image')
              var newsSourceName= $('<p>')
              newsSourceName.text((response.articles[i].source.name))
              var newsSourceUrl= $('<p>')
              newsSourceUrl.text((response.articles[i].source.url))  

              newsCard.append(newsImage)
              newsCard.append(newsTitle)
              newsCard.append(newsDescription)
            //   newsCard.append(newsImage)
              newsCard.append(newsSourceName)
              newsCard.append(newsSourceUrl)

              newsRow.append(newsCard)
            }

        });
    redditData(newsSearchInputText);
    storeInputToLocalStorage()
  }

  //store news user input to local storage
  function storeInputToLocalStorage(){
      var stringSearchInput = JSON.stringify(savedSearches);
      localStorage.setItem('searches', stringSearchInput);

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