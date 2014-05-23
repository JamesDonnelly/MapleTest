$(function() {
	$.fn.extend({
		dialog: function(npc, content, type) {
			// To do: Dynamic dialog windows
		},
		life: function() {
			var $lifeContainer = $(this),
				$lives = $lifeContainer.children(),
				current = 0,
				count = 0,
				delays = [];

			$.each($lives, function(i) {
				var $life = $(this),
					delay = +$life.data('delay');

				count = i;

				if (delay)
					delays.push(delay);
			});

			if (delays.length > 0
				&& delays.length === count + 1)
				$lifeContainer.lifeAnimation($lives, delays, current, count);
		},
		lifeAnimation: function($lives, delays, current, count) {
			var $lifeContainer = $(this),
				$currentlife = $lifeContainer.find('[data-anim="' + current + '"]'),
				next = current === count ? 0 : current + 1;
			
			$lives.not($currentlife).css({opacity: 0});
			$currentlife.css({opacity: 1});

			setTimeout(function() {
				$lifeContainer.lifeAnimation($lives, delays, next, count);
			}, delays[current]);
		},
		openDialog: function() {
			var rel = $(this).data('dialog-rel'),
				$dialog = $('[data-dialog="' + rel + '"]');

			$('.dialog, .blueDialog').not($dialog).hide();
			$('.dialogContainer').css({display: 'table'});
			$dialog.css({display: 'table'});
		}
	});

	var drag = {
			enabled: false,
			$elem: null,
			offX: 0,
			offY: 0,
			initialX: 0,
			initialY: 0
		};

	$('[data-npc="mapleadmin"]').life();
	$('[data-npc="mapleadmin2"]').life();

	$('[data-has-dialog]')
		.not('[data-has-dialog="false"], [data-has-dialog="0"]')
		.on('click', function() { $(this).openDialog() });

	$('body').on('click', 'a.end-chat', function(e) {
		e.preventDefault();

		$('.dialog, .dialogContainer').hide();
	});

	$('body').on('mousedown', '.drag', function(e) {
		drag.enabled = true;
		drag.$elem = $(this).parent();

		var elementOffsetX = drag.$elem.offset().left,
			elementOffsetY = drag.$elem.offset().top;

		drag.initialX = drag.$elem.position().left;
		drag.initialY = drag.$elem.position().top;

		drag.$elem.css({
			position: 'fixed',
			left: elementOffsetX,
			top: elementOffsetY
		});

		drag.offX = elementOffsetX - e.pageX;
		drag.offY = elementOffsetY - e.pageY;
	});

	$('body').on('mouseup', function() {
		if (!drag.enabled)
			return;

		drag.enabled = false;
		drag.$elem = null;
	});

	$('body').on('mousemove', function(e) {
		if (!drag.enabled)
			return;

		var x = e.pageX,
			y = e.pageY,
			posX = x + drag.offX,
			posY = y + drag.offY;

		drag.$elem.css({
			left: posX,
			top: posY
		})
	});
});