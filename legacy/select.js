define(["heya-has/sniff", "./window", "./dom"],
		function(has, win, dom){
	"use strict";

	// This module implements Selectors API Level 2
	// http://www.w3.org/TR/selectors-api2/

	has.add("dom-querySelector", function(global, doc, elem){
		return !!doc.querySelector;
	});
	has.add("dom-find", function(global, doc, elem){
		return !!doc.find;
	});
	has.add("dom-matches", function(global, doc, elem){
		var names = ["matches", "matchesSelector"],
			prefixes = ["ms", "moz", "webkit"];
		for(var i = 0; i < names.length; ++i){
			if(elem[names[i]]){
				return names[i];
			}
		}
		for(i = 0; i < prefixes.length; ++i){
			var name = prefixes[i] + "MatchesSelector";
			if(elem[name]){
				return name;
			}
		}
		return null;
	});

	function makeSelector(method){
		return function(node, selector){
			if(selector){
				node = dom.byId(node);
			}else{
				selector = node;
				node = win.doc;
			}
			try{
				return node[method](selector);
			}catch(e){}
			// otherwise returns undefined
		};
	}

	var matches = has("dom-matches");

	return {
		isQuerySelectorAvailable: has("dom-querySelector"),
		querySelector:    makeSelector("querySelector"),
		querySelectorAll: makeSelector("querySelectorAll"),

		isFindAvailable: has("dom-find"),
		find:    makeSelector("find"),
		findAll: makeSelector("findAll"),

		isMatchesAvailable: !!matches,
		matches: function(node, selector, refElem){
			try{
				return dom.byId(node)[matches](selector, refElem);
			}catch(e){}
			// otherwise returns undefined
		}
	}
});
