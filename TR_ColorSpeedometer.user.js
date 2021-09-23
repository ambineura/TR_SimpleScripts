// ==UserScript==
// @name           TR_ColorSpeedometer
// @namespace      typeracer
// @include        http*://typeracer.ru/*
// @author         un4given
// @version        1.0.1
// @description    Спидометр, меняющий цвет фона в зависимости от скорости
// @run-at         document-idle
// ==/UserScript==

//do nothing, if we are not in main window (honestly I dunno if this shit is still needed in 2021)
if (window.self != window.top) return;

function main() {

	function addStyle(css)
	{
		var style=document.createElement('style');
		style.textContent = css;
		var target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
		target.appendChild(style);
	}

// --- ENTRY POINT ---

	(new MutationObserver(function(changes, observer) {
		var el = document.getElementsByTagName('h2');
		if (!el.length) return;
		observer.disconnect();

		setTimeout(function colorSpeedometer() {
			var isInGame = location.href.indexOf('typeracer.ru/game')!=-1;
			if (isInGame) {
				// We have no element id, so access it perverted way: 
				// firstly, find the speed display element...
				var s = document.getElementsByTagName('h2')[0];
				if (s && s.parentElement.parentElement)
				{
					var speedStr = ('000'+s.textContent).substr(-4);

					//...and set its parent's parent attribute data-speed:
					s.parentElement.parentElement.setAttribute('data-speed', speedStr);

					// additionally, set data-speed attribute to the field with text (reserved for future use)
//					document.getElementsByClassName('apply-font')[0].setAttribute('data-speed', speedStr);
				}
			}

			var delay = (isInGame)?250:2500;
			setTimeout(colorSpeedometer, delay);
			
		}, 250);

	})).observe(document, {childList: true, subtree: true});

// --- Let's add some CSS!
// data-speed is always 4 chars width (padded with 0), so 01xx means 1xx cpm, 02xx − 2xx and so on...

var colors = [
//  speed, bgcolor,   textcolor

//	['01', '#      ', '#      '],	//  100+ cpm
//	['02', '#      ', '#      '],	//  200+ cpm
//	['03', '#      ', '#      '],	//  300+ cpm
//	['04', '#      ', '#      '],	//  400+ cpm
	['05', '#339933', '#ffffff'],	//  500+ cpm
	['06', '#fff800', '#000000'],	//  600+ cpm
	['07', '#aa0000', '#ffffff'],	//  700+ cpm
	['08', '#8f00ff', '#ffffff'],	//  800+ cpm
	['09', '#ffffff', '#000000'],	//  900+ cpm
//	['10', '#      ', '#      '],	// 1000+ cpm
//	['11', '#      ', '#      '],	// 1100+ cpm
//	['12', '#      ', '#      '],	// 1200+ cpm
];

var css = "div[data-speed] {transition: .1s ease; transition-property: background-color, color;}";

colors.forEach(function(col){
	css += `
div[data-speed^="${col[0]}"] {background-color: ${col[1]};}
div[data-speed^="${col[0]}"] h2 {color: ${col[2]};}
`
});

	addStyle(css);

// --- END OF FUNCTION MAIN --- //
}

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

window.addEventListener('load', function() {
    exec(main);
}, false);
