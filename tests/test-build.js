define(["module", "heya-unit", "../build"], function (module, unit, build) {
	"use strict";

	unit.add(module, [
		function test_div (t) {
			var node = build(['div']);
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 0'));
			eval(t.TEST('node.classList.length == 0'));
			eval(t.TEST('node.innerHTML === ""'));
		},
		function test_div_attr (t) {
			var node = build(['div', {'data-abc': 12}]);
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 1'));
			eval(t.TEST('node.getAttribute("data-abc") === "12"'));
			eval(t.TEST('node.innerHTML === ""'));
		},
		function test_div_attr_text (t) {
			var node = build(['div', {'data-abc': 12}, 'Hello!']);
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 1'));
			eval(t.TEST('node.getAttribute("data-abc") === "12"'));
			eval(t.TEST('node.innerHTML === "Hello!"'));
		},
		function test_div_text_attr (t) {
			var node = build(['div', 'Hello!', {'data-abc': 12}]);
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 1'));
			eval(t.TEST('node.getAttribute("data-abc") === "12"'));
			eval(t.TEST('node.innerHTML === "Hello!"'));
		},
		function test_div_attr_text_manual (t) {
			var node = build(['div', {'data-abc': 12}, document.createTextNode('Hello!')]);
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 1'));
			eval(t.TEST('node.getAttribute("data-abc") === "12"'));
			eval(t.TEST('node.innerHTML === "Hello!"'));
		},
		function test_div_text (t) {
			var node = build(['div', 'Hello!']);
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 0'));
			eval(t.TEST('node.innerHTML === "Hello!"'));
		},
		function test_div_divdiv (t) {
			var node = build(['div', ['div'], ['div']]);
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 0'));
			eval(t.TEST('node.innerHTML === "<div></div><div></div>"'));
		},
		function test_div_divdiv_class (t) {
			var node = build(['div', ['.a'], ['.b']]);
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 0'));
			eval(t.TEST("node.innerHTML === '<div class=\"a\"></div><div class=\"b\"></div>'"));
		},
		function test_svg (t) {
			var node = build(['svg', ['path']]);
			eval(t.TEST('node.tagName === "SVG"'));
			eval(t.TEST('node.firstChild.tagName === "path"'));
			eval(t.TEST('node.firstChild.namespaceURI === "http://www.w3.org/2000/svg"'));
		},
		function test_frag (t) {
			var node = build([['.a'], ['.b']]);
			eval(t.TEST('node.nodeName === "#document-fragment"'));
			eval(t.TEST('node.childNodes.length === 2'));
			eval(t.TEST('node.firstChild.tagName === "DIV"'));
			eval(t.TEST('node.firstChild.classList.contains("a")'));
			eval(t.TEST('node.lastChild.tagName === "DIV"'));
			eval(t.TEST('node.lastChild.classList.contains("b")'));
		},
		function test_fun (t) {
			function generate (options) {
				return ['div', 'Hello, ' + options.name + '!'];
			}

			var node = build(generate, null, {name: 'world'});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 0'));
			eval(t.TEST('node.innerHTML === "Hello, world!"'));
		},
		function test_parent (t) {
			var div = document.createElement('div'),
				node = build([['.a'], ['.b']], div);
			eval(t.TEST('div === node'));
			eval(t.TEST("div.innerHTML === '<div class=\"a\"></div><div class=\"b\"></div>'"));
		},
		function test_h (t) {
			var h = build.h,
				node = h('div#page',
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
