define([], function () {
	'use strict';

	function place (/*DOMNode*/ node, /*DOMNode*/ refNode, /*String|Number?*/ position) {
		// summary:
		//		Attempt to insert node into the DOM, choosing from various positioning options.
		//		Returns the first argument resolved to a DOM node.
		// node: DOMNode|String
		//		id or node reference, or HTML fragment starting with "<" to place relative to refNode
		// refNode: DOMNode|String
		//		id or node reference to use as basis for placement
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
		//		Returned values is the first argument resolved to a DOM node.
		//
		//		.place() is also a method of `dojo/NodeList`, allowing `dojo.query` node lookups.
		// example:
		//		Place a node by string id as the last child of another node by string id:
		//	|	dojo.place("someNode", "anotherNode");
		// example:
		//		Place a node by string id before another node by string id
		//	|	dojo.place("someNode", "anotherNode", "before");
		// example:
		//		Create a Node, and place it in the body element (last child):
		//	|	dojo.place("<div></div>", dojo.body());
		// example:
		//		Put a new LI as the first child of a list by id:
		//	|	dojo.place("<li></li>", "someUl", "first");

		if (typeof position == 'number') { // inline'd type check
			var children = refNode.childNodes;
			if (!children.length || children.length <= position) {
				refNode.appendChild(node);
			} else {
				insertBefore(node, children[position < 0 ? 0 : position]);
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
