define(["heya-has/sniff", "./dom", "./style", "./destroy", "./toDom"],
		function(has, dom, style, destroy, toDom){
	// module:
	//		dojo/dom-prop
	// summary:
	//		This module defines the core dojo DOM properties API.

	// TODOC: summary not showing up in output, see https://github.com/csnover/js-doc-parse/issues/42

	// =============================
	// Element properties Functions
	// =============================

	// helper to connect events
	var module = {
		names: {
			// properties renamed to avoid clashes with reserved words
			"class": "className",
			"for": "htmlFor",
			// properties written as camelCase
			tabindex: "tabIndex",
			readonly: "readOnly",
			colspan: "colSpan",
			frameborder: "frameBorder",
			rowspan: "rowSpan",
			valuetype: "valueType"
		},

		get: function getProp(/*DOMNode|String*/ node, /*String*/ name){
			// summary:
			//		Gets a property on an HTML element.
			// description:
			//		Handles normalized getting of properties on DOM nodes.
			//
			// node: DOMNode|String
			//		id or reference to the element to get the property on
			// name: String
			//		the name of the property to get.
			// returns:
			//		the value of the requested property or its default value
			//
			// example:
			//	|	// get the current value of the "foo" property on a node
			//	|	dojo.getProp(dojo.byId("nodeId"), "foo");
			//	|	// or we can just pass the id:
			//	|	dojo.getProp("nodeId", "foo");

			node = dom.byId(node);
			var lc = name.toLowerCase(), propName = module.names[lc] || name;
			return node[propName];	// Anything
		},

		set: function setProp(/*DOMNode|String*/ node, /*String|Object*/ name, /*String?*/ value){
			// summary:
			//		Sets a property on an HTML element.
			// description:
			//		Handles normalized setting of properties on DOM nodes.
			//
			//		When passing functions as values, note that they will not be
			//		directly assigned to slots on the node, but rather the default
			//		behavior will be removed and the new behavior will be added
			//		using `dojo.connect()`, meaning that event handler properties
			//		will be normalized and that some caveats with regards to
			//		non-standard behaviors for onsubmit apply. Namely that you
			//		should cancel form submission using `dojo.stopEvent()` on the
			//		passed event object instead of returning a boolean value from
			//		the handler itself.
			// node: DOMNode|String
			//		id or reference to the element to set the property on
			// name: String|Object
			//		the name of the property to set, or a hash object to set
			//		multiple properties at once.
			// value: String?
			//		The value to set for the property
			// returns:
			//		the DOM node
			//
			// example:
			//	|	// use prop() to set the tab index
			//	|	dojo.setProp("nodeId", "tabIndex", 3);
			//	|
			//
			// example:
			//	Set multiple values at once, including event handlers:
			//	|	dojo.setProp("formId", {
			//	|		"foo": "bar",
			//	|		"tabIndex": -1,
			//	|		"method": "POST",
			//	|		"onsubmit": function(e){
			//	|			// stop submitting the form. Note that the IE behavior
			//	|			// of returning true or false will have no effect here
			//	|			// since our handler is connect()ed to the built-in
			//	|			// onsubmit behavior and so we need to use
			//	|			// dojo.stopEvent() to ensure that the submission
			//	|			// doesn't proceed.
			//	|			dojo.stopEvent(e);
			//	|
			//	|			// submit the form with Ajax
			//	|			dojo.xhrPost({ form: "formId" });
			//	|		}
			//	|	});
			//
			// example:
			//	Style is s special case: Only set with an object hash of styles
			//	|	dojo.setProp("someNode",{
			//	|		id:"bar",
			//	|		style:{
			//	|			width:"200px", height:"100px", color:"#000"
			//	|		}
			//	|	});
			//
			// example:
			//	Again, only set style as an object hash of styles:
			//	|	var obj = { color:"#fff", backgroundColor:"#000" };
			//	|	dojo.setProp("someNode", "style", obj);
			//	|
			//	|	// though shorter to use `dojo.style()` in this case:
			//	|	dojo.style("someNode", obj);

			node = dom.byId(node);
			var l = arguments.length;
			if(l == 2 && typeof name != "string"){ // inline'd type check
				// the object form of setter: the 2nd argument is a dictionary
				for(var x in name){
					module.set(node, x, name[x]);
				}
				return node; // DomNode
			}
			var lc = name.toLowerCase(), propName = module.names[lc] || name;
			if(propName == "style" && typeof value != "string"){ // inline'd type check
				// special case: setting a style
				style.set(node, value);
				return node; // DomNode
			}
			if(propName == "innerHTML"){
				// special case: assigning HTML
				// the hash lists elements with read-only innerHTML on IE
				if(has("ie") && node.tagName.toLowerCase() in {col: 1, colgroup: 1,
							table: 1, tbody: 1, tfoot: 1, thead: 1, tr: 1, title: 1}){
					destroy.empty(node);
					node.appendChild(toDom(value, node.ownerDocument));
				}else{
					node[propName] = value;
				}
				return node; // DomNode
			}
			node[propName] = value;
			return node;	// DomNode
		}
	};

	return module;
});