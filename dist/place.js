(function(_,f,g){g=window;g=g.heya||(g.heya={});g=g.dom||(g.dom={});g.place=f();})
([], function () {
	'use strict';

	function place (/*DOMNode*/ node, /*DOMNode*/ refNode, /*String|Number?*/ position) {
		// summary:
		//		Attempt to insert node into the DOM, choosing from various positioning options.
		//		Returns the first argument resolved to a DOM node.
		// node: DOMNode
		//		node to place
		// refNode: DOMNode
		//		node to use as basis for placement
		// position: String|Number?
		//		string noting the position of node relative to refNode or a
		//		number indicating the location in the childNodes collection of refNode.
		//		Accepted string values are:
		//
		//		- before
		//		- after
		//		- replace
		//		- only
		//		- first
		//		- last
		//
		//		"first" and "last" indicate positions as children of refNode, "replace" replaces refNode,
		//		"only" replaces all children.  position defaults to "last" if not specified
		// returns: DOMNode
		//		Returned the first argument.

		if (typeof position == 'number') { // inline'd type check
			var children = refNode.childNodes;
			if (!children.length || children.length <= position) {
				refNode.appendChild(node);
			} else {
				refNode.insertBefore(node, children[position < 0 ? 0 : position]);
			}
			return node;
		}

		var parent = refNode.parentNode;
		switch (position) {
			case 'before':
				if (parent) {
					parent.insertBefore(node, refNode);
				}
				break;
			case 'after':
				if (parent) {
					parent.insertBefore(node, refNode.nextSibling);
				}
				break;
			case 'replace':
				if (parent) {
					parent.replaceChild(node, refNode);
				}
				break;
			case "only":
				refNode.innerHTML = '';
				refNode.appendChild(node);
				break;
			case "first":
				refNode.insertBefore(node, refNode.firstChild);
				break;
			default: // aka: last
				refNode.appendChild(node);
		}
		return node; // DomNode
	}

	return place;
});
