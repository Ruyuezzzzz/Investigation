/*************************************************************************/
/*************************************************************************/
/*	Instalacion: */
/*
	- Color Picker
	--------------
	<script type="text/javascript" src="jscolor.js"></script>
	<input id="inputSelectColor" value="#000000" name="inputSelectColor" class="color {hash:true} box" onChange="changeInputcolor('#'+this.color);">

	- Colores favoritos
	-------------------
	<div class="favColors"></div>


	- Imagen SVG a modificar
	------------------------
	<img src="http://cdn.flaticon.com/svg/32/32441.svg"	 class="convertSvgInline" id="imgView" />

	- Formulario de descarga
	------------------------
    <form action="/download.php" id="sendImg" name="sendImg" method="POST">
        <input type="hidden" id="imgForm" name="imgForm" />
        <input type="hidden" id="imgName" name="imgName" />
    </form>

	- Botones de descarga
	---------------------
	<a href="javascript:void(0);" class="eventDownload" data-w="64" data-n="icon64">64x64</a>

	*/
	/*************************************************************************/
	/*************************************************************************/


	var flaticon_ls = localStorage;
	var flaticon_favColorsNew 	= ['000000','FFFFFF','2ECC71','3498DB','9B59B6','F39C12','E74C3C'];
	var flaticon_favColors 	= ['000000','FFFFFF','F44336','E91E63','9C27B0','673AB7','3F51B5','2196F3','03A9F4','00BCD4','009688','4CAF50','8BC34A','CDDC39','FFEB3B','FFC107','FF9800','FF5722','795548','9E9E9E','607D8B'];
	var flaticon_maxCustomFavColor = 5;

	jQuery(document).ready(function() {

		if (jQuery('#detail .wrapper').length > 0)
		{
			flaticon_svgInline();
			flaticon_paintFavColors();
		}

		jQuery('.eventDownload').click(function() {
			flaticon_svg2png( {'width':jQuery(this).attr('data-w'), 'name':jQuery(this).attr('data-n')} );
		});



		$(".detail-down-icons-free .btng").on("click", function() {
			$$("#divConvertSvg").style.height	= '256px';
			$$("#divConvertSvg").style.width	= '256px';
		});

		$('#b64Button').on('click', function() {
			flaticon_hideBaseColors();
		});


		$('.favColors').on("click", ".colorBox", flaticon_clickColorBox);

	// Duplicamos esta funcion para añadir dos campos
	$(".singleB64Download").on("click", function() {


		elem = $$("#imgView");
		id = elem.getAttribute('data-id');
		kw = elem.getAttribute('data-kw');

	    // Nuevo para SVG
	    var width 		= jQuery(this).attr('data-w');
	    var filename 	= jQuery(this).attr('data-n');

	    download_size = this.getAttribute("rel");
	    download_size = download_size[1];

	    acc = "base64";

	    data = {};

	    // Para SVG, añadimos filename y width
	    data["i" + id] = {
	    	"id": 		id,
	    	"keyword": 	kw,
	    	"filename": filename,
	    	"width": 	width
	    };

	    download_data = JSON.stringify(data);

	    download_type = acc;
	    singleDownload = true;
	    displayModal(true, true);
	});


	$(".singlePngDownload").on("click", function() {

		elem = $$("#imgView");


		id = elem.getAttribute('data-id');
		kw = elem.getAttribute('data-kw');
	      	    // Nuevo para SVG
	      	    var width 		= jQuery(this).attr('data-w');
	      	    var filename 	= jQuery(this).attr('data-n');



	      	    download_size = this.getAttribute("rel");
	      	    if (isNaN(download_size)) {
	      	    	acc = download_size;
	      	    	download_size = 4;
	      	    	if (acc.length === 2) {
	      	    		download_size = acc[1];
	      	    		acc = "base64";
	      	    	}
	      	    } else acc = "png";
	      	    data = {};
	      	    data["i" + id] = {
	      	    	"id": 		id,
	      	    	"keyword": 	kw,
	      	    	"filename": filename,
	      	    	"width": 	width
	      	    };
	      	    download_data = JSON.stringify(data);

	      	    download_type = acc;
	      	    singleDownload = true;
	      	    displayModal(true, true);
	      	});



	// Si no existe un color ya predefinido ponemos el negro
	if (typeof flaticon_ls.color==='undefined' || flaticon_ls.color=='')
	{
		flaticon_ls.color = '#000000';
	}


});

function flaticon_clickColorBox()
{
	$$("#divConvertSvg").style.height	= '256px';
	$$("#divConvertSvg").style.width	= '256px';

		// El id coincide con el HEX del color
		var c = jQuery(this).attr('id');

		c = c.toUpperCase();

		// Coloco el color en el picker
		document.getElementById('inputSelectPngColor').value = '#'+c;
		document.getElementById('inputSelectPngColor').style.backgroundColor = '#'+c;
		document.getElementById('inputSelectBaseColor').value = '#'+c;
		document.getElementById('inputSelectBaseColor').style.backgroundColor = '#'+c;

		// Cambion el color al SVG
		flaticon_changeSVGcolor('#'+c);

		// Marco el color seleccionado
		jQuery('#divChooseBaseColor #'+c+' , #divChoosePngColor #'+c).addClass('colorSelected');

	}

	function flaticon_hidePngColors()
	{
		if ( typeof document.documentMode!=='undefined' && (document.documentMode < 11) )
		{
			jQuery('#divChoosePngColor').hide();
			flaticon_changeSVGcolor('#000000');
		}
		else
		{
			flaticon_changeSVGcolor(flaticon_ls.color);
		}

	}

	function flaticon_hideBaseColors()
	{
    	var browser = flaticon_detectBrowser();
    	var version = flaticon_detectVersion();

		if ( typeof document.documentMode!=='undefined' || (( browser=='Safari') &&  (version < 8)) )
		{
			jQuery('#divChooseBaseColor').hide();

			flaticon_changeSVGcolor('#000000');

		}
		else
		{
			flaticon_changeSVGcolor(flaticon_ls.color);
		}
	}

/**
* Reemplaza el svg por su contenido inline
*/
function flaticon_svgInline()
{

	// Instancion las estructuras necesarias para trabajar

	var canvasSvg2Png = document.createElement("canvas");
	canvasSvg2Png.style.display = 'none';
	canvasSvg2Png.id = 'canvasSvg';

	var pngContanier = document.createElement("div");
	pngContanier.style.display = 'none';
	pngContanier.id = 'png-container';

	var divFavColors = $('.favColors');

	divFavColors.before(canvasSvg2Png);
	divFavColors.before(pngContanier);

	// Ponemos el color por defecto en el input
	document.getElementById('inputSelectPngColor').value = flaticon_ls.color;
	document.getElementById('inputSelectPngColor').style.backgroundColor = flaticon_ls.color;
	document.getElementById('inputSelectBaseColor').value = flaticon_ls.color;
	document.getElementById('inputSelectBaseColor').style.backgroundColor = flaticon_ls.color;

	jQuery('.convertSvgInline').each(function(){
		var img 		= jQuery(this);
		var imgID 		= img.attr('id');
		var imgClass 	= img.attr('class');
		var imgURL 		= img.attr('src');
		var dataId  	= img.attr('data-id');
		var dataKw 		= img.attr('data-kw');
		var widthImg	= 256;
		var scale 		= 1;

		$.ajax({
			global: false,
			url: imgURL,
			dataType: 'xml',
			success : function(data) {
				// Get the SVG tag, ignore the rest var
				svg = jQuery(data).find('svg');

				// Add replaced image's ID to the new SVG
				if(typeof imgID !== 'undefined')
				{
					svg = svg.attr('id', imgID);
				}
				// Add replaced image's classes to the new SVG
				if(typeof imgClass !== 'undefined')
				{
					svg = svg.attr('class', imgClass+' replaced-svg');

					var w 	= svg.attr('width');
					var h 	= svg.attr('height');

					if (typeof w === 'undefined' || w == '') w = '256px;';
					if (typeof h === 'undefined' || h == '') h = '256px;';


					w = w.substr(0,w.indexOf('px'));
					h = w.substr(0,h.indexOf('px'));
					scale 	= w/widthImg;
					h 		= parseInt(h/scale);
					w 		= parseInt(w/scale);

					svg.attr('width', 256);
					svg.attr('height', 256);
					if ( dataId != 'undefined' )
					{
						svg.attr('data-id',dataId );
						svg.attr('data-kw',dataKw );
					}

				}
				// Remove any invalid XML tags as per http://validator.w3.org
				svg = svg.removeAttr('xmlns:a');
				// Replace image with new SVG
				img.replaceWith(svg);


		 		// Recogemos el tamaño original del SVG, y lo asignamos al canvas

		 		var imgSource 	= document.getElementById('imgView');
		 		var rect 		= imgSource.getBoundingClientRect();

		 		var canvas 		= document.getElementById("canvasSvg");
		 		canvas.height 	= rect.height;
		 		canvas.width 	= rect.width;

		 	}
		 });
});
}

/**
* Pinta la barra de colores favoritos
*/
/**
* Pinta la barra de colores favoritos
*/
function flaticon_paintFavColors()
{

	var gridFav = $(".favColors");

	for(id in flaticon_favColors)
	{
		var colorFavGrid = document.createElement("div");
		colorFavGrid.className = "colorBox";
		colorFavGrid.style.backgroundColor = '#'+flaticon_favColors[id];
		colorFavGrid.id = flaticon_favColors[id];
	   	//colorFavGrid.addEventListener('click',clickColorBox,false);

	   	gridFav.append(colorFavGrid);
	   }
	   colorFavGrid = document.createElement("div");
	   colorFavGrid.className = "colorBox";

	   colorFavGrid.style.width = '0px';
	   colorFavGrid.style.marginRight = '10px';
	   gridFav.append(colorFavGrid);


	   var gridCustomFav = $(".favColors");
	   var colors = new Array();
	   var n = 0;
	   if (typeof flaticon_ls.favColors !== 'undefined' && flaticon_ls.favColors != '')
	   {
	   	colors = JSON.parse(flaticon_ls.favColors);
	   	n = colors.length;
	   	if (n > 0)
	   	{

	   		var keys = Object.keys(colors);

	   		for(id in keys)
	   		{
	   			var colorCustomFavDiv = document.createElement("div");
	   			colorCustomFavDiv.className = "colorBox";
	   			colorCustomFavDiv.style.backgroundColor = colors[id];
	   			colorCustomFavDiv.id = colors[id].substr(1,colors[id].length);
			   	//colorCustomFavDiv.addEventListener('click',clickColorBox,false);

			   	gridCustomFav.append(colorCustomFavDiv);
			   }

			}
		}

	}

/**
* Cambia el color al SVG
*/
function flaticon_changeInputcolor(color)
{
	flaticon_ls.color = color;

	$$("#imgToCanvas").style.display 	= "none";
	$$("#imgView").style.display 		= "block";
	$$("#textIEbug").style.display 		= "none";

	jQuery('.colorBox').removeClass('colorSelected');

	jQuery('#inputSelectBaseColor').addClass('colorSelected');
	jQuery('#inputSelectPngColor').addClass('colorSelected');

	$('#imgView path, #imgView polygon, #imgView line,#imgView polyline, #imgView circle, #imgView ellipse, #imgView rect').attr('style','');
	$('#imgView').attr('fill',color);


};

/**
* Cambia el color al SVG
*/
function flaticon_changeSVGcolor(color,forget)
{

	if (typeof forget==='undefined')
	{
		flaticon_ls.color = color;
	}


	$$("#imgToCanvas").style.display 	= "none";
	$$("#imgView").style.display 		= "block";
	$$("#textIEbug").style.display 		= "none";

	jQuery('.colorBox, #inputSelectBaseColor').removeClass('colorSelected');
	jQuery('.colorBox, #inputSelectPngColor').removeClass('colorSelected');
	jQuery('#inputSelectBaseColor').val(color);
	jQuery('#inputSelectPngColor').val(color);

	$('#imgView path, #imgView polygon, #imgView line,#imgView polyline, #imgView circle, #imgView ellipse, #imgView rect').attr('style','');
	$('#imgView path, #imgView polygon, #imgView line,#imgView polyline, #imgView circle, #imgView ellipse, #imgView rect').attr('fill','');
	$('#imgView').attr('fill',color);

	if (jQuery(color).length > 0)
	{
		jQuery('#divChooseBaseColor '+color+' , #divChoosePngColor '+color).addClass('colorSelected');
	}

};

/**
* Descarga el svg
*/
function flaticon_svg2png()
{

	var dd 			= JSON.parse(download_data);
	var key 		= Object.keys(dd);
	var index 		= key[0];
	var iconWidth 	= dd[key].width;
	var iconName 	= dd[key].filename;
	var iconType 	= dd[key].type;

	iconName = dd[key].keyword;

	var imgSource 	= document.getElementById('imgView');

	imgSource.style.display ='block';

	var svgString 	= new XMLSerializer().serializeToString(imgSource);

	var canvas 		= document.getElementById("canvasSvg");
	canvas.height 	= iconWidth;
	canvas.width 	= iconWidth;

	var DOMURL 		= window.URL || window.webkitURL || window;

	var browser = flaticon_detectBrowser();
	var version = flaticon_detectVersion();

	var svg;

	var c = flaticon_ls.color;

	c = c.toUpperCase();

	flaticon_saveColor(c);

	var typeColor = 'Base64';
	if (download_type == 'png') typeColor = 'PNG';

	_gaq.push(['_trackEvent', 'downloadColorIcon', typeColor , c ]);


	if ( browser == 'Safari' )
	{
		svg	= new Blob([svgString], {type: "image/svg+xml"});
	}
	else
	{
		// Firefox OK, Chrome OK
		svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	}

	var url = DOMURL.createObjectURL(svg);

	//var pngImg 			= new Image();
	var pngImg = document.getElementById('imgToCanvas');

console.log('svg2png',browser,version,download_type);

	if (browser == 'IE' || (browser == 'Safari' && version < 8 ) )
	{
		pngImg.onload = function() {

			if (download_type == "base64")
			{
				$$("#imgToCanvas").style.display 	= "none";
			}

			if (download_type == "png")
			{
				var width = 256;
				if (this.width > 256) {
					width = 512;
					jQuery('.zclip').css('top','657px');
				}
				else
				{
					jQuery('.zclip').css('top','401px');
				}

				$$("#divConvertSvg").style.height	= width+'px';
				$$("#divConvertSvg").style.width	= width+'px';
				$$("#imgToCanvas").style.display 	= "block";

				$$("#imgView").style.display 		= "none";
				$$("#textIEbug").style.display 		= "block";
			}

			if (download_type == 'svg')
			{
				$$("#imgView").style.display 		= "none";
				$$("#imgToCanvas").style.display 	= "none";
				$$("#textIEbug").style.display 		= "block";
				$$("#originalSvg").style.display 	= "block";

			}

		}
		pngImg.style.display ='block';
	}
	else
	{
		pngImg.onload = function() {

			var ctx	= canvas.getContext("2d");

			ctx.drawImage(this, 0,0,this.width,this.height);

			png	= canvas.toDataURL("image/png");

			document.getElementById('png-container').innerHTML = '<img src="'+png+'"/>';

			DOMURL.revokeObjectURL(png);

			var png;

			if (download_type == "base64")
			{
				var content = png.substr( png.indexOf(',')+1, png.length );
				var b64css2 = b64css.replace("%%B64%%", content);
				var mime = "image/svg+xml";

				b64css2 = b64css2.replace("%%MIME%%", 'image/png');
				b64img2 = b64img.replace("%%B64%%", content);

				$$("#b64css").innerHTML = b64css2.replace(/%%SIZE%%/g, this.width);
				$$("#b64Image").innerHTML = b64img2.replace("%%MIME%%", 'image/png');
				$("#dialog-b64image").dialog("option", "title", lang.b64);
				$("#dialog-b64image").dialog("open");
				$$("#svgVectorImg").style.display = "none";
			}

			if (download_type == "png")
			{
				$$("#imgToCanvas").style.display 			= "none";
				document.getElementById('imgForm').value 	= png;
				document.getElementById('imgName').value 	= iconName.replace(",", " ");
				document.getElementById('sendImg').submit();

			}
		}

	}

	pngImg.onerror 		= flaticon_msgError;
	pngImg.src 			= url;

	jQuery('#imgToCanvas').attr('height', iconWidth );
	jQuery('#imgToCanvas').attr('width', iconWidth );

	pngImg.type        = iconType;
	pngImg.nameIcon    = iconName;
	pngImg.crossOrigin = 'anonymous';

};



function flaticon_saveColor(color)
{

	var onlyColor = color.substr(1,color.length);

	if (flaticon_favColors.indexOf(onlyColor) == -1)
	{
		var colors = new Array();
		var n      = 0;

		if (typeof flaticon_ls.favColors !== 'undefined' && flaticon_ls.favColors != '')
		{
			colors = JSON.parse(flaticon_ls.favColors);
			n      = colors.length;
		}

		if (colors.indexOf(color) == -1)
		{
			if (n>=flaticon_maxCustomFavColor)
			{
				var key   = Object.keys(colors);
				var index = key[0];
				var c     = colors[index];

				colors.splice(index, 1);

				jQuery('#divChooseBaseColor '+c+' , #divChoosePngColor '+c).remove();

			}

			colors.push(color);

			var gridFav = $(".favColors");

			var colorFavDiv                   = document.createElement("div");
			colorFavDiv.className             = "colorBox colorSelected";
			colorFavDiv.style.backgroundColor = color;
			colorFavDiv.id                    = onlyColor;
			colorFavDiv.addEventListener('click', flaticon_clickColorBox);

			gridFav.append(colorFavDiv);

			flaticon_ls.favColors = JSON.stringify(colors);

		}
	}
}


/**
* Funcion para errores de eventos
*/
function flaticon_msgError(message, lineno, filename)
{
	flaticon_con( 'Error on ' + filename + ':' + lineno + '(' + message + ')' );
}

/**
* Debugger
*/
function flaticon_con(msg)
{
	var debug = 1;
	if (debug == 1)	console.log(msg);
}


function flaticon_detectBrowser() {


	if(navigator.userAgent.indexOf("Chrome") != -1 )
	{
		return 'Chrome';
	}
	else if(navigator.userAgent.indexOf("Opera") != -1 )
	{
		return 'Opera';
	}
	else if(navigator.userAgent.indexOf("Firefox") != -1 )
	{
		return 'Firefox';
	}
    //else if ( typeof document.documentMode!=='undefined' && (document.documentMode > 10) ) /*IF IE > 10*/
    else if ( typeof document.documentMode!=='undefined' )
    {
    	return 'IE';
    }
    else if(navigator.userAgent.indexOf("Safari") != -1 )
    {
    	return 'Safari';
    }
    else
    {
    	return navigator.userAgent;
    }
}

function flaticon_detectVersion()
{
   var ua= navigator.userAgent, tem,
   M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
   if(/trident/i.test(M[1])){
       tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
       return 'IE '+(tem[1] || '');
   }
   if(M[1]=== 'Chrome'){
       tem= ua.match(/\bOPR\/(\d+)/);
       if(tem!= null) return 'Opera '+tem[1];
   }
   M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
   if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);


   return M[M.length-1];

   /*return M.join(' ');*/
}






