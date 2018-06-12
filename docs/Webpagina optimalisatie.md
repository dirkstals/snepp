# Webpagina optimalisatie

Het kritieke weergave pad &#7000; (&) ligaturen voor webicoontjes

Technologieën: HTML, CSS, JS
Komt aan bod: Web fonts, Voiceover bij icoontjes, Base64, Image placeholders, pre-vamp script, ...

## Kritieke weergave pad

Het kritieke weergave pad is het pad dat de browser moet afleggen vooraleer er iets getoond wordt op het scherm. 

[optimaliseer het kritieke weergave pad](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=nl)

### HTML

Enkel Server-side rendering van de pagina kan het eerste gebruik bevorderen. Hierna kan nog worden gewerkt met client-side frameworks zoals Angularjs, React, ..

#### Client-side rendering

de HTML en CSS is na enkele milliseconden al zichtbaar, maar wordt pas getoond nadat het javascript framework is ingeladen en de content heeft opgevraagd.

#### Server-side rendering

De HTML, CSS en content is na enkele milliseconden zichtbaar. Het javascript framework kan asynchroon ingeladen worden en verdere verrichtingen doen.

[server-side rendering](http://tomdale.net/2015/02/youre-missing-the-point-of-server-side-rendered-javascript-apps/)


### Javascript

Javascript is renderblocking. Probeer daarom zoveel mogelijk scripts asynchroon in te laden. Door middel van een scriptje (zoals [facebook](https://developers.facebook.com/docs/javascript/quickstart/v2.5), [twitter](https://dev.twitter.com/web/javascript/loading), ..) of het `async` attribuut van de script-tag. 

	<script async src="../scripts/myscript.js"></script>
	
[W3Schools async](http://www.w3schools.com/tags/att_script_async.asp)
[W3C Recommendation async](http://www.w3.org/TR/html5/scripting-1.html#attr-script-async)

Dit zorgt ervoor dat de pagina het renderen niet gaat blokkeren bij het tegenkomen van dit script. Het maakt niet uit waar deze script-tags staan aangezien ze opgeroepen worden als de browser het uitkomt. Best zet je ze dus gewoon in de head sectie van een pagina om het overzichtelijk te houden.
Scriptjes zoals facebook en twitter moeten onderaan de pagina staan, zodat ze de volledige DOM kunnen gebruiken.

Als deze javascript is ingeladen en je gaat DOM aanpassingen doen, zorg dan altijd dat het DOMContentLoaded event is getriggerd.

	document.addEventListener('DOMContentLoaded', function(event) {
	
   		console.log('DOM is loaded');
	});
	
Als je afhankelijke scripts hebt, zorg dan dat deze allemaal gemerged zijn tot 1 file. Zo weet je zeker dat je alle dependencies kan gebruiken. Met het async attribuut weet je trouwens niet wanneer welk script ingeladen wordt.

Indien je toch afhankelijk bent van bijvoorbeeld een extern script. Kan je gebruik maken van de **scriptLoader** module.

Dit script gaat een promise aanmaken en inlossen wanneer het script geladen is. 

	<script async src="external.js"></script>

Hierboven het script dat asynchroon wordt ingeladen. En hieronder het script dat de promise gaat aanspreken.

	<script>
	
		/* insert the minified ScriptLoader Module here */
	
		var _onLoadSuccess = function(event){
			console.log('External script is loaded.');
		};
		
		var _onLoadError = function(error){
			console.error('The script could not be loaded.');
		};
		
		scriptLoader.onScriptLoaded('external.js', _onLoadSuccess, _onLoadError);

	</script>

Als je aanpassingen gaat doen aan de DOM, kan je dit best onderaan de pagina plaatsen, net voor de closing body-tag.

### CSS

Stylesheets zijn ook renderblocking. Behalve wanneer ze niet van toepassing zijn op de viewport.
Door de media-tag te gebruiken kan je viewport-gericht de stylesheets opdelen. Daardoor zal enkel de stylesheet(s) gebruikt worden die van toepassing zijn op de huidige viewport.

Repsonsive

    <link href="style.css" rel="stylesheet">
    <link href="print.css" rel="stylesheet" media="print">
    <link href="other.css" rel="stylesheet" media="(min-width: 40em)">

Orientation

    <link href="style.css"    rel="stylesheet" media="all">
    <link href="portrait.css" rel="stylesheet" media="orientation:portrait">


[Render blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css?hl=nl)

Om volledig asynchrone stylsheets te gebruiken kan de **asynccss** module gebruikt worden.
Met het plaatsen van de stylesheets in een noscript-tag worden de regels overgeslaan bij het renderen van de pagina. Nadien gaat de module de regels toevoegen aan de head-tag en zo de stylesheets inladen. Indien er geen javascript is worden de stylesheets gewoon gerendered als normaal.

	<noscript id="async-stylesheets">
		<link rel="stylesheet" href="../styles/performance-4.css" />
	</noscript>
	
Omring de stylesheet met de noscript-tags en geef het de id *async-stylesheets*. Juist voor de body closing-tag voeg je dan het script toe.
	
		..
		<script>
			/* Insert the minified AsyncCss Module here */
		</script>
	</body>

Zorg wel voor inline style zodat de eerste rendering toch een beetje juist staat. Niet op de elementen zelf `<div class="black-box" style="color:black;"></div>` maar in de head als style element.
	
	<style>
		.black-box{
			color: black;
		}
	</style>

## Afbeeldingen
	
#### CSS aspect ratio

Door middel van een wrapper rond de image te bouwen, en die wrapper van de juiste verhouding te voorzien, kan men gemakkelijk een placehold afbeelding tonen waar de afbeelding in ingeladen wordt.
Dit kan men doen door een percentage toe te kennen aan de padding-bottom van de wrapper, en de image op position absolute te zetten. Doordat het percentage van padding gebaseerd is op de width van een element, zorgt padding-bottom voor een hoogte die afhankelijk is van de breedte. 

> The percentage is calculated with respect to the width of the generated box's containing block, even for 'padding-top' and 'padding-bottom'.
[W3C Recommendation on padding](http://www.w3.org/TR/CSS21/box.html#padding-properties)

Door verschillende aspect ratio classes aan te maken, kan men ze handig hergebruiken.

	.image { position: relative; }
	.image img { position: absolute; }
	.aspectratio-16x9 { padding-bottom: 56.25%; }
	.aspectratio-4x3 { padding-bottom: 75%; }

	<div class="image aspectratio-16x9">
		<img src="images/image.jpg" />
	</div>

#### Javascript onload 

Voordat de DOM gerenderd is, kan een scriptje alle img-tags afgaan om zo een onload event aan het element te hangen. Hiermee kan je afbeelding pas echt tonen als het volledig is ingeladen. Zie ook de **preloadimage** module.

#### Baseline vs Progressive JPEGs

JPEGs kunnen op 2 manieren worden opgeslaan. Baseline en progressive. 
De grootte (bytes) zullen niet veel verschillen, maar het renderen verschilt wel.

##### Baseline

De browser laad de afbeelding stuk per stuk in. Je ziet eerst de bovenste  lijnen (in juiste resolutie), en wordt dan verder opgebouwd naar onder toe.

##### Progressive

De browser laad de afbeelding in en laat dan eerst een lage resolutie zien. De afbeelding wordt verder opgebouwd met steeds betere resoluties tot de juiste resolutie is bereikt.


## Video

Bij het inladen van video, vooral bij een video library zoals jwplayer, duurt het even voor we de effectieve player te zien krijgen. Dit komt grotendeels omdat deze wordt ingeladen door javascript. En zeker als dit script asynchroon wordt ingeladen. De videoplayer van de vrt (vamp) gebruikt jwplayer als achterliggend component. 

...


**prevamp** module

## Icons

Er zijn verschillende manieren om icoontjes te tonen op een webpagina. De handigste en meest gebruikte is door middel van Webfonts. Elk karakter wordt omgevormd naar een icoontje. Zeer handig voor vectorieel te schalen en kleuraanpassingen. Niet zo handig voor screenreaders en trage netwerken. Als de screenreader een icoontje tegenkomt, zal deze het onderliggend karakter voorlezen. Of zelfs niet lezen als het een karakter is dat niet leesbaar is. 
Bijvoorbeeld `&#7000;` &#7000;.

Met **ligatures** kan dit vermeden worden.

> Een ligatuur is een teken dat gevormd is door twee of meer lettervormen in één vorm te schrijven of te drukken.
[wikipedia](https://nl.wikipedia.org/wiki/Ligatuur_(typografie))

Met een simpele stap bij het aanmaken van een webfont, kan dit aangepast worden. [icomoon](https://icomoon.io/app) heeft hier een zeer handige tool voor. Bij het genereren van het font kan je per icoontje (meerdere) ligatures toekennen. Beste dat je een beschrijvende tag toekent, en een actie tag.
bijvoorbeeld voor het zoek-icoontje zet je de ligatures *vergrootglas,zoek*. 
Hierna kan je de icoontjes gebruiken in je webpagina als volgt.
`<span>zoek</span>` in plaats van `<span>&#7000;</span>`

We kunnen nu bij trage netwerken zien wat er gaat komen, en screenreaders kunnen perfect voorlezen wat het icoontje betekent.


[ligatures article](http://ilovetypography.com/2007/09/09/decline-and-fall-of-the-ligature/)
