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
			setAttributes(node, attributes, options);
		}

		if (parent && parent.nodeType === 1) {
			parent.appendChild(node);
		}
		return node;
	}

	create.text = createText;
	create.setAttrs = setAttributes;
	create.setProps = setProperties;
	create.setStyle = setStyle;
	create.assignStyle = assignStyle;
	create.namespaces  = namespaces;

	return create;
});
