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


	function assignStyle (node, styles) {
		var styleKeys = Object.keys(styles);
		for (var i = 0; i < styleKeys.length; ++i) {
			var key = styleKeys[i];
			node.style[key] = styles[key];
		}
		return node;
	}

	function setStyle (node, styles) {
		var styleKeys = Object.keys(styles);
		for (var i = 0; i < styleKeys.length; ++i) {
			var key = styleKeys[i];
			if (key === '$') {
				assignStyle(node, styles.$);
			} else {
				node.style.setProperty(key, styles[key]);
			}
		}
		return node;
	}


	function setProperties (node, props) {
		var propKeys = Object.keys(props);
		for (var i = 0; i < propKeys.length; ++i) {
			var key = propKeys[i];
			if (key === 'style') {
				if (typeof props.style == 'string') {
					node.style.cssText = props.style;
				} else {
					setStyle(node, props.style);
				}
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
			switch (key) {
				case '$':
					if (options && typeof options.setComponentProperties == 'function' && node.tagName.indexOf('-') > 0) {
						options.setComponentProperties(node, attributes.$);
					} else {
						setProperties(node, attributes.$);
					}
					break;
				case 'style':
					if (typeof attributes.style == 'string') {
						node.style.cssText = attributes.style;
					} else {
						setStyle(node, attributes.style);
					}
					break;
				case 'class':
				case 'className':
					node.className = attributes[key];
					break;
				case 'id':
					node.id = attributes.id;
					break;
				default:
					var name = parseName.exec(key);
					if (name) {
						node.setAttributeNS(namespaces[name[1]], name[2], attributes[key]);
					} else {
						node.setAttribute(key, attributes[key]);
					}
					break;
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

	var textTypes = {string: 1, number: 1, boolean: 1};

	function build (vdom, mainParent, options) {
		var doc = options && options.document ||
				mainParent && mainParent.ownerDocument || document,
			stack = [mainParent, vdom, null], parent, node;

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
					setAttributes(parent, element, options);
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
				node = buildElement(tag, null, ns, doc, options);
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

	// implementing hyperscript (see https://github.com/dominictarr/hyperscript)
	function hyperscript (tag, attributes, children) {
		var node = buildElement(tag), rest = new Array(arguments.length - 1), i;
		for (i = 1; i < arguments.length; ++i) {
			rest[i - 1] = arguments[i];
		}
		return addToNode(node, rest);
	}

	function addToNode (node, children) {
		for (var i = 0; i < children.length; ++i) {
			var child = children[i];
			if (!child) {
				// ignore
			} else if (typeof child == 'string') {
				node.appendChild(node.ownerDocument.createTextNode(child));
			} else if (child instanceof Array) {
				addToNode(node, child);
			} else if (typeof child.appendChild == 'function') {
				node.appendChild(child);
			} else {
				setProperties(node, child);
			}
		}
		return node;
	}

	build.text        = buildText;
	build.element     = buildElement;
	build.setAttrs    = setAttributes;
	build.setProps    = setProperties;
	build.setStyle    = setStyle;
	build.assignStyle = assignStyle;
	build.hyperscript = hyperscript;

	return build;
});
