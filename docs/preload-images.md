
# Image placeholders

## Description

Show a placeholder when the image is stil loading.
With optional classnames, the aspect ratio can be maintained.

## Usage

Wrap all your img-tags by a div tag that will provide some style for the placeholder.

    <div class="article-image">
        <img src="path/to/image.png">
    </div>

Then append this script to the bottom of the page, just before the closing body tag.

        <script> ... script ... </script>
    </body>

## CSS

You can specify CSS to visualize the placeholder.
Be aware that the loading class will be removed when the image is loaded.

	.loading{
		background-color: #f0f0f0;
	}
			
	.loading img{
		opacity: 0;
		position: absolute;
	}

## Pretty version

    <script>

		(function(document, className){

			var _onLoadHandler = function(e){
				
				e.currentTarget.parentNode.classList.remove(className);
			};

			for(var i = 0, images = document.querySelectorAll('img'); image = images[i]; i++){

				image.addEventListener('load', _onLoadHandler);
				image.parentNode.classList.add(className);
			}

		})(document, 'loading');    
		
	</script>


## Minified version
	
    <script>(function(d,i,r,k){r=function(e){e.currentTarget.parentNode.classList.remove(i);};for(k=0,m=d.querySelectorAll('img');g=m[k];k++){g.addEventListener('load',r);g.parentNode.classList.add(i);}})(document,'loading');</script>
    
## Maintaining aspect ratio

When adding a padding-bottom to a div. It calculates its percentages on the width of the div. With this, aspect ratios can be created. for instance: a div with a width of 100% and a padding-bottom of 50% will have a ratio of 2:1. This way a placeholder can be formed with the exact size of the loading image. 

To do this, add classes to the default loading class.

	.loading.loading__16x9{
		padding-bottom: calc(100% * (9 / 16));
	}
	
	.loading.loading__4x3{
		padding-bottom: calc(100% * (3 / 4));
	}

Then add those classes to the image parent nodes like so

    <div class="article-image loading__16x9">
        <img src="path/to/image.png">
    </div>
