
# Async Stylesheets

## Description

Load stylesheets asynchronous Append Everything that is inside the noscript-tag with the id #async-stylesheets to the head.

## Usage

Wrap all your stylesheets with a noscript-tag and give it the async-stylesheets id.

    <noscript id="async-stylesheets">
        <link rel="stylesheet" href="style1.css" />
        <link rel="stylesheet" href="style2.css" />
    </noscript>

Then append this script to the bottom of the page, just before the closing body tag.

        <script> ... script ... </script>
    </body>

## Pretty version

    <script>

        (function(document){

            var stylesheets = [],
            	noscriptElement = document.querySelector('#async-stylesheets'),
                head = document.querySelector('head'),
                temp = document.createElement('div');

            temp.innerHTML = noscriptElement.textContent;
            
            for(var i = 0; stylesheet = temp.children[i]; i++){

                stylesheets.push(stylesheet);
            }

            for(var i = 0; stylesheet = stylesheets[i]; i++){

                head.appendChild(stylesheet);
            }

        })(document);

    </script>


## Minified version
	
    <script>(function(d){var a=[],h=d.querySelector('head'),t=d.createElement('div');t.innerHTML=d.querySelector('#async-stylesheets').innerText;for(var i=0;s=t.children[i];i++){a.push(s);}for(var i=0;s=a[i];i++){h.appendChild(s);}})(document);</script>