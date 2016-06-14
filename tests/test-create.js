define(['module', 'heya-unit', '../create'], function (module, unit, create) {
	'use strict';

	unit.add(module, [
		function test_div (t) {
			var node = create('div');
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 0'));
			eval(t.TEST('node.classList.length == 0'));
			eval(t.TEST('node.innerHTML === ""'));
		},
		function test_div_attr (t) {
			var node = create('div', {'data-abc': 12});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 1'));
			eval(t.TEST('node.getAttribute("data-abc") === "12"'));
			eval(t.TEST('node.innerHTML === ""'));
		},
		function test_div_attr_text (t) {
			var node = create('div', {'data-abc': 12, $: {innerHTML: 'Hello!'}});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.attributes.length === 1'));
			eval(t.TEST('node.getAttribute("data-abc") === "12"'));
			eval(t.TEST('node.innerHTML === "Hello!"'));
		},
		function test_div_style_string_simple (t) {
			var node = create('div', {style: 'font-weight: bold'});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.style.fontWeight === "bold"'));
		},
		function test_div_style_set_simple (t) {
			var node = create('div', {style: {'font-weight': 'bold'}});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.style.fontWeight === "bold"'));
		},
		function test_div_style_assign_simple (t) {
			var node = create('div', {style: {$: {fontWeight: 'bold'}}});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.style.fontWeight === "bold"'));
		},
		function test_div_style_string (t) {
			var node = create('div', {$: {style: 'font-weight: bold'}});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.style.fontWeight === "bold"'));
		},
		function test_div_style_set (t) {
			var node = create('div', {$: {style: {'font-weight': 'bold'}}});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.style.fontWeight === "bold"'));
		},
		function test_div_style_assign (t) {
			var node = create('div', {$: {style: {$: {fontWeight: 'bold'}}}});
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.style.fontWeight === "bold"'));
		},
		function test_ns (t) {
			var node = create('svg:path');
			eval(t.TEST('node.tagName === "path"'));
			eval(t.TEST('node.namespaceURI === "http://www.w3.org/2000/svg"'));
		},
		function test_className_simple (t) {
			var node = create('div', {className: 'a b'});
			eval(t.TEST('node.classList.length == 2'));
			eval(t.TEST('node.classList.contains("a")'));
			eval(t.TEST('node.classList.contains("b")'));
		},
		function test_className (t) {
			var node = create('div', {$: {className: 'a b'}});
			eval(t.TEST('node.classList.length == 2'));
			eval(t.TEST('node.classList.contains("a")'));
			eval(t.TEST('node.classList.contains("b")'));
		},
		function test_span_selector (t) {
			var node = create('span.a.b#x');
			eval(t.TEST('node.tagName === "SPAN"'));
			eval(t.TEST('node.classList.length == 2'));
			eval(t.TEST('node.classList.contains("a")'));
			eval(t.TEST('node.classList.contains("b")'));
			eval(t.TEST('node.id === "x"'));
		},
		function test_div_selector (t) {
			var node = create('.a.b#x');
			eval(t.TEST('node.tagName === "DIV"'));
			eval(t.TEST('node.classList.length == 2'));
			eval(t.TEST('node.classList.contains("a")'));
			eval(t.TEST('node.classList.contains("b")'));
			eval(t.TEST('node.id === "x"'));
		},
		function test_text (t) {
			var node = create.text('Hello!');
			eval(t.TEST('node.nodeName === "#text"'));
			eval(t.TEST('node.nodeValue === "Hello!"'));
		},
		{
			test: function test_event_attr_on (t) {
				var x = t.startAsync();

				var node = create('div', {onclick: handler});

				var event = document.createEvent('HTMLEvents');
                event.initEvent('click', true, true); // event type, bubbling, cancelable
				node.dispatchEvent(event);

				function handler () {
					t.info('click!');
					x.done();
				}
			},
			logs: ['click!']
		},
		{
			test: function test_event_attr (t) {
				var x = t.startAsync();

				var node = create('div', {click: handler});

				var event = document.createEvent('HTMLEvents');
				event.initEvent('click', true, true); // event type, bubbling, cancelable
				node.dispatchEvent(event);

				function handler () {
					t.info('click!');
					x.done();
				}
			},
			logs: ['click!']
		},
		{
			test: function test_event_prop_on (t) {
				var x = t.startAsync();

				var node = create('div', {$: {onclick: handler}});

				var event = document.createEvent('HTMLEvents');
                event.initEvent('click', true, true); // event type, bubbling, cancelable
				node.dispatchEvent(event);

				function handler () {
					t.info('click!');
					x.done();
				}
			},
			logs: ['click!']
		},
		{
			test: function test_event_prop (t) {
				var x = t.startAsync();

				var node = create('div', {$: {onclick: handler}});

				var event = document.createEvent('HTMLEvents');
				event.initEvent('click', true, true); // event type, bubbling, cancelable
				node.dispatchEvent(event);

				function handler () {
					t.info('click!');
					x.done();
				}
			},
			logs: ['click!']
		}
	]);

	return {};
});
