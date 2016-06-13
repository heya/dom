define(['./create'], function (create) {
	'use strict';

	var textTypes = {string: 1, number: 1, boolean: 1};

	// implementing hyperscript (see https://github.com/dominictarr/hyperscript)
	function hyperscript (tag, attributes, children) {
		var node = create(tag), rest = new Array(arguments.length - 1), i;
		for (i = 1; i < arguments.length; ++i) {
			rest[i - 1] = arguments[i];
		}
		return addToNode(node, rest);
	}

	function addToNode (node, children) {
		for (var i = 0; i < children.length; ++i) {
			var child = children[i];
			if (textTypes[typeof child] || child instanceof Date || child instanceof RegExp) {
				node.appendChild(node.ownerDocument.createTextNode(child.toString()));
			} else if (!child) {
				// skip
			} else if (child instanceof Array) {
				addToNode(node, child);
			} else if (typeof child.appendChild == 'function') {
				node.appendChild(child);
			} else {
				create.setProps(node, child);
			}
		}
		return node;
	}

	return hyperscript;
});
