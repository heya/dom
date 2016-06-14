define([], function () {
	'use strict';

	var namespaces = {
			svg:   'http://www.w3.org/2000/svg',
			xlink: 'http://www.w3.org/1999/xlink',
			ev:    'http://www.w3.org/2001/xml-events',
			xml:   'http://www.w3.org/XML/1998/namespace'
		},
		parseName = /^(?:(\w+)\:)?([^\s\.#]*)/,
		parseSelector = /[\.#][^\s\.#]+/g;

	function allKeys (object) {
		var keys = [];
		for (var key in object) { keys.push(key); }
		return keys;
	}

	function assignStyle (node, styles) {
		var keys = allKeys(styles);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			node.style[key] = styles[key];
		}
		return node;
	}

	function setStyle (node, styles) {
		var keys = allKeys(styles);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			if (key === '$') {
				create.assignStyle(node, styles.$);
			} else {
				node.style.setProperty(key, styles[key]);
			}
		}
		return node;
	}

	function setData (node, dataset) {
		var keys = allKeys(dataset);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			node.dataset[key] = dataset[key];
		}
		return node;
	}

	function addListener (node, name, value) {
		var type = name;
		if (type.substring(0, 2) == 'on') {
			type = type.substring(2);
		}
		node.addEventListener(type, value, false);
	}

	function setProperties (node, props) {
		var keys = allKeys(props);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			switch (key) {
				case 'style':
					if (typeof props.style == 'string') {
						node.style.cssText = props.style;
					} else {
						create.setStyle(node, props.style);
					}
					break;
				case 'dataset':
					create.setData(node, props.dataset);
					break;
				default:
					if (typeof props[key] == 'function') {
						addListener(node, key, props[key]);
					} else {
						node[key] = props[key];
					}
					break;
			}
		}
		return node;
	}

	function setAttributes (node, attributes, options) {
		var keys = allKeys(attributes);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			switch (key) {
				case '$':
					if (options && typeof options.setComponentProperties == 'function' && node.tagName.indexOf('-') > 0) {
						options.setComponentProperties(node, attributes.$);
					} else {
						create.setProps(node, attributes.$);
					}
					break;
				case 'style':
					if (typeof attributes.style == 'string') {
						node.style.cssText = attributes.style;
					} else {
						create.setStyle(node, attributes.style);
					}
					break;
				case 'class':
				case 'className':
					node.className = attributes[key];
					break;
				default:
					var name = parseName.exec(key);
					if (name && name[1]) {
						node.setAttributeNS(namespaces[name[1]], name[2], attributes[key]);
					} else {
						if (typeof attributes[key] == 'function') {
							addListener(node, key, attributes[key]);
						} else {
							node.setAttribute(key, attributes[key]);
						}
					}
					break;
			}
		}
		return node;
	}

	function createText (text, parent) {
		var doc = document;
		if (parent) {
			if (parent.nodeType === 9) {
				doc = parent;
				parent = null;
			} else {
				doc = parent.ownerDocument || doc;
			}
		}
		var node = doc.createTextNode(text);
		if (parent && parent.nodeType === 1) {
			parent.appendChild(node);
		}
		return node;
	}

	function create (tag, attributes, parent, ns, options) {
		var doc = options && options.document || document;
		if (parent) {
			if (parent.nodeType === 9) {
				doc = parent;
				parent = null;
			} else {
				doc = parent.ownerDocument || doc;
			}
		}

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
			create.setAttrs(node, attributes, options);
		}

		if (parent && parent.nodeType === 1) {
			parent.appendChild(node);
		}
		return node;
	}

	create.text = createText;
	create.allKeys  = allKeys;
	create.setAttrs = setAttributes;
	create.setProps = setProperties;
	create.setData  = setData;
	create.setStyle = setStyle;
	create.assignStyle = assignStyle;
	create.namespaces  = namespaces;

	return create;
});
