define(["heya-has/sniff", "./dom"], function(has, dom){
	// module:
	//		dojo/dom

	// TODO: do we need setSelectable in the base?

	// Add feature test for user-select CSS property
	// (currently known to work in all but IE < 10 and Opera)
	has.add("css-user-select", function(global, doc, element){
		// Avoid exception when dom.js is loaded in non-browser environments
		if(!element){ return false; }

		var style = element.style;
		var prefixes = ["Khtml", "O", "ms", "Moz", "Webkit"],
			i = prefixes.length,
			name = "userSelect",
			prefix;

		// Iterate prefixes from most to least likely
		do{
			if(typeof style[name] !== "undefined"){
				// Supported; return property name
				return name;
			}
		}while(i-- && (name = prefixes[i] + "UserSelect"));

		// Not supported if we didn't return before now
		return false;
	});

	/*=====
	setSelectable = function(node, selectable){
		// summary:
		//		Enable or disable selection on a node
		// node: DOMNode|String
		//		id or reference to node
		// selectable: Boolean
		//		state to put the node in. false indicates unselectable, true
		//		allows selection.
		// example:
		//		Make the node id="bar" unselectable
		//	|	dojo.setSelectable("bar");
		// example:
		//		Make the node id="bar" selectable
		//	|	dojo.setSelectable("bar", true);
	};
	=====*/

	var cssUserSelect = has("css-user-select");

	return {
		setSelectable: cssUserSelect ?
			(function setSelectable(node, selectable){
				// css-user-select returns a (possibly vendor-prefixed) CSS property name
				dom.byId(node).style[cssUserSelect] = selectable ? "" : "none";
			}) :
			(function setSelectable(node, selectable){
				node = dom.byId(node);

				// (IE < 10 / Opera) Fall back to setting/removing the
				// unselectable attribute on the element and all its children
				var nodes = node.getElementsByTagName("*"),
					i = nodes.length;

				if(selectable){
					node.removeAttribute("unselectable");
					while(i--){
						nodes[i].removeAttribute("unselectable");
					}
				}else{
					node.setAttribute("unselectable", "on");
					while(i--){
						nodes[i].setAttribute("unselectable", "on");
					}
				}
			})
	};
});
