var $naruto, $bomb, widget;
var max_left = 800;
var pause = false;
var back_released = true;
var tracks_count = 0;
var tracks_count_loaded = 0;
var dot = "";

var get_css_value = function (property) {
	return parseInt($naruto.css(property).replace("px", ""));
};

var left = function () {
	$('audio.jump_audio').get(0).play();
	var value = (get_css_value('margin-left') <= 50) ? '0px' : '-=50px'
	$naruto.addClass('walk_back').css({ marginLeft: value });
	pause = true;
	window.setTimeout(function () {
		$('audio.jump_audio').get(0).pause();
		$('audio.jump_audio').get(0).currentTime = 0;
		$naruto.removeClass('walk_back');
		pause = false;
		back_released = true;
	}, 500);
};
var right = function () {
	var value = (get_css_value('margin-left') >= max_left) ? max_left + 'px' : '+=10px'
	$naruto.addClass('walk').css({ marginLeft: value });
	$('audio.walk_audio').get(0).play();
};
var punch = function () {
	$('audio.punch_audio').get(0).play();
	$naruto.addClass('punch');
};

var jump = function () {
	$('audio.jump_audio').get(0).play();
	$naruto.addClass('jump');
	pause = true;
	window.setTimeout(function () {
		reset_audio('.jump_audio');
		$naruto.removeClass('jump');
		pause = false;
	}, 500);
};

var kneel = function () {
	$naruto.addClass('kneel');
};

var rasengan = function () {
	pause = true;
	$('audio.rasengan_audio').get(0).play();
	$naruto.addClass('rasengan');
	window.setTimeout(function () {
		$bomb.addClass('rasengan_bomb');
	}, 5200);
	window.setTimeout(function () {
		$naruto.removeClass('rasengan');
		pause = false;
		$bomb.removeClass('rasengan_bomb');
		reset_audio('.rasengan_audio');
	}, 8000);
};

var rasenshuriken = function () {
	pause = true;
	$('audio.rasenshuriken_audio').get(0).play();
	$naruto.addClass('rasenshuriken');
	window.setTimeout(function () {
		$bomb.addClass('rasenshuriken_bomb');
	}, 5000);
	window.setTimeout(function () {
		$naruto.removeClass('rasenshuriken');
		$bomb.removeClass('rasenshuriken_bomb');
		pause = false;
		reset_audio('.rasenshuriken_audio');
	}, 8000);
};

var summon = function () {
	pause = true;
	$naruto.addClass('summon');
	$('audio.summon_audio').get(0).play();
	window.setTimeout(function () {
		$naruto.removeClass('summon');
		pause = false;
		reset_audio('.summon_audio');
	}, 3000);
};

$(document).on('keydown keyup', function (e) {
	if($('.theme').get(0).paused){
		$('.theme').get(0).play();
	}
	if (!pause) {
		if (e.type == 'keydown') {
			switch (e.which) {
				case 37:
					$naruto.removeClass('walk kneel punch');
					if (back_released) {
						back_released = false;
						left();
					}
					break;

				case 38:
					$naruto.removeClass('walk kneel punch');
					jump();
					break;

				case 39:
					right();
					break;

				case 40:
					kneel()
					break;

				case 32:
					$naruto.removeClass('walk kneel punch');
					rasengan();
					break;

				case 16:
					$naruto.removeClass('walk kneel punch');
					rasenshuriken();
					break;

				case 65:
					punch();
					break;

				case 83:
					$naruto.removeClass('walk kneel punch');
					summon();
					break;

				default:
					return;
			}
		} else {
			reset_audio('.walk_audio');
			$naruto.removeClass('walk kneel punch');
		}
	}
	e.preventDefault();
});

$(document).ready(function () {
	$naruto = $('.naruto');
	$bomb = $('.bomb');
	max_left = $(window).width() - 100 - (parseInt($('.arena').css('left').replace("px", "")) * 2);


	if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
		$('.loader').fadeOut();
		$('.browser_message').fadeIn();
	} else {
		$('.loader p').html('Loading audio effects.' + dot);
		$('audio.sound_effect').each(function () {
			LoadSound($(this).attr('src'));
		});
		$('.loader p').html('Loading graphics...');
		window.setTimeout(function () {
			$('.overlay').fadeOut();
		}, 10000);
	}

	$('.mute_effects').on('change', function (e) {
		var volume = ($(this).prop('checked')) ? 1 : 0;
		$('audio.sound_effect').each(function () {
			$(this).get(0).volume = volume;
		});
		$('.theme').get(0).volume = volume;
	});

	$('.help_icon,.info_icon').on('click', function (e) {
		$(this).next().slideToggle();
	});



});

var reset_audio = function (elem_class) {
	try {
		$('audio' + elem_class).get(0).pause();
		$('audio' + elem_class).get(0).currentTime = 0;
	}
	catch (err) {
		$('.effects_msg').html('Your browser does not supports mp3/wav files, please update it.');
	}
};

function LoadSound(soundfile) {
	$.ajax({
		url: window.location.href + soundfile,
		success: function () {
			tracks_count_loaded++;
			dot = dot + ".";
			if (tracks_count_loaded == tracks_count) {
				$('.overlay').fadeOut();
			} else {
				$('.loader p').html('Loading audio effects.' + dot);
			}
		}
	});
}