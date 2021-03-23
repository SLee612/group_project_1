//news search form
var searchBtn = $('#search-news-button');
var searchForm= $('.form-control');
//clear historybutton
var clearHistoryBtn = $('#clear-history');
var searchedNewsListEl = $('.list-group');
var searchedNewsListItem = $('<li>');
    searchedNewsListItem.attr('class', 'list-group-item');
var newsSearchInput = ''
var savedSearches = []

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

    searchedNewsListItem.text(newsSearchInput);

    searchedNewsListEl.append(searchedNewsListItem);
    searchForm.val('');

    storeInputToLocalStorage()
  }

  //store news user input to local storage
  function storeInputToLocalStorage(){
      var stringSearchInput = JSON.stringify(savedSearches);
      localStorage.setItem('searches', stringSearchInput);
  }

  


//----------------------------------
  