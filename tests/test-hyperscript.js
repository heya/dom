define(['module', 'heya-unit', '../hyperscript'], function (module, unit, h) {
	'use strict';

	unit.add(module, [
		function test_h (t) {
			// this test is taken verbatim from https://github.com/dominictarr/hyperscript#readme
			var node = h('div#page',
					  h('div#header',
						h('h1.classy', 'h', {style: {'background-color': '#22f'}})
					),
					h('div#menu', {style: {'background-color': '#2f2'}},
						h('ul',
							h('li', 'one'),
							h('li', 'two'),
							h('li', 'three')
						)
					),
					h('h2', 'content title', {style: {'background-color': '#f22'}}),
					h('p', "so it's just like a templating engine,\n",
						"but easy to use inline with javascript\n"),
					h('p', "the intension is for this to be used to create\n",
						"reusable, interactive html widgets. ")
				);

			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.id === "page"'));
			eval(t.TEST('node.querySelector("#header").tagName === "DIV"'));
			eval(t.TEST('node.querySelector("#menu").tagName === "DIV"'));
			eval(t.TEST('node.querySelectorAll("p").length === 2'));

			var h1 = node.querySelector('h1'), h2 = node.querySelector('h2');

			eval(t.TEST('h1.classList.contains("classy")'));
			eval(t.TEST('h1.innerHTML === "h"'));
			eval(t.TEST('h2.innerHTML === "content title"'));
			eval(t.TEST('h1.style.backgroundColor'));
			eval(t.TEST('h2.style.backgroundColor'));

			var li = node.querySelectorAll('ul li');
			eval(t.TEST('li.length === 3'));
			eval(t.TEST('li[0].innerHTML === "one"'));
			eval(t.TEST('li[1].innerHTML === "two"'));
			eval(t.TEST('li[2].innerHTML === "three"'));
		}
	]);

	return {};
});
