/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["module", "heya-unit", "../window", "../main", "../class", "../style", "../prop",
	"../destroy", "../place", "../toDom", "../construct",
	"../geometry", "../attr", "../winutils", "../domutils"],
function(module, unit, win, dom, cls, style, prop,
	destroy, place, toDom, ctr,
	geom, attr, winutils, domutils){
	"use strict";

	// tests

	unit.add(module, [
		// window
		function test_window(t){
			eval(t.TEST("win.global === window"));
			eval(t.TEST("win.doc === document"));
			eval(t.TEST("win.body() === document.body"));

			var oldGlobal = win.global, oldDoc = win.doc,
				newGlobal = {a: 1}, newDoc = {b: 2};
			win.setContext(newGlobal, newDoc);
			eval(t.TEST("win.global === newGlobal"));
			eval(t.TEST("win.doc === newDoc"));
			win.setContext(oldGlobal, oldDoc);
			eval(t.TEST("win.global === window"));
			eval(t.TEST("win.doc === document"));
		},
		// dom AKA main
		function test_dom(t){
			eval(t.TEST("!dom.byId('abc')"));
			var elem = win.doc.createElement("p");
			elem.id = "abc";
			win.body().appendChild(elem);
			eval(t.TEST("dom.byId('abc') === elem"));
			eval(t.TEST("dom.isDescendant('abc', win.body())"));
			eval(t.TEST("!dom.isDescendant(win.body(), 'abc')"));
			win.body().removeChild(elem);
			eval(t.TEST("!dom.byId('abc')"));
		},
		// class
		function test_class(t){
			var elem = win.doc.createElement("p");
			elem.id = "abc";
			win.body().appendChild(elem);
			eval(t.TEST("elem.className === ''"));
			cls.add(elem, "x");
			eval(t.TEST("elem.className === 'x'"));
			eval(t.TEST("cls.contains(elem, 'x')"));
			cls.add(elem, "y");
			eval(t.TEST("cls.contains(elem, 'x')"));
			eval(t.TEST("cls.contains(elem, 'y')"));
			eval(t.TEST("!cls.contains(elem, 'z')"));
			cls.add(elem, "z");
			eval(t.TEST("cls.contains(elem, 'x')"));
			eval(t.TEST("cls.contains(elem, 'y')"));
			eval(t.TEST("cls.contains(elem, 'z')"));
			cls.remove(elem, "y");
			eval(t.TEST("cls.contains(elem, 'x')"));
			eval(t.TEST("!cls.contains(elem, 'y')"));
			eval(t.TEST("cls.contains(elem, 'z')"));
			cls.remove(elem, "x");
			eval(t.TEST("elem.className === 'z'"));
			eval(t.TEST("!cls.contains(elem, 'x')"));
			eval(t.TEST("!cls.contains(elem, 'y')"));
			eval(t.TEST("cls.contains(elem, 'z')"));
			cls.remove(elem, "z");
			eval(t.TEST("elem.className === ''"));
			eval(t.TEST("!cls.contains(elem, 'x')"));
			eval(t.TEST("!cls.contains(elem, 'y')"));
			eval(t.TEST("!cls.contains(elem, 'z')"));
			cls.add("abc", "a b c");
			eval(t.TEST("cls.contains(elem, 'a')"));
			eval(t.TEST("cls.contains(elem, 'b')"));
			eval(t.TEST("cls.contains(elem, 'c')"));
			cls.toggle(elem, "b");
			eval(t.TEST("cls.contains(elem, 'a')"));
			eval(t.TEST("!cls.contains(elem, 'b')"));
			eval(t.TEST("cls.contains(elem, 'c')"));
			cls.toggle(elem, "b");
			eval(t.TEST("cls.contains(elem, 'a')"));
			eval(t.TEST("cls.contains(elem, 'b')"));
			eval(t.TEST("cls.contains(elem, 'c')"));
			cls.toggle(elem, "a");
			eval(t.TEST("!cls.contains(elem, 'a')"));
			eval(t.TEST("cls.contains(elem, 'b')"));
			eval(t.TEST("cls.contains(elem, 'c')"));
			cls.toggle(elem, "a");
			eval(t.TEST("cls.contains(elem, 'a')"));
			eval(t.TEST("cls.contains(elem, 'b')"));
			eval(t.TEST("cls.contains(elem, 'c')"));
			cls.toggle(elem, "c");
			eval(t.TEST("cls.contains(elem, 'a')"));
			eval(t.TEST("cls.contains(elem, 'b')"));
			eval(t.TEST("!cls.contains(elem, 'c')"));
			cls.toggle(elem, "c");
			eval(t.TEST("cls.contains(elem, 'a')"));
			eval(t.TEST("cls.contains(elem, 'b')"));
			eval(t.TEST("cls.contains(elem, 'c')"));
			cls.replace(elem, "b", "y");
			eval(t.TEST("cls.contains(elem, 'a')"));
			eval(t.TEST("!cls.contains(elem, 'b')"));
			eval(t.TEST("cls.contains(elem, 'c')"));
			eval(t.TEST("!cls.contains(elem, 'x')"));
			eval(t.TEST("cls.contains(elem, 'y')"));
			eval(t.TEST("!cls.contains(elem, 'z')"));
			cls.replace(elem, "a", "x");
			eval(t.TEST("!cls.contains(elem, 'a')"));
			eval(t.TEST("!cls.contains(elem, 'b')"));
			eval(t.TEST("cls.contains(elem, 'c')"));
			eval(t.TEST("cls.contains(elem, 'x')"));
			eval(t.TEST("cls.contains(elem, 'y')"));
			eval(t.TEST("!cls.contains(elem, 'z')"));
			cls.replace(elem, "c", "z");
			eval(t.TEST("!cls.contains(elem, 'a')"));
			eval(t.TEST("!cls.contains(elem, 'b')"));
			eval(t.TEST("!cls.contains(elem, 'c')"));
			eval(t.TEST("cls.contains(elem, 'x')"));
			eval(t.TEST("cls.contains(elem, 'y')"));
			eval(t.TEST("cls.contains(elem, 'z')"));
			win.body().removeChild(elem);
		},
		// style
		function test_style(t){
			var elem = win.doc.createElement("p");
			elem.id = "abc";
			win.body().appendChild(elem);
			style.set("abc", "display", "none");
			eval(t.TEST("elem.style.display === 'none'"));
			eval(t.TEST("style.get(elem, 'display') === 'none'"));
			style.set(elem, {
				display: "block",
				visibility: "visible"
			});
			eval(t.TEST("style.get(elem, 'display') === 'block'"));
			eval(t.TEST("style.get(elem, 'visibility') === 'visible'"));
			win.body().removeChild(elem);
		},
		// prop
		function test_prop(t){
			var elem = win.doc.createElement("p");
			elem.id = "abc";
			win.body().appendChild(elem);
			prop.set("abc", "class", "x y z");
			eval(t.TEST("elem.className === 'x y z'"));
			eval(t.TEST("prop.get(elem, 'className') === 'x y z'"));
			eval(t.TEST("prop.get(elem, 'class') === 'x y z'"));
			prop.set("abc", {
				id: "def",
				className: "a b c",
			});
			eval(t.TEST("elem.id === 'def'"));
			eval(t.TEST("prop.get(elem, 'id') === 'def'"));
			eval(t.TEST("elem.className === 'a b c'"));
			eval(t.TEST("prop.get(elem, 'className') === 'a b c'"));
			eval(t.TEST("prop.get(elem, 'class') === 'a b c'"));
			prop.set(elem, "style", {
				display: "block",
				visibility: "visible"
			});
			eval(t.TEST("style.get(elem, 'display') === 'block'"));
			eval(t.TEST("style.get(elem, 'visibility') === 'visible'"));
			prop.set(elem, "innerHTML", "<span>Hello, world!</span>");
			eval(t.TEST("elem.firstChild"));
			eval(t.TEST("elem.firstChild === elem.lastChild"));
			eval(t.TEST("elem.firstChild.tagName.toLowerCase() === 'span'"));
			eval(t.TEST("elem.firstChild.firstChild"));
			eval(t.TEST("elem.firstChild.firstChild.data === 'Hello, world!'"));
			win.body().removeChild(elem);
		},
		// destroy
		function test_destroy(t){
			var elem = win.doc.createElement("p");
			elem.id = "abc";
			elem.innerHTML = "<span id='def'>Hello, world!</span>";
			win.body().appendChild(elem);
			eval(t.TEST("dom.byId('abc')"));
			eval(t.TEST("dom.byId('def')"));
			destroy.empty(elem);
			eval(t.TEST("dom.byId('abc')"));
			eval(t.TEST("!dom.byId('def')"));
			eval(t.TEST("elem.innerHTML === ''"));
			elem.innerHTML = "<span id='def'>Hello, world!</span>";
			eval(t.TEST("dom.byId('abc')"));
			eval(t.TEST("dom.byId('def')"));
			destroy(elem);
			eval(t.TEST("!dom.byId('abc')"));
			eval(t.TEST("!dom.byId('def')"));
		},
		// place
		function test_place(t){
			// preparing a setup
			destroy.empty(win.body());
			var elem = win.doc.createElement("p");
			elem.id = "a";
			elem.innerHTML = "<span id='a1'>Hello, world!</span>";
			win.body().appendChild(elem);
			elem = win.doc.createElement("p");
			elem.id = "b";
			elem.innerHTML = "<span id='b1'>Hello, world!</span>";
			win.body().appendChild(elem);
			elem = win.doc.createElement("p");
			elem.id = "c";
			elem.innerHTML = "<span id='c1'>Hello, world!</span>";
			win.body().appendChild(elem);
			// making inserts
			place("<p id='x1'></p>", "b", "before");
			place("<p id='x2'></p>", "b", "after");
			place("<p id='x3'></p>", "c", "replace");
			place("<span id='x4'></span>", "a", "first");
			place("<span id='x5'></span>", "a", "last");
			place("<span id='x6'></span>", "a");
			place("<span id='x7'></span>", "b", "only");
			place("<span id='x8'></span>", "b", 0);
			place("<span id='x9'></span>", "b", 2);
			// checking top-level nodes
			var ids = [];
			for(var node = win.body().firstChild; node; node = node.nextSibling){
				ids.push(node.id);
			}
			eval(t.TEST("t.unify(ids, ['a', 'x1', 'b', 'x2', 'x3'])"));
			// checking "a"
			ids = [];
			for(node = dom.byId("a").firstChild; node; node = node.nextSibling){
				ids.push(node.id);
			}
			eval(t.TEST("t.unify(ids, ['x4', 'a1', 'x5', 'x6'])"));
			// checking "b"
			ids = [];
			for(node = dom.byId("b").firstChild; node; node = node.nextSibling){
				ids.push(node.id);
			}
			eval(t.TEST("t.unify(ids, ['x8', 'x7', 'x9'])"));
			destroy.empty(win.body());
		},
		// toDom
		function test_toDom(t){
			var frag = toDom("<p>Hello!</p>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'p'"));
			frag = toDom("<span>Hello!</span>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'span'"));
			frag = toDom("<option>Hello!</option>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'option'"));
			frag = toDom("<tr><td>1</td></tr>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'tr'"));
			frag = toDom("<td>1</td>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'td'"));
			frag = toDom("<th>1</th>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'th'"));
			frag = toDom("<tr><td>1</td></tr><tr><td>2</td></tr>");
			eval(t.TEST("frag.nodeType === 11"));
			eval(t.TEST("frag.childNodes.length === 2"));
			eval(t.TEST("frag.firstChild.tagName.toLowerCase() === 'tr'"));
			eval(t.TEST("frag.lastChild.tagName.toLowerCase() === 'tr'"));
			frag = toDom("Hello, world!");
			eval(t.TEST("frag.nodeType === 3"));
			eval(t.TEST("frag.data === 'Hello, world!'"));
		},
		// ctr
		function test_ctr(t){
			var elem = ctr("p", {
					id: "abc",
					className: "a b c",
					style: {
						display: "block",
						visibility: "visible"
					},
					innerHTML: "<span>Hello, world!</span>"
				}, win.body());
			eval(t.TEST("elem.id === 'abc'"));
			eval(t.TEST("elem.className === 'a b c'"));
			eval(t.TEST("style.get(elem, 'display') === 'block'"));
			eval(t.TEST("style.get(elem, 'visibility') === 'visible'"));
			eval(t.TEST("elem.firstChild"));
			eval(t.TEST("elem.firstChild === elem.lastChild"));
			eval(t.TEST("elem.firstChild.tagName.toLowerCase() === 'span'"));
			eval(t.TEST("elem.firstChild.firstChild"));
			eval(t.TEST("elem.firstChild.firstChild.data === 'Hello, world!'"));
			win.body().removeChild(elem);
		}
	]);

	unit.run();
});
