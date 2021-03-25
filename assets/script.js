//news search form
var searchBtn = $('#search-news-button');
// var searchForm= $('.form-control');
//clear historybutton
var clearHistoryBtn = $('#clear-history');
var searchedNewsListEl = $('.list-group');
var newsSearchInputText = ''
var savedSearches = []
var newsStory= $('#News-Story');
var newsSearchInputEl = $('input')


var today = moment().format("LL");
console.log(today)

var searchInputSaved = JSON.parse(localStorage.getItem('searches'));


//get saved search and display on list
function init(){
    if(searchInputSaved != null){
        savedSearches = searchInputSaved;
    }
    for (let i = 0; i < savedSearches.length; i++) {
        searchedNewsListEl.append(searchedNewsListItem.text(savedSearches[i]));
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

    var articleSearch = `https://gnews.io/api/v4/search?q=${newsSearchInputText}&country=us&token=4c6477a39ac0888785968fdb8d31562e`;
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
    url: `https://www.reddit.com/search.json?q=${newsSearchInputText}&sort=trending`,
    method: 'GET',
    }).then(function (response){
      console.log(response);
      var newRowEl = $('<row>');
        newRowEl.attr('class', 'row');
        $('.card-body').append(memeImgEl);

      
    for ( var i = 0; i < 3; i++ ){
    
    var redditTitle = $('<h5>')
      redditTitle.text(response.data.children[i].data.title);   
      $('#Reddit-Story').append(redditTitle);

    var memeImgEl = $('<img>');
      memeImgEl.attr('class', 'col-md-3')
      memeImgEl.attr('id', 'image' + i)
      memeImgEl.attr('style', 'width:250px; height:250-px; background-color:darkgrey; margin:5px')
      memeImgEl.attr('src', response.data.children[i].data.url_overridden_by_dest)
      $('#Reddit-Story').append(memeImgEl);
      
    }
   });
  }


  $.ajax({
    url: `https://www.reddit.com/r/memes.json?`,
    method: 'GET',
  }).then(function (response){
      console.log(response)
      // var newRowEl = $('<row>');
      // newRowEl.attr('class', 'row');
      $('.card-body').append(memeImgEl);

      
      for ( var i = 0; i < 3; i++ ){

      var memeImgEl = $('<img>');
        memeImgEl.attr('class', 'col-md-3')
        memeImgEl.attr('id', 'image' + i)
        memeImgEl.attr('style', 'width:250px; height:250-px; background-color:darkgrey; margin:5px')
        

      var numberOfMemes = response.data.children.length
      // console.log(numberOfMemes)
      var randomIdx = Math.floor(Math.random()* numberOfMemes);
      console.log(randomIdx)
      
      console.log(response.data.children[randomIdx].data.url_overridden_by_dest)
      memeImgEl.attr('src', response.data.children[randomIdx].data.url_overridden_by_dest);
      $('card-body').append(memeImgEl);
      memeImgEl.attr('id', "meme_image") ;
      
    }
  });

