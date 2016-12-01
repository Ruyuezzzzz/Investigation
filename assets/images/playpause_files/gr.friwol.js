/*
	Friwol, Otra idea de la Factoria del humor julian3xl, wizamaker y la ayuda inestimable de livan - 2015.-
*/
if (typeof gr.friwol !== 'undefined') gr.log('gr.friwol ya está definido');

gr.friwol = {
	container_selector: '.friwol_slides',
	slide_selector: '.friwol_slide',

	hide_body_overflow: false,

	min_slide_width: 130,
	max_slide_width: 150,

	min_margin_width: 10,
	max_margin_width: 15,

	max_num_lines: false,

	fix_at_init: true,
	fix_shutterstock: false,

	show_more: false,

	debug: false,
	debug2: false,


	// Variables privadas para el funcionamiento de friwooooooooooool
	_container_width: false,
	_container_height: false,
	_slide_width: false,
	_slide_height: false,
	_slide_margin_width: false,
	_slide_margin_height: false,
	_slides_per_line: 0,
	_im_on_a_iframe: false,

	init: function()
	{
		if (typeof $(gr.friwol.container_selector).data('hide-body-overflow') !== 'undefined') gr.friwol.hide_body_overflow = ($(gr.friwol.container_selector).data('hide-body-overflow') == '1');
		if (typeof $(gr.friwol.container_selector).data('min-slide-width') !== 'undefined') gr.friwol.min_slide_width = parseInt($(gr.friwol.container_selector).data('min-slide-width'), 10);
		if (typeof $(gr.friwol.container_selector).data('max-slide-width') !== 'undefined') gr.friwol.max_slide_width = parseInt($(gr.friwol.container_selector).data('max-slide-width'), 10);
		if (typeof $(gr.friwol.container_selector).data('min-margin-width') !== 'undefined') gr.friwol.min_margin_width = parseInt($(gr.friwol.container_selector).data('min-margin-width'), 10);
		if (typeof $(gr.friwol.container_selector).data('max-margin-width') !== 'undefined') gr.friwol.max_margin_width = parseInt($(gr.friwol.container_selector).data('max-margin-width'), 10);
		if (typeof $(gr.friwol.container_selector).data('max-num-lines') !== 'undefined') gr.friwol.max_num_lines = parseInt($(gr.friwol.container_selector).data('max-num-lines'), 10);
		if (typeof $(gr.friwol.container_selector).data('fix-at-init') !== 'undefined') gr.friwol.fix_at_init = ($(gr.friwol.container_selector).data('fix-at-init') == 1);
		if (typeof $(gr.friwol.container_selector).data('fix-shutterstock') !== 'undefined') gr.friwol.fix_shutterstock = ($(gr.friwol.container_selector).data('fix-shutterstock') == 1);
		if (typeof $(gr.friwol.container_selector).data('show-more') !== 'undefined') gr.friwol.show_more = ($(gr.friwol.container_selector).data('show-more') == 1);

		if (gr.friwol.hide_body_overflow) $('body').css('overflow', 'hidden');

		if (!gr.friwol.min_slide_width && gr.friwol.max_slide_width) gr.friwol.min_slide_width = gr.friwol.max_slide_width;
		if (gr.friwol.min_slide_width && !gr.friwol.max_slide_width) gr.friwol.max_slide_width = gr.friwol.min_slide_width;
		if (!gr.friwol.min_margin_width && gr.friwol.max_margin_width) gr.friwol.min_margin_width = gr.friwol.max_margin_width;
		if (gr.friwol.min_margin_width && !gr.friwol.max_margin_width) gr.friwol.max_margin_width = gr.friwol.min_margin_width;

		gr.friwol._slide_width = $(gr.friwol.slide_selector).width();
		gr.friwol._slide_height = $(gr.friwol.slide_selector).height();
		gr.friwol._slide_margin_width = parseInt($(gr.friwol.slide_selector).css('margin-right'), 10);
		gr.friwol._slide_margin_height = parseInt($(gr.friwol.slide_selector).css('margin-bottom'), 10);

		try { gr.friwol._im_on_a_iframe = (window.self !== window.top); }
		catch (e) { gr.friwol._im_on_a_iframe = true; }

		gr.friwol.responsive(gr.friwol.fix_at_init);
	},

	get_magic_with_maths: function()
	{
		var min_num_slides = (gr.friwol._container_width + gr.friwol.max_margin_width) / (gr.friwol.max_slide_width + gr.friwol.max_margin_width);
		var max_num_slides = (gr.friwol._container_width + gr.friwol.min_margin_width) / (gr.friwol.min_slide_width + gr.friwol.min_margin_width);

		if (gr.friwol.debug) console.log('container_width: ' + gr.friwol._container_width + ', min_num_slides: ' + min_num_slides + ', max_num_slides: ' + max_num_slides);

		var slide_width = 0;
		var slide_height = 0;
		var num_slides_por_linea = 0;
		var margin_width = 0;
		var width_sobrante = 0;

		if (Math.floor(min_num_slides) == Math.floor(max_num_slides))
		{ // El peor de los casos, no cabe de ninguna de las formas, asi que toca sacrificar alguno de los pre-requisitos
			var min_num_slides_overflow = gr.friwol._container_width - ((Math.floor(min_num_slides) * (gr.friwol.max_slide_width + gr.friwol.max_margin_width)) - gr.friwol.max_margin_width);
			var max_num_slides_overflow = gr.friwol._container_width - ((Math.ceil(max_num_slides) * (gr.friwol.min_slide_width + gr.friwol.min_margin_width)) - gr.friwol.min_margin_width);

			if (gr.friwol.debug) console.log('container_width: ' + gr.friwol._container_width + ', min_num_slides_overflow: ' + min_num_slides_overflow + ', max_num_slides_overflow: ' + max_num_slides_overflow);

			if (Math.abs(min_num_slides_overflow) < Math.abs(max_num_slides_overflow))
			{
				num_slides_por_linea = Math.floor(min_num_slides);
				slide_width = gr.friwol.max_slide_width;
				margin_width = gr.friwol.max_margin_width + Math.floor(min_num_slides_overflow / (num_slides_por_linea - 1));

				if (gr.friwol.debug) console.log('Opto por en numero minimo de slides: ' + num_slides_por_linea);
			}
			else
			{
				num_slides_por_linea = Math.ceil(max_num_slides);
				slide_width = gr.friwol.min_slide_width;
				margin_width = gr.friwol.min_margin_width + Math.floor(max_num_slides_overflow / (num_slides_por_linea - 1));
				if (margin_width < 0)
				{
					margin_width = 0;
					slide_width = Math.floor(gr.friwol._container_width / num_slides_por_linea);
				}

				if (gr.friwol.debug) console.log('Opto por en numero maximo de slides: ' + num_slides_por_linea + ', slide_width: ' + slide_width + ', margin_width: ' + margin_width);
			}
		}
		else if (Math.ceil(min_num_slides) == Math.floor(max_num_slides))
		{ // El número de slides es perfecto, vamos a por el de cabeza
			num_slides_por_linea = Math.floor(max_num_slides);
			margin_width = gr.friwol.min_margin_width;
			slide_width = Math.floor((gr.friwol._container_width - (margin_width * (num_slides_por_linea - 1))) / num_slides_por_linea);
			if (slide_width > gr.friwol.max_slide_width) slide_width = gr.friwol.max_slide_width;

			if (gr.friwol.debug) console.log('Opto por el numero perfecto de slides: ' + num_slides_por_linea);
		}
		else
		{ // Hay varias opciones posibles, toca buscar la mejor
			if (gr.friwol.debug) console.log('Toca buscar la combinación perfecta entre ' + Math.ceil(min_num_slides) + ' y ' + Math.floor(max_num_slides));

			num_slides_por_linea = Math.ceil(min_num_slides);
			slide_width = gr.friwol.max_slide_width;

			var cur_width_sobrante = false;
			for (var n=Math.ceil(min_num_slides); n<=Math.floor(max_num_slides); n++)
			{
				for (var p=gr.friwol.max_slide_width; p>=gr.friwol.min_slide_width; p--)
				{
					margin_width = gr.friwol.min_margin_width + Math.floor((gr.friwol._container_width - (p * n)) / (n - 1)) - gr.friwol.min_margin_width;

					if (margin_width < gr.friwol.min_margin_width) continue;

					if (margin_width == gr.friwol.min_margin_width)
					{
						num_slides_por_linea = n;
						slide_width = p;

						cur_width_sobrante = true;
						break;
					}

					width_sobrante = gr.friwol._container_width - (((p + margin_width) * (n - 1)) + p);
					//console.log('num_slides_por_linea: ' + n + ', slide_width: ' + p + ', margin_width: ' + margin_width + ', width_sobrante: ' + width_sobrante);

					if (cur_width_sobrante === false)
					{
						num_slides_por_linea = n;
						slide_width = p;

						cur_width_sobrante = width_sobrante;
						continue;
					}

					if (width_sobrante > cur_width_sobrante)
					{
						cur_width_sobrante = true;
						break;
					}

					//console.log('num_slides_por_linea: ' + n + ', slide_width: ' + p + ', margin_width: ' + margin_width);
				}

				if (cur_width_sobrante === true) break;
			}
		}

		slide_height = Math.round((slide_width * gr.friwol._slide_height) / gr.friwol._slide_width);

		if (num_slides_por_linea == 1)
			margin_width = gr.friwol._container_width - slide_width;
		else
			margin_width = gr.friwol.min_margin_width + Math.floor((gr.friwol._container_width - (slide_width * num_slides_por_linea)) / (num_slides_por_linea - 1)) - gr.friwol.min_margin_width;

		width_sobrante = gr.friwol._container_width - (((slide_width + margin_width) * (num_slides_por_linea - 1)) + slide_width);

		if (gr.friwol.debug) console.log('container_width: ' + gr.friwol._container_width + ', num_slides_por_linea: ' + num_slides_por_linea + ', slide_width: ' + slide_width + ', margin_width: ' + margin_width + ', width_sobrante: ' + width_sobrante);

		return {
			num_slides_por_linea: num_slides_por_linea,
			slide_width: slide_width,
			slide_height: slide_height,
			margin_width: margin_width,
			width_sobrante: width_sobrante
		};
	},

	responsive: function(fix_imgs)
	{
		if (gr.friwol.debug) console.log('function: responsive' + ((fix_imgs) ? ' - fix_imgs' : '') + ((gr.friwol._im_on_a_iframe) ? ' - on iframe' : ''));

		if (typeof fix_imgs == 'undefined') fix_imgs = true;

		if (gr.friwol._im_on_a_iframe)
		{
			var iframe_dimensions = gr.friwol.get_client_size();
			gr.friwol._container_width = iframe_dimensions.width - 2;
			gr.friwol._container_height = iframe_dimensions.height;
		}
		else
		{
			gr.friwol._container_width = $(gr.friwol.container_selector).width();
			gr.friwol._container_height = $(gr.friwol.container_selector).height();
		}

		var new_dimensions = gr.friwol.get_magic_with_maths();
		gr.friwol._slides_per_line = new_dimensions.num_slides_por_linea;

		var margin_width_portion = new_dimensions.margin_width / 2;

		if (gr.friwol.debug) console.log('imgs_width: ' + new_dimensions.slide_width + ', imgs_height: ' + new_dimensions.slide_height + ', margin_width_portion: ' + margin_width_portion);

		$(gr.friwol.slide_selector).removeClass('last_slide_of_row');

		var max_num_lines = gr.friwol.max_num_lines;
		if (gr.friwol._im_on_a_iframe)
		{
			max_num_lines = Math.floor(gr.friwol._container_height / (new_dimensions.slide_height + parseInt($(gr.friwol.slide_selector).css('margin-top'), 10) + parseInt($(gr.friwol.slide_selector).css('margin-bottom'), 10)));

			if (gr.friwol.debug) console.log('max_num_lines: ' + max_num_lines);
		}

		var i = 1;
		var linea = 1;
		var width_a_repartir_left = Math.floor(new_dimensions.width_sobrante / 2);
		var width_a_repartir_right = new_dimensions.width_sobrante - width_a_repartir_left;
		$(gr.friwol.slide_selector).each(function() {
			$(this).css('width', new_dimensions.slide_width);
			$(this).css('height', new_dimensions.slide_height);

			$(this).data('friwol-row', linea);

			if (max_num_lines)
			{
				if (linea > max_num_lines)
					$(this).css('opacity', 0);
				else
					$(this).css('opacity', 1);
			}

			if (fix_imgs) gr.friwol.fix_slide(this);

			if (i == (new_dimensions.num_slides_por_linea * linea))
			{
				$(this).css('margin-left', margin_width_portion);
				$(this).css('margin-right', 0).addClass('last_slide_of_row');

				linea++;
				width_a_repartir_left = Math.floor(new_dimensions.width_sobrante / 2);
				width_a_repartir_right = new_dimensions.width_sobrante - width_a_repartir_left;
			}
			else if ((i - 1) == (new_dimensions.num_slides_por_linea * (linea - 1)))
			{
				$(this).css('margin-left', 0);
				$(this).css('margin-right', margin_width_portion);
			}
			else
			{
				if (width_a_repartir_left > 0)
				{
					width_a_repartir_left--;
					$(this).css('margin-left', margin_width_portion + 1);
				}
				else
					$(this).css('margin-left', margin_width_portion);

				if (width_a_repartir_right > 0)
				{
					width_a_repartir_right--;
					$(this).css('margin-right', margin_width_portion + 1);
				}
				else
					$(this).css('margin-right', margin_width_portion);
			}

			i++;

			callbackFn = window['friwol_slide_resize_callback'];
			if (typeof callbackFn === 'function') callbackFn($(this));
		});

		if (gr.friwol.show_more && gr.friwol._slides_per_line > 1)
		{
			if ($('.more_label').width() > new_dimensions.slide_width)
				$('.more_label').hide();
			else
				$('.more_label').show();

			$('.more').css('top', $('.slide.last_slide_of_row')[0].offsetTop).css('left', $('.slide.last_slide_of_row')[0].offsetLeft).css('width', new_dimensions.slide_width).css('height', new_dimensions.slide_height).show();
		}
		else
			$('.more').hide();

		callbackFn = window['friwol_resize_callback'];
		if (typeof callbackFn === 'function') callbackFn();
	},

	fix_img: function(img_obj)
	{
		if (typeof img_obj == 'undefined') return false;

		if ($(img_obj).length) gr.friwol.fix_slide($(img_obj).closest(gr.friwol.slide_selector));
	},

	fix_slide: function(slide_obj)
	{
		if (typeof slide_obj == 'undefined') return false;

		if ($(slide_obj).length)
		{
			if (gr.friwol.fix_shutterstock) gr.friwol.fix_img_shutterstock({slide_id: $(slide_obj).attr('id'), img_id: $(slide_obj).data('img-id')});

			$(slide_obj).find('.friwol_overflow').each(function ()
			{
				$(this).css('top', Math.floor(($(this).parent().height() - $(this).height()) / 2));
				$(this).css('left', Math.floor(($(this).parent().width() - $(this).width()) / 2));
			});
		}
	},

	fix_img_shutterstock: function(data)
	{
		var correction_ratio = 2;

		if ((typeof data == 'undefined') || (typeof data.slide_id == 'undefined') || (typeof data.img_id == 'undefined')) return false;

		var slide_obj = $('#' + data.slide_id);
		var slide_width = $(slide_obj).width();
		var slide_height = $(slide_obj).height();

		if (($('#' + data.img_id + '_large').length > 0) && (slide_width > 150))
		{
			$('#' + data.img_id).parent().hide();
			$('#' + data.img_id + '_large').parent().show();

			data.img_id = data.img_id + '_large';
		}
		else
		{
			$('#' + data.img_id).parent().show();
			if ($('#' + data.img_id + '_large').length > 0) $('#' + data.img_id + '_large').parent().hide();
		}

		var img_obj = $('#' + data.img_id);
		var original_width = $(img_obj).data('original-width');
		var original_height = $(img_obj).data('original-height');
		var real_width = ($(img_obj).prop('naturalWidth') != 'undefined') ? $(img_obj).prop('naturalWidth') : $(img_obj).attr('naturalWidth');
		var real_height = ($(img_obj).prop('naturalHeight') != 'undefined') ? $(img_obj).prop('naturalHeight') : $(img_obj).attr('naturalHeight');

		if (gr.friwol.debug2) console.log('slide_width: ' + slide_width + ', original_width: ' + original_width + ', real_width: ' + real_width);
		if (gr.friwol.debug2) console.log('slide_height: ' + slide_height + ', original_height: ' + original_height + ', real_height: ' + real_height);

		var width_calculated = Math.round((slide_width * original_width) / original_height);
		var height_calculated = Math.round((slide_height * original_height) / original_width);

		if (gr.friwol.debug2) console.log('width_calculated: ' + width_calculated);
		if (gr.friwol.debug2) console.log('height_calculated: ' + height_calculated);

		// Imagenes con la banda en la derecha
		if ((original_width != 'undefined') && (Math.abs(original_width - real_width) > correction_ratio))
		{
			if (gr.friwol.debug2) console.log('banda lateral');

			if (original_width == original_height)
				$(img_obj).parent().css('width', slide_width).css('height', '');
			else if (original_width < original_height)
				$(img_obj).parent().css('width', width_calculated).css('height', '');
			else
				$(img_obj).parent().css('width', '').css('height', height_calculated);

			if (original_width <= original_height)
				$(img_obj).css('width', '').css('height', slide_height);
			else
				$(img_obj).css('width', '').css('height', '100%');
		}

		// Imagenes con la banda abajo
		if ((original_height != 'undefined') && (Math.abs(original_height - real_height) > correction_ratio))
		{
			if (gr.friwol.debug2) console.log('banda abajo');

			if (original_width == original_height)
				$(img_obj).parent().css('width', width_calculated).css('height', height_calculated);
			else
				$(img_obj).parent().css('width', '').css('height', height_calculated);

			if (original_width >= original_height)
				$(img_obj).css('width', slide_width).css('height', '');
			else
				$(img_obj).css('width', '100%').css('height', '');
		}

		// Imágenes sin banda
		if ((original_width != 'undefined') && (Math.abs(original_width - real_width) < correction_ratio) && (original_height != 'undefined') && (Math.abs(original_height - real_height) < correction_ratio))
		{
			if (gr.friwol.debug2) console.log('sin banda');

			$(img_obj).parent().css('width', slide_width).css('height', slide_height);
		}
	},

	get_client_size: function()
	{
		var my_width = 0;
		var my_height = 0;

		if (typeof(window.innerWidth) == 'number')
		{
			//Non-IE
			my_width = window.innerWidth;
			my_height = window.innerHeight;
		}
		else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
		{
			//IE 6+ in 'standards compliant mode'
			my_width = document.documentElement.clientWidth;
			my_height = document.documentElement.clientHeight;
		}
		else if (document.body && (document.body.clientWidth || document.body.clientHeight))
		{
			//IE 4 compatible
			my_width = document.body.clientWidth;
			my_height = document.body.clientHeight;
		}

		return {width : my_width, height : my_height};
	}
};


$(document).ready(function() { gr.friwol.init(); $(window).on('resize', gr.friwol.responsive); });