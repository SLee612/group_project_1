//news search form
var searchBtn = $('#search-news-button');
var searchForm= $('.form-control');
//clear historybutton
var clearHistoryBtn = $('#clear-history');
var searchedNewsListEl = $('.list-group');
var newsSearchInput = ''
var savedSearches = []
var newsStory= $('#News-Story');


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
searchBtn.on('click', function(event){
    event.preventDefault();
    getFormInfo();
  });

//news search get user input
function getFormInfo(){
   newsSearchInput = searchForm.val(); 
   newsSearchInput = newsSearchInput.charAt(0).toUpperCase() + newsSearchInput.slice(1);
    console.log(newsSearchInput)

    savedSearches.push(newsSearchInput);

   if(!newsSearchInput){
       return
   }
   var searchedNewsListItem = $('<li>');
    searchedNewsListItem.attr('class', 'list-group-item');

    searchedNewsListItem.text(newsSearchInput);

    searchedNewsListEl.append(searchedNewsListItem);
    searchForm.val('');

    var articleSearch = `https://gnews.io/api/v4/search?q=${newsSearchInput}&country=us&token=4c6477a39ac0888785968fdb8d31562e`;
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
              
              var newsTitle = $('<h7>')
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

              newsCard.append(newsTitle)
              newsCard.append(newsDescription)
            //   newsCard.append(newsImage)
              newsCard.append(newsSourceName)
              newsCard.append(newsSourceUrl)

              newsRow.append(newsCard)
            }

        });

    storeInputToLocalStorage()
  }

  //store news user input to local storage
  function storeInputToLocalStorage(){
      var stringSearchInput = JSON.stringify(savedSearches);
      localStorage.setItem('searches', stringSearchInput);
  }

  

  // $.ajax({
  //   url: `https://www.reddit.com/r/memes.json?`,
  //   method: 'GET',
  // }).then(function (response){
  //     console.log(response)
  //     for ( var i = 0; i < 3; i++ ){
  //     var newRowEl = $('<row>');
  //       newRowEl.attr('class', 'row');

  //     var memeImgEl = $('<img>');
  //       memeImgEl.attr('id', 'image' + i)

  //     var numberOfMemes = response.data.children.length
  //     // console.log(numberOfMemes)
  //     var randomIdx = Math.floor(Math.random()* numberOfMemes);
  //     console.log(randomIdx)
      
  //     console.log(response.data.children[randomIdx].data.url_overridden_by_dest)
  //     memeImgEl.attr('src', response.data.children[randomIdx].data.url_overridden_by_dest);
  //     newRowEl.append(memeImgEl);
  //     memeImgEl.attr('id', "meme_image") ;
      
  //     $('#Reddit-Story').append(newRowEl);
  //   }
  // });

  $.ajax({
    url: `https://www.reddit.com/r/memes.json?after=${after}`,
    method: 'GET',
  }).then(function (response){
      console.log(response)
      var newRowEl = $('<row>');
      newRowEl.attr('class', 'row');
      $('#Reddit-Story').append(newRowEl);
      for ( var i = 0; i < 3; i++ ){
    
      var memeImgEl = $('<img>');
        memeImgEl.attr('class', 'col-md-4')
        memeImgEl.attr('id', 'image' + i)
        memeImgEl.attr('style', 'width:350px; height:350-px; object-fit:contain;')

      var numberOfMemes = response.data.children.length
      // console.log(numberOfMemes)
      var randomIdx = Math.floor(Math.random()* numberOfMemes);
      console.log(randomIdx)
      
      console.log(response.data.children[randomIdx].data.url_overridden_by_dest)
      memeImgEl.attr('src', response.data.children[randomIdx].data.url_overridden_by_dest);
      newRowEl.append(memeImgEl);
      memeImgEl.attr('id', "meme_image") ;
      
      
    }
  });
