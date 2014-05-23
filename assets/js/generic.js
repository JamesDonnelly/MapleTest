$(function() {
	var fakeJson = {
		dialog: {
			test: {
				type: "blueDialog",
				drag: {
					enabled: true,
					height: 14,
					left: 0,
					top: -28
				},
				npc: {
					name: "mapleadmin2",
					frames: {
						0: {
							delay: 2350
						},
						1: {
							delay: 150
						}
					}
				},
				html: "Hello, world!",
				controls: {
					0: {
						real: "end-chat",
						position: "left",
						type: "close"
					}
				}
			}
		},
		npcChat: {
			mapleadmin: {
				0: "Hello! Click me?",
				1: "This is a test~",
				2: "Tryst was here! This should hopefully support multi-line chat messages!"
			}
		}
	}

	$.fn.extend({
		life: function() {
			var $lifeContainer = $(this),
				$lives = $lifeContainer.children('[data-anim]'),
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
				dialog = fakeJson.dialog[rel],
				$dialogContainer = $('.dialogContainer'),
				$dialogContainerInner = $dialogContainer.children('div'),
				$dialog = $('<article />', {
					'class': dialog.type
				}).appendTo($dialogContainerInner),
				$npcContainer = $('<div />')
					.appendTo($dialog)
					.attr('data-npc', dialog.npc.name),
				$controls = $('<div />', {
					'class': "controls"
				}).appendTo($dialog);

			// Generate drag control
			if (dialog.drag.enabled) {
				$('<div/>', {
					'class': "drag"
				})
					.appendTo($dialog)
					.css({
						height: dialog.drag.height,
						left: dialog.drag.left,
						top: dialog.drag.top
					})
			}

			// Generate dialog NPC
			for (var npc in dialog.npc.frames) {
				$('<div/>')
					.appendTo($npcContainer)
					.attr('data-anim', npc)
					.attr('data-delay', dialog.npc.frames[npc].delay);
			}

			// Generate the dialog content
			$('<div/>', {
				'class': "content",
				'html': dialog.html
			}).appendTo($dialog);

			// Generate the dialog controls
			for (var control in dialog.controls) {
				$('<a/>', {
					'class': dialog.controls[control].real,
					'href': "javascript:void(0)"
				})
					.appendTo($controls)
					.attr('data-button-type', dialog.controls[control].type);
			}

			// Remove any existing dialog
			$dialogContainerInner.children().not($dialog).remove();

			// Make dialog container visible
			$('.dialogContainer').css({display: 'table'});

			// Make dialog visible
			$dialog.css({display: 'table'});
		},
		chat: function(current, rel) {
			var $npc = $(this),
				$chat = $npc.find('.chat'),
				rel = rel || $npc.data('npc'),
				chat = fakeJson.npcChat[rel],
				current = current || 0,
				next = current + 1 === Object.keys(chat).length ? 0 : current + 1;

			$chat.text(chat[current]).show();

			setTimeout(function() {
				$chat.hide();
				setTimeout(function() {
					$npc.chat(next, rel);
				}, Math.round(Math.random() * 5000));
			}, 4000);
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
	$('[data-npc="mapleadmin"]').chat();
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