/**
 * LinkPeek v0.1.0
 * Require jQuery 1.7+
 * MIT License 
 * for mor info please visit: 
 */

(function($) {

    $.fn.linkpeek = function(options) {

        var settings = $.extend({
                selector: 'a',
                combineKey: 'alt',
                autoHide: true,
                duration: 250,
                size: {'width': '80%', 'height': '80%'}
        }, options);

        //disable on touch devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return;
        }

        return this.each(function() {

            var $this = $(this),
                $target = $(settings.selector),
                $peekBox = createPeekBox(),
                $maskLayer = createMaskLayer();

            // click on link to peek
            $target.on('click', showPeekBox);

            // click out of peek box to hide
            $maskLayer.on('click', hidePeekBox);

            // hide peek box when mouse leave
            if (settings.autoHide) {
                $peekBox.on('mouseleave', hidePeekBox);
            }

            function showPeekBox(event) {
                var link = this.href,
                    keyDown = settings.combineKey.toLowerCase() + 'Key';

                // check key pressed
                if (settings.combineKey && !event[keyDown]) return true;

                // ignore link with '#'
                if (link.search(/#/g) !== -1) return true;

                $peekBox.find("iframe").remove();
                $peekBox.append($('<iframe src=' + link + '></iframe>').css({
                        'position': 'absolute',
                        'top': '1.6em',
                        'width': '100%',
                        'height': '100%',
                        'border': 'none'}))
                    .find('div').text(link);
                $this.append($maskLayer.show()).append($peekBox);

                setTimeout(function() {
                    $peekBox.css({
                        'transition': 'all ' + settings.duration + 'ms',
                        'opacity': '1',
                        'transform': 'scale(1.1)'
                    });
                }, 1); // 1ms delay for animation

                setTimeout(function() {
                    $peekBox.css({
                        'transition': 'all .1s',
                        'transform': 'scale(1)'
                    });
                }, settings.duration);

                return false;
            }

            function hidePeekBox(event) {
                $maskLayer.hide();

                $peekBox.css({
                    'transition': 'all ' + settings.duration + 'ms',
                    'opacity': '0'
                });

                setTimeout(function() {
                    $peekBox.css('transform', 'scale(0)');
                }, settings.duration);

                return false;
            }

            function createPeekBox() {
                var $peekBoxTitle, $peekBox,
                    peekBoxWidth = settings.size['width'],
                    peekBoxHeight = settings.size['height'];

                $peekBoxTitle = $('<div></div>')
                    .css({
                        'position': 'absolute',
                        'top': '0',
                        'width': '100%',
                        'padding': '.4em 0',
                        'background': '#eee',
                        'cursor': 'pointer',
                        'text-align': 'center',
                        'font-size': '.8em',
                        'font-family': '"Helvetica Neue",Arial,"Microsoft YaHei",sans-serif',
                    })
                    .on('click', function() {
                        hidePeekBox();
                        window.open($(this).text());
                    });

                $peekBox = $('<div class="linkpeek-peekbox"></div>')
                    .css({
                        'position': 'fixed',
                        'top': (50 - parseInt(peekBoxHeight) / 2) + '%',
                        'left': (50 - parseInt(peekBoxWidth) / 2) + '%',
                        'width': peekBoxWidth,
                        'height': peekBoxHeight,
                        'z-index': '2147483647',
                        'background': '#fff',
                        'border-radius': '10px',
                        'box-shadow': '0 4px 23px 5px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0,0,0,0.15)',
                        'overflow': 'hidden',
                        'transform': 'scale(0)'
                    });
                
                return $peekBox.append($peekBoxTitle);
            }

            function createMaskLayer() {
                $maskLayer = $('<div class="linkpeek-mask"></div>')
                    .css({
                        'position': 'fixed',
                        'top': '0',
                        'left': '0',
                        'width': '100%',
                        'height': '100%',
                        'z-index': '2147483646',
                        'background': '#fff',
                        'opacity': '.75'});

                return $maskLayer;
            }
        });
    }
})(jQuery);
