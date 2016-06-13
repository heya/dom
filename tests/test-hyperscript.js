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
		},
		// the rest of tests are taken from https://github.com/dominictarr/hyperscript/blob/master/test/index.js
		function test_simple (t) {
			eval(t.TEST("h('h1').outerHTML === '<h1></h1>'"));
			eval(t.TEST("h('h1', 'hello world').outerHTML === '<h1>hello world</h1>'"));
		},
		function test_nested (t) {
			var node = h('div',
					h('h1', 'Title'),
					h('p', 'Paragraph')
				);
			eval(t.TEST("node.outerHTML === '<div><h1>Title</h1><p>Paragraph</p></div>'"));
		},
		function test_nested_arrays (t) {
			var node = h('div',
					[h('h1', 'Title'), h('p', 'Paragraph')]
				);
			eval(t.TEST("node.outerHTML === '<div><h1>Title</h1><p>Paragraph</p></div>'"));
		},
		/*
		function test_namespaces (t) {
			eval(t.TEST("h('myns:mytag').outerHTML === '<myns:mytag></myns:mytag>'"));
		},
		*/
		function test_id (t) {
			eval(t.TEST("h('div#frame').outerHTML === '<div id=\"frame\"></div>'"));
		},
		function test_id (t) {
			eval(t.TEST("h('div.panel').outerHTML === '<div class=\"panel\"></div>'"));
		},
		function test_default_element (t) {
			eval(t.TEST("h('.panel').outerHTML === '<div class=\"panel\"></div>'"));
			eval(t.TEST("h('#frame').outerHTML === '<div id=\"frame\"></div>'"));
		},
		function test_set_props (t) {
			var a = h('a', {href: 'http://google.com'});
			eval(t.TEST("a.href === 'http://google.com/'"));
			var checkbox = h('input', {name: 'yes', type: 'checkbox'});
			eval(t.TEST("checkbox.outerHTML === '<input name=\"yes\" type=\"checkbox\">'"));
		},
		/*
		test('registers event handlers', function(t){
		  var onClick = spy()
		  var p = h('p', {onclick: onClick}, 'something')
		  simu.click(p)
		  t.assert(onClick.called)
		  t.end()
		})
		*/
		function test_set_styles (t) {
			var div = h('div', {style: {'color': 'red'}});
			eval(t.TEST("div.style.color === 'red'"));
		},
		function test_set_styles_as_text (t) {
			var div = h('div', {style: 'color: red'});
			eval(t.TEST("div.style.color === 'red'"));
		},
		/*
		test('sets data attributes', function(t){
		  var div = h('div', {'data-value': 5})
		  t.equal(div.getAttribute('data-value'), '5') // failing for IE9
		  t.end()
		})
		*/
		function test_primitives_as_text (t) {
			var e = h('p', true, false, 4, new Date('Mon Jan 15 2001'), /hello/);
			t.test(e.outerHTML.match(/<p>truefalse4Mon Jan 15.+2001.*\/hello\/<\/p>/));
		},
		/*
		test('observable content', function(t){
		  var title = o()
		  title('Welcome to HyperScript!')
		  var h1 = h('h1', title)
		  t.equal(h1.outerHTML, '<h1>Welcome to HyperScript!</h1>')
		  title('Leave, creep!')
		  t.equal(h1.outerHTML, '<h1>Leave, creep!</h1>')
		  t.end()
		})

		test('observable property', function(t){
		  var checked = o()
		  checked(true)
		  var checkbox = h('input', {type: 'checkbox', checked: checked})
		  t.equal(checkbox.checked, true)
		  checked(false)
		  t.equal(checkbox.checked, false)
		  t.end()
		})

		test('observable style', function(t){
		  var color = o()
		  color('red')
		  var div = h('div', {style: {'color': color}})
		  t.equal(div.style.color, 'red')
		  color('blue')
		  t.equal(div.style.color, 'blue')
		  t.end()
		})

		test('context basic', function(t){
		  var _h = h.context()
		  var p = _h('p', 'hello')
		  t.equal(p.outerHTML, '<p>hello</p>')
		  _h.cleanup()
		  t.end()
		})

		test('context cleanup removes observable listeners', function(t){
		  var _h = h.context()
		  var text = o()
		  text('hello')
		  var color = o()
		  color('red')
		  var className = o()
		  className('para')
		  var p = _h('p', {style: {color: color}, className: className}, text)
		  t.equal(p.outerHTML, '<p style=\"color: red; \" class=\"para\">hello</p>')
		  _h.cleanup()
		  color('blue')
		  text('world')
		  className('section')
		  t.equal(p.outerHTML, '<p style=\"color: red; \" class=\"para\">hello</p>')
		  t.end()
		})

		test('context cleanup removes event handlers', function(t){
		  var _h = h.context()
		  var onClick = spy()
		  var button = _h('button', 'Click me!', {onclick: onClick})
		  _h.cleanup()
		  simu.click(button)
		  t.assert(!onClick.called, 'click listener was not triggered')
		  t.end()
		})
		*/
		function test_unicode (t) {
			eval(t.TEST("h('.⛄').outerHTML === '<div class=\"⛄\"></div>'"));
			eval(t.TEST("h('span#⛄').outerHTML === '<span id=\"⛄\"></span>'"));
		}
	]);

	return {};
});
