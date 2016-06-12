define([], function () {
	'use strict';

	function fromHtml (html, options) {
		var doc = options && options.document || document;

		if (typeof doc.createRange == 'function') {
			var range = doc.createRange();
			if (typeof range.createContextualFragment == 'function') {
				range.selectNode(doc.body);
				return range.createContextualFragment(html);
			}
		}

		var container = doc.createElement('div'), frag = doc.createDocumentFragment();
		container.innerHTML = html;

		while (container.firstChild) {
			frag.appendChild(container.firstChild);
		}

		return frag;
	}

	return fromHtml;
});
