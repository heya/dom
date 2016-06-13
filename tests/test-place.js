define(['module', 'heya-unit', '../build', '../fromHtml', '../place'], function (module, unit, build, fromHtml, place) {
	'use strict';

	unit.add(module, [
		function test_number (t) {
			var tree = build(['ul', ['li', 'one'], ['li.x', 'two'], ['li', 'three']]);
			place(fromHtml('<li>A</li><li>B</li>'), tree, 1);

			var li = tree.querySelectorAll('li');
			eval(t.ASSERT('li.length === 5'));
			eval(t.TEST('li[0].innerHTML === "one"'));
			eval(t.TEST('li[1].innerHTML === "A"'));
			eval(t.TEST('li[2].innerHTML === "B"'));
			eval(t.TEST('li[3].innerHTML === "two"'));
			eval(t.TEST('li[4].innerHTML === "three"'));
		},
		function test_before (t) {
			var tree = build(['ul', ['li', 'one'], ['li.x', 'two'], ['li', 'three']]);
			place(fromHtml('<li>A</li><li>B</li>'), tree.querySelector('.x'), 'before');

			var li = tree.querySelectorAll('li');
			eval(t.ASSERT('li.length === 5'));
			eval(t.TEST('li[0].innerHTML === "one"'));
			eval(t.TEST('li[1].innerHTML === "A"'));
			eval(t.TEST('li[2].innerHTML === "B"'));
			eval(t.TEST('li[3].innerHTML === "two"'));
			eval(t.TEST('li[4].innerHTML === "three"'));
		},
		function test_after (t) {
			var tree = build(['ul', ['li', 'one'], ['li.x', 'two'], ['li', 'three']]);
			place(fromHtml('<li>A</li><li>B</li>'), tree.querySelector('.x'), 'after');

			var li = tree.querySelectorAll('li');
			eval(t.ASSERT('li.length === 5'));
			eval(t.TEST('li[0].innerHTML === "one"'));
			eval(t.TEST('li[1].innerHTML === "two"'));
			eval(t.TEST('li[2].innerHTML === "A"'));
			eval(t.TEST('li[3].innerHTML === "B"'));
			eval(t.TEST('li[4].innerHTML === "three"'));
		},
		function test_replace (t) {
			var tree = build(['ul', ['li', 'one'], ['li.x', 'two'], ['li', 'three']]);
			place(fromHtml('<li>A</li><li>B</li>'), tree.querySelector('.x'), 'replace');

			var li = tree.querySelectorAll('li');
			eval(t.ASSERT('li.length === 4'));
			eval(t.TEST('li[0].innerHTML === "one"'));
			eval(t.TEST('li[1].innerHTML === "A"'));
			eval(t.TEST('li[2].innerHTML === "B"'));
			eval(t.TEST('li[3].innerHTML === "three"'));
		},
		function test_first (t) {
			var tree = build(['ul', ['li', 'one'], ['li.x', 'two'], ['li', 'three']]);
			place(fromHtml('<li>A</li><li>B</li>'), tree, 'first');

			var li = tree.querySelectorAll('li');
			eval(t.ASSERT('li.length === 5'));
			eval(t.TEST('li[0].innerHTML === "A"'));
			eval(t.TEST('li[1].innerHTML === "B"'));
			eval(t.TEST('li[2].innerHTML === "one"'));
			eval(t.TEST('li[3].innerHTML === "two"'));
			eval(t.TEST('li[4].innerHTML === "three"'));
		},
		function test_last (t) {
			var tree = build(['ul', ['li', 'one'], ['li.x', 'two'], ['li', 'three']]);
			place(fromHtml('<li>A</li><li>B</li>'), tree, 'last');

			var li = tree.querySelectorAll('li');
			eval(t.ASSERT('li.length === 5'));
			eval(t.TEST('li[0].innerHTML === "one"'));
			eval(t.TEST('li[1].innerHTML === "two"'));
			eval(t.TEST('li[2].innerHTML === "three"'));
			eval(t.TEST('li[3].innerHTML === "A"'));
			eval(t.TEST('li[4].innerHTML === "B"'));
		},
		function test_only (t) {
			var tree = build(['ul', ['li', 'one'], ['li.x', 'two'], ['li', 'three']]);
			place(fromHtml('<li>A</li><li>B</li>'), tree, 'only');

			var li = tree.querySelectorAll('li');
			eval(t.ASSERT('li.length === 2'));
			eval(t.TEST('li[0].innerHTML === "A"'));
			eval(t.TEST('li[1].innerHTML === "B"'));
		}
	]);

	return {};
});
