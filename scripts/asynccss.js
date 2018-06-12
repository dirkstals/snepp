(function(document, id){

    var noscriptElement = document.querySelector(id),
        head = document.querySelector('head'),
        temp = document.createElement('div');

    temp.innerHTML = noscriptElement.textContent;

    for(var i = 0; child = temp.children[i]; i++){

        head.appendChild(child.cloneNode());
    }

    head.removeChild(noscriptElement);

})(document, '#async-stylesheets');