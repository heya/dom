define(["module", "heya-unit", "../fromHtml"], function (module, unit, fromHtml) {
	"use strict";

	unit.add(module, [
		function test_text (t) {
			var node = fromHtml('Hello!');
			eval(t.TEST('node.nodeName == "#document-fragment"'));
			eval(t.TEST('node.childNodes.length == 1'));
			var div = document.createElement('div');
			div.appendChild(node);
			eval(t.TEST('div.innerHTML === "Hello!"'));
		}
	]);

	return {};
});
