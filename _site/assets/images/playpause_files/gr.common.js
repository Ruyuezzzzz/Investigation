byId = function(id)
{
	return document.getElementById(id);
};

byClass = function(className)
{
	return document.getElementsByClassName(className);
};

byTag = function(tag)
{
	return document.getElementsByTagName(tag);
};

$$ = function(selector)
{
	if (typeof selector == 'undefined') return null;
	if (selector === '') return null;

	return (selector.substring(0, 1) === '#') ? document.getElementById(selector.substring(1)) : document.querySelectorAll(selector);
};

Element.prototype.addClass = function(className) { this.classList.add(className); };
Element.prototype.hasClass = function(className) { return this.classList.contains(className); };
Element.prototype.removeClass = function(className) { this.classList.remove(className); };
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(callback, thisArg) {
		var T, k; if (this === null) {throw new TypeError(' this is null or not defined'); }
		var O = Object(this); var len = O.length >>> 0;
		if (typeof callback !== "function") {throw new TypeError(callback + ' is not a function'); }
		if (arguments.length > 1) {T = thisArg; } k = 0;
		while (k < len) {var kValue; if (k in O) {kValue = O[k]; callback.call(T, kValue, k, O); } k++; }
	};
}
NodeList.prototype.forEach = Array.prototype.forEach;
Element.prototype.on = function(event, callback) { this[ addEventListener ? 'addEventListener' : 'attachEvent' ]( addEventListener ? event : 'on' + event, callback ); };
NodeList.prototype.on = function(event, callback) { this.forEach(function(e){ e.on(event, callback); }); };
var ls = localStorage;
var ss = sessionStorage;

var gr = {
	version					: '0.01',
	debug						: true,
	loader_class		: 'loader',
	mobile					: false,
	lang						: 'en',

	log : function(error)
	{
		if (gr.debug && typeof console !== "undefined")
			console.log(error);
	},

	loader : function(show, message)
	{
		if (typeof show == 'undefined') show = true;
		if (typeof message == 'undefined') message = '';

		if (show)
		{
			if (!$$('#gr_loader'))
				$('body').append('<div class="loader" id="gr_loader"><div class="spinner"></div><i></i><span>' + message + '</span></div>');
			else
				$('#gr_loader span').html(message);

			$('#gr_loader').fadeIn();
		}
		else
			$('#gr_loader').fadeOut();
	},

	displayErrors : function(data)
	{
		$('#' + data.field + '_error').remove();

		if (typeof data.errors == 'undefined') return;

		var error_msg = '';
		for (var i=0; i<data.errors.length; i++)
		{
			BR = (error_msg !== '') ? '<br />' : '';
			error_msg += BR + data.errors[i];
		}

		$('#' + data.field).after('<span class="help-inline error" id="' + data.field + '_error">' + error_msg + '</span>');
	},

	cookie : function(cookie_name, value, expiration)
	{
		if (typeof value == 'undefined')
		{
			if (!cookie_name) return false;

			return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(cookie_name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || false;
		}
		else
		{
			if (value === false)
			{
				document.cookie = encodeURIComponent(cookie_name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				return true;
			}
			else
			{
				if (!cookie_name || /^(?:expires|max\-age|path|domain|secure)$/i.test(cookie_name)) return false;

				var sExpires = "";
				if (expiration)
				{
					switch (expiration.constructor)
					{
						case Number:
							sExpires = expiration === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + expiration;
							break;

						case String:
							sExpires = "; expires=" + expiration;
							break;

						case Date:
							sExpires = "; expires=" + expiration.toUTCString();
							break;
					}
				}

				document.cookie = encodeURIComponent(cookie_name) + "=" + encodeURIComponent(value) + sExpires + "; path=/";
				return true;
			}
		}
	},

	preventDefault : function(ev)
	{
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		else
		{
			ev.returnValue = false;
		}
	},
};

function sleep(milliseconds)
{
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++)
	{
		if ((new Date().getTime() - start) > milliseconds) break;
	}
}

function redirect(data)
{
	if (typeof data == 'undefined')
	{
		if ((window.location.href.match(/#/g) || []).length > 0)
			window.location.reload();
		else
			window.location.href = window.location.href;
	}
	else if (typeof data.redirect_url != 'undefined')
		window.location.href = data.redirect_url;
	else
		window.location.href = data;
}

var pu_window;

function pu(pu_url)
{
	var pu_width = $(window).width() - 200;
	var pu_height = $(window).height() - 50;
	var b = "toolbar=0,statusbar=1,resizable=1,scrollbars=0,menubar=0,location=1,directories=0";

	if (navigator.userAgent.indexOf("Chrome") != -1) b = "scrollbar=yes";

	var a = window.open("about:blank", "", b + ",height=" + pu_height + ",width=" + pu_width);

	if (navigator.userAgent.indexOf("rv:2.") != -1)
	{
		a.puPop = function (c) {
			if (navigator.userAgent.indexOf("rv:2.") != -1) this.window.open("about:blank").close();
			this.document.location.href = c;
		};

		a.puPop(pu_url);
	}
	else
		a.document.location.href = pu_url;

	setTimeout(window.focus, 200);
	window.focus();

	if (a)
	{
		a.moveTo(window.screenX + 2, window.screenY+2);
		a.blur();
		self.focus();
	}
	else
	{
		done_pu = null; ifSP2 = false;
		if (typeof (pu_window) == "undefined") pu_window = false;

		if (window.SymRealWinOpen) open = SymRealWinOpen;
		if (window.NS_ActualOpen) open = NS_ActualOpen;

		ifSP2 = (navigator.userAgent.indexOf("SV1") != -1);

		if (!ifSP2)
			do_pu();
		else
		{
			if (window.Event) document.captureEvents(Event.CLICK);

			document.onclick = do_clicked_pu;
		}

		self.focus();
		do_clicked_pu();
	}

	return this;
}

function do_pu()
{
	if (!pu_window) {
		done_pu = open(pu_url, "", "toolbar=1,location=1,directories=0,status=1,menubar=1,scrollbars=1,resizable=1");

		if (done_pu)
		{
			pu_window = true;
			self.focus();
		}
	}
}

function do_clicked_pu()
{
	if (!pu_window)
	{
		if (!ifSP2)
		{
			done_pu = open(pu_url, "", "toolbar=1,location=1,directories=0,status=1,menubar=1,scrollbars=1,resizable=1");
			self.focus();

			if (done_pu) pu_window = true;
		}
	}

	if (!pu_window)
	{
		if (window.Event) document.captureEvents(Event.CLICK);

		document.onclick = do_pu;
		self.focus();
	}
}

function clear_errors()
{
	clear_input_errors();

	$('div.alert:not(.fix_alert)').remove();
}

function clear_input_errors()
{
	$('input.error').removeClass('error');
	$('span.error').remove();
}

function display_input_errors(data, field_prefix, form_container)
{
	spinner_off();
	gr.loader(false);

	if (typeof field_prefix == 'undefined') field_prefix = '';

	clear_input_errors();

	if (typeof data == 'string')
		$('#' + form_container + ' form button:last-child').before('<div class="alert danger zoomIn"><i class="flaticon-exclamation"></i><p>' + data + '</p></div>');
	else
	{
		for (var field in data)
		{
			var errors = data[field];

			$('#' + field_prefix + field + '_error').remove();

			if (typeof errors == 'undefined') return;

			$('#' + field_prefix + field).addClass('error').parent().after('<span class="error login-error">' + errors[0] + '</span>');

			if ($('#' + field_prefix + field).data('label')) $('#' + field_prefix + field).siblings(".error").children('strong.error_field').html($('#' + field_prefix + field).data('label'));
		}

		$('span.error').animate({ opacity: 1 });
	}
}

function set_box_events(box_name, clear_display_errors)
{
	if (typeof clear_display_errors == 'undefined') clear_display_errors = true;

	if (clear_display_errors) clear_errors();

	$('.gr_to_show_onmessage').hide();
	$('.gr_to_hide_onmessage').show();

	$('#gr_' + box_name + 'box .reset-input').unbind();
	$('#gr_' + box_name + 'box .reset-input').on('click', function()
	{
		if ($(this).siblings('input').val() !== '') $(this).siblings('input').val('').focus();

		$(this).siblings('input').removeClass('error').parent().next('span.error').remove();

		return false;
	});

	$('#gr_' + box_name + 'box input').unbind();
	$('#gr_' + box_name + 'box input').on('blur', function()
	{
		if (!$(this).val())
			$(this).removeClass('hascontent');
		else
			$(this).addClass('hascontent');
	});

	$('input').each(function()
	{
		if (!$(this).val())
			$(this).removeClass('hascontent');
		else
			$(this).addClass('hascontent');
	});

	$('#gr_' + box_name + 'box input').on('keyup', function() { $(this).removeClass('error').parent().next('span.error').remove(); });

	$('body').css('overflow', 'hidden');
	$('.gr_box:not(.nolo_anime)').animate({ top: 100, opacity: 0 }, function()
	{
		$(this).hide();
		$('#gr_' + box_name + 'box').show();

		if ($('#gr_' + box_name + 'box').hasClass('nolo_anime'))
			$('#gr_' + box_name + 'box').hasClass('nolo_anime').removeClass('nolo_anime');
		else
			$('#gr_' + box_name + 'box').animate({ top: 0, opacity: 1 }, function() { $('body').css('overflow','visible'); });
	});

	if ($('.gr_box.nolo_anime')) $('body').css('overflow','visible');

	$('.gr_box').removeClass('nolo_anime');

	//Show password sign up
	$('#register-show-password').on('change', function()
	{
		if ($(this).is(':checked'))
			$('#register-password').attr('type','text');
		else
			$('#register-password').attr('type','password');
	});

	// ReCAPTCHA
	$('#gr_login_recaptcha_container').empty();
	$('#gr_login_recaptcha_container').data('wid', '');

	$('#gr_register_recaptcha_container').empty();
	$('#gr_register_recaptcha_container').data('wid', '');

	$('#gr_lostpassword_recaptcha_container').empty();
	$('#gr_lostpassword_recaptcha_container').data('wid', '');

	if ((box_name == 'register') && $$('#gr_register_recaptcha_container'))
	{
		$('#register-username, #register-email').on('blur', function()
		{
			if (($$('#register-username').value !== '') && ($$('#register-email').value !== '') && ($('#gr_register_recaptcha_container').data('wid') === ''))
			{
				var recaptcha_widget_id = grecaptcha.render('gr_register_recaptcha_container', {'sitekey' : RE_CAPTCHA_API_KEY});
				$('#gr_register_recaptcha_container').data('wid', recaptcha_widget_id);
			}
		});
	}
	else if ((box_name == 'lostpassword') && $$('#gr_lostpassword_recaptcha_container'))
	{
		$('#password-recover').on('keyup', function()
		{
			if (($$('#password-recover').value !== '') && ($('#gr_lostpassword_recaptcha_container').data('wid') === ''))
			{
				var recaptcha_widget_id = grecaptcha.render('gr_lostpassword_recaptcha_container', {'sitekey' : RE_CAPTCHA_API_KEY});
				$('#gr_lostpassword_recaptcha_container').data('wid', recaptcha_widget_id);
			}
		});
	}
}

function spinner_on(disable_inputs)
{
	$('.login-error').remove();

	if ((typeof disable_inputs != 'undefined') && disable_inputs)
	{
		var input_list = $$('input');
		for (var i=0; i<input_list.length; i++)
		{
			input_list[i].disabled = true;
		}
	}

	$('.spinner_button').prop('disabled', 'disabled');
	$('.spinner_button').prepend('<div class="spinner button-spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
}

function spinner_off(box_name)
{
	var input_list = $$('input');
	for (var i=0; i<input_list.length; i++)
	{
		input_list[i].disabled = false;
	}

	$('.spinner_button').prop('disabled', '');
	$('.spinner').remove();
}

function display_password_strength(password)
{
	$('.password-result-container span').hide();

	if (password.length === 0) return;

	//initial strength
	var strength = 0;

	//if length is 8 characters or more, increase strength value
	if (password.length > 7) strength += 1;

	//if password contains both lower and uppercase characters, increase strength value
	if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1;

	//if it has numbers and characters, increase strength value
	if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1;

	//if it has one special character, increase strength value
	if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1;

	//if it has two special characters, increase strength value
	if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

	//now we have calculated strength value, we can return messages

	if (password.length < 6)
		$('.password-result-container span.short').show();
	else if (strength < 2 )
		$('.password-result-container span.weak').show();
	else if (strength == 2 )
		$('.password-result-container span.good').show();
	else
		$('.password-result-container span.strong').show();
}

function twpopup(popwhat) { window.open(popwhat, "twshare", "height=400,width=550,resizable=1,toolbar=0,menubar=0,status=0,location=0"); }
function fbpopup(popwhat) { window.open(popwhat, "fbshare", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"); }
function pinpopup(popwhat) { window.open(popwhat, "pinshare", "height=270,width=630,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"); }
function glpopup(popwhat) { window.open(popwhat, "glshare", "height=270,width=630,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"); }
function stbpopup(popwhat) { window.open(popwhat, "stbshare", "height=270,width=630,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"); }

!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);

// mobile detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) gr.mobile = true;

$(function() {
	gr.lang = (typeof $('body').data('lang') != 'undefined') ? $('body').data('lang') : 'en';
});