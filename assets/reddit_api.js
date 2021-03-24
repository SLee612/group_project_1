



$.ajax({
    url: `https://www.reddit.com/r/memes.json?`,
    method: 'GET',
  }).then(function (response){
      console.log(response)
      var newRowEl = $('<row>')
        newRowEl.attr('class', 'row')

    var memeImgEl = $('<img>')
        newRowEl.append(memeImgEl)
        memeImgEl.attr('src', response.data.children[0].data.url_overridden_by_dest) 

    console.log(memeImgEl)

      $('#Reddit-Story').append(newRowEl)

  });
