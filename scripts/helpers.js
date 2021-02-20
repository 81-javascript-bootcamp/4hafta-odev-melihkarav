export const searchMovieByTitle = (movie, searchValue) => {
    return movie.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
}

export const makeBgActive = (movie) => {
    document.querySelector(`tr[data-id='${movie.id}']`).style.background = "#d7f0f7";
}

export const createButton = (id, type, classes, text) => {
    const $btn = document.createElement('button');
    
    $btn.setAttribute('id', id);
    $btn.setAttribute('type', type);

    for (let i = 0; i < classes.length; ++i) {
      $btn.classList.add(classes[i]);
    }
    $btn.innerText = text;
    return $btn;
  };
  