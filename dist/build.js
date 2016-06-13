(function(_,f){window.heya.dom.build=f(window.heya.dom.create);})
(['./create'], function (create) {
	'use strict';

	var textTypes = {string: 1, number: 1, boolean: 1};

	function build (vdom, parent, options) {
		var doc = options && options.document || document,
			stack = [parent, vdom, null], node;

		if (parent) {
			if (parent.nodeType === 9) {
				doc = parent;
				parent = null;
			} else {
				doc = parent.ownerDocument || doc;
			}
		}

		while (stack.length) {
			var ns = stack.pop(), element = stack.pop();
			parent = stack.pop();
			node = null;

			// deref element
			while (typeof element == 'function') {
				element = element(options);
			}

			if (!element) {
				// skip
				continue;
			}

			if (!(element instanceof Array)) {
				// make a specialty node
				if (textTypes[typeof element] || element instanceof Date || element instanceof RegExp) {
					// text
					node = doc.createTextNode(element.toString());
				} else if (typeof element.appendChild == 'function') {
					// node
					node = element;
				} else if (parent && typeof element == 'object') {
					// attributes
					create.setAttrs(parent, element, options);
				}
				// add it to a parent
				if (node && parent) {
					parent.appendChild(node);
				}
				continue;
			}

			// array: element or children
			var tag = element[0];
			// deref tag
			while (typeof tag == 'function') {
				tag = tag(options);
			}
			// make a node
			if (typeof tag == 'string') {
				// tag
				node = create(tag, null, doc, ns, options);
			} else if (tag && typeof tag.appendChild == 'function') {
				// node
				node = tag;
				tag = node.tagName;
			} else if (tag instanceof Array) {
				// children
				if (element.length > 1 && !parent) {
					parent = doc.createDocumentFragment();
				}
				node = parent;
			}
			var from = 0, i;
			if (node && node !== parent) {
				// redefine a default namespace for children
				switch (tag.toLowerCase()) {
					case 'svg':
						ns = 'svg';
						break;
					case 'foreignobject':
						ns = null;
						break;
				}
				// add children
				stack.push(parent, node, ns);
				from = 1;
			}
			// add children to the stack in the reverse order
			for(i = element.length; i > from;) {
				stack.push(node, element[--i], ns);
			}
		}

		return parent || node;
	}

	return build;
});
