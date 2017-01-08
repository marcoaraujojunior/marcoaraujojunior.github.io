/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var settings = {

		// Parallax background effect?
			parallax: true,

		// Parallax factor (lower = more intense, higher = less intense).
			parallaxFactor: 20

	};

	skel.breakpoints({
		xlarge: '(max-width: 1800px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

    formtatDate = function(date) {
        date = new Date(date);
        return date.getFullYear() + '-'+
            ('0' + (date.getMonth()+1) ).slice(-2) + '-' +
            ('0' + date.getDate() ).slice(-2) + ' ' +
            ('0' + date.getHours() ).slice(-2) + ':' +
            ('0' + date.getMinutes() ).slice(-2) + ':' +
            ('0' + date.getSeconds() ).slice(-2);
    };

    article = function (item) {
        pushedAt = formtatDate(item.pushed_at);
        return '<article class="6u 12u$(xsmall) work-item">' +
            '<a href="' + item.html_url + '" class="image fit thumb">' +
                '<img src="images/thumbs/github.png" alt="" />' +
            '</a>' +
            '<h3>' +item.name+ '</h3>' +
            '<p>' + item.description + '</p>'+
            '<p> Pushed At: ' + pushedAt + '</p>'+
        '</article>';
    };

	$(function() {

		var $window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$footer = $('#footer'),
			$main = $('#main');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// Touch?
			if (skel.vars.mobile) {

				// Turn on touch mode.
					$body.addClass('is-touch');

				// Height fix (mostly for iOS).
					window.setTimeout(function() {
						$window.scrollTop($window.scrollTop() + 1);
					}, 0);

			}

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Footer.
			skel.on('+medium', function() {
				$footer.insertAfter($main);
			});

			skel.on('-medium !medium', function() {
				$footer.appendTo($header);
			});

		// Header.

			// Parallax background.

				// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
					if (skel.vars.browser == 'ie'
					||	skel.vars.mobile)
						settings.parallax = false;

				if (settings.parallax) {

					skel.on('change', function() {

						if (skel.breakpoint('medium').active) {

							$window.off('scroll.strata_parallax');
							$header.css('background-position', 'top left, center center');

						}
						else {

							$header.css('background-position', 'left 0px');

							$window.on('scroll.strata_parallax', function() {
								$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
							});

						}

					});

					$window.on('load', function() {
						$window.triggerHandler('scroll');
					});

				}

		// Main Sections: Two.

			// Lightbox gallery.
				$window.on('load', function() {
                    var date = new Date();
                    date.setMonth(date.getMonth() - 3);
                    pushedTo = date.getFullYear() + '-'+
                        ('0' + (date.getMonth()+1) ).slice(-2) + '-' +
                        ('0' + date.getDate() ).slice(-2);

                    $.getJSON(
                        "https://api.github.com/search/repositories",
                        {
                            q: 'user:marcoaraujojunior pushed:>' + pushedTo +' fork:true',
                            sort: "updated",
                            order: "desc"
                        },
                        function (data) {
                            for (i in data.items) {
                                $("#two > div").append(article(data.items[i]));
                            }
                        }
                    );
				});
	});

})(jQuery);
