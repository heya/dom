define([], function () {
	'use strict';

	var namespaces = {
			svg:   'http://www.w3.org/2000/svg',
			xlink: 'http://www.w3.org/1999/xlink',
			ev:    'http://www.w3.org/2001/xml-events',
			xml:   'http://www.w3.org/XML/1998/namespace'
		},
		parseName = /^(?:(\w+)\:)?([\w\-]*)/,
		parseSelector = /[\.#][\w\-]+/g;


	function setStyle (node, styles) {
		var styleKeys = Object.keys(styles);
		for (var i = 0; i < styleKeys.length; ++i) {
			var key = styleKeys[i];
			node.style[key] = styles[key];
		}
		return node;
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
		return node;
	}


	function setAttributes (node, attributes, options) {
		var attrKeys = Object.keys(attributes);
		for (var i = 0; i < attrKeys.length; ++i) {
			var key = attrKeys[i];
			if (key === '$') {
				if (options && typeof options.setComponentProperties == 'function' && node.tagName.indexOf('-') > 0) {
					options.setComponentProperties(node, attributes.$);
				} else {
					setProperties(node, attributes.$);
				}
			} else {
				var name = parseName.exec(key);
				if (name) {
					node.setAttributeNS(namespaces[name[1]], name[2], attributes[key]);
				} else {
					node.setAttribute(key, attributes[key]);
				}
			}
		}
		return node;
	}


	function buildElement (tag, attributes, ns, doc, options) {
		doc = doc || options && options.document || document;
		// create an element
		var name = parseName.exec(tag), node;

		if (name) {
			ns = name[1] || ns;
			if (ns) {
				node = doc.createElementNS(namespaces[ns], name[2] || 'div');
			} else {
				node = doc.createElement(name[2] || 'div');
			}
			if (name[0].length < tag.length) {
				// add selector's classes and ids
				tag.substring(name[0].length).replace(parseSelector, function (match) {
					switch (match.charAt(0)) {
						case '.':
							node.classList.add(match.substring(1));
							break;
						case '#':
							node.id = match.substring(1);
							break;
					}
					return '';
				});
			}
		} else {
			node = doc.createElement(tag);
		}

		if (attributes) {
			setAttributes(node, attributes, options);
		}

		return node;
	}

	function buildText (text, doc) {
		return (doc || document).createTextNode(text);
	}

	function build (vdom, mainParent, options) {
		var doc = options && options.document ||
				mainParent && mainParent.ownerDocument || document,
			stack = [mainParent, vdom, null], parent, node;

		while (stack.length) {
			var ns = stack.pop(), element = stack.pop();
			parent = stack.pop();

			// deref element
			while (typeof element == 'function') {
				element = element(options);
			}

			if (!(element instanceof Array)) {
				// make a specialty node
				node = null;
				if (typeof element == 'string') {
					// text
					node = doc.createTextNode(element);
				} else if (element && typeof element.appendChild == 'function') {
					// node
					node = element;
				} else {
					// skip
					continue;
				}
				// add it to a parent
				if (parent && node) {
					parent.appendChild(node);
				}
				continue;
			}

			// array: element or children
			var tag = element[0], attributes, from = 1, i;
			// deref tag
			while (typeof tag == 'function') {
				tag = tag(options);
			}
			// make a node
			if (typeof tag == 'string') {
				// tag
				node = buildElement(tag, null, ns, doc, options);
				// set attributes
				attributes = element[1];
				from = 2;
				// deref attributes
				while (typeof attributes == 'function') {
					attributes = attributes(options);
				}
				if (typeof attributes == 'object' && !(attributes instanceof Array) && !(attributes && typeof attributes.appendChild == 'function')) {
					setAttributes(node, attributes, options);
					attributes = null;
				}
			} else if (tag && typeof tag.appendChild == 'function') {
				// node
				node = tag;
				tag = node.tagName;
			} else if (tag instanceof Array) {
				// children
				if (element.length > 1 && !parent) {
					parent = doc.createDocumentFragment();
				}
				// add children in the reverse order
				for (i = element.length; i;) {
					stack.push(parent, element[--i], ns);
				}
				continue;
			} else {
				// skip
				continue;
			}
			// add children
			stack.push(parent, node, ns);
			// redefine a default namespace for children
			switch (tag.toLowerCase()) {
				case 'svg':
					ns = 'svg';
					break;
				case 'foreignobject':
					ns = null;
					break;
			}
			// add children to the stack in the reverse order
			for(i = element.length; i > from;) {
				stack.push(node, element[--i], ns);
			}
			if (attributes) {
				stack.push(node, attributes, ns);
			}
		}

		return parent || node;
	}

	// emulating hyperscript (see https://github.com/dominictarr/hyperscript)
	function hyperscript (tag, attributes, children) {
		var vdom = new Array(arguments.length);
		for (var i = 0; i < vdom.length; ++i) {
			vdom[i] = arguments[i];
		}
		return build(vdom);
	}

	build.text     = buildText;
	build.element  = buildElement;
	build.setAttrs = setAttributes;
	build.setProps = setProperties;
	build.setStyle = setStyle;
	build.h        = hyperscript;

	return build;
});
