define([], function () {
	'use strict';

	var namespaces = {
			svg:   'http://www.w3.org/2000/svg',
			xlink: 'http://www.w3.org/1999/xlink',
			ev:    'http://www.w3.org/2001/xml-events',
			xml:   'http://www.w3.org/XML/1998/namespace'
		},
		parseName = /^(\w+)\:(.+)$/;


	function setStyle (node, styles) {
		var styleKeys = Object.keys(styles);
		for (var i = 0; i < styleKeys.length; ++i) {
			var key = styleKeys[i];
			node.style[key] = styles[key];
		}
	}


	function setProperties (node, props) {
		var propKeys = Object.keys(props);
		for (var i = 0; i < propKeys.length; ++i) {
			var key = propKeys[i];
			if (key === 'style') {
				setStyle(node, props.style);
			} else {
				node[key] = props[key];
			}
		}
	}


	function setAttributes (node, attributes) {
		var attrKeys = Object.keys(attributes);
		for (var i = 0; i < attrKeys.length; ++i) {
			var key = attrKeys[i];
			if (key === '$') {
				setProperties(node, attributes.$);
			} else {
				var name = parseName.exec(key);
				if (name) {
					node.setAttributeNS(namespaces[name[1]], name[2], attributes[key]);
				} else {
					node.setAttribute(key, attributes[key]);
				}
			}
		}
	}


	function buildElement (tag, attributes, ns) {
		// create an element
		var name = parseName.exec(tag), node;
		if (name) {
			node = document.createElementNS(namespaces[name[1]], name[2]);
		} else if (ns) {
			node = document.createElementNS(namespaces[ns], tag);
		} else {
			node = document.createElement(tag);
		}

		if (attributes) {
			setAttributes(node, attributes);
		}

		return node;
	}

	function buildText (text) {
		return document.createTextNode(text);
	}

	function build (tag, attributes, children) {
		var node, i;

		if (!tag && typeof attributes == 'string') {
			return document.createTextNode(attributes);
		}

		if (typeof tag == 'string') {
			// sanitize input
			if (attributes instanceof Array) {
				children = attributes;
				attributes = null;
			} else if (children && !(children instanceof Array)) {
				children = [children];
			}

			// create a node
			node = buildElement(tag, attributes);
			if (children) {
				for (i = 0; i < children.length; ++i) {
					node.appendChild(children[i]);
				}
			}
			return node;
		}

		var stack = [null, null, tag, 0], parent, ns, kids, index, current;

		while (stack.length) {
			index  = stack.pop();
			kids   = stack.pop();
			ns     = stack.pop();
			parent = stack.pop();

			current = kids[index++];
			if (index < kids.length) {
				stack.push(parent, ns, kids, index);
			}

			// create a node
			if (typeof current == 'string') {
				// create a text node
				tag  = '';
				node = document.createTextNode(current);
				kids = null;
			} else if (current instanceof HTMLElement) {
				tag  = current.tagName;
				node = current;
				kids = null;
			} else {
				// create an element
				tag  = current[0];
				kids = current[1];
				if (kids instanceof Array) {
					node = buildElement(tag, null, ns);
				} else {
					node = buildElement(tag, current[1], ns);
					kids = current[2];
				}
			}

			// redefine a default namespace for children
			switch (tag.toLowerCase()) {
				case 'svg':
					ns = 'svg';
					break;
				case 'foreignobject':
					ns = null;
					break;
			}

			// attach
			if (parent) {
				parent.appendChild(node);
			}

			// process its kids
			if (kids && kids.length) {
				stack.push(node, ns, kids, 0);
			}
		}

		return node;
	}

	build.text     = buildText;
	build.element  = buildElement;
	build.setAttrs = setAttributes;
	build.setProps = setProperties;
	build.setStyle = setStyle;

	return build;
});
