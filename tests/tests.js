/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["module", "heya-unit", "../window", "../main", "../class", "../prop", "../style",
	"../construct", "../geometry", "../attr", "../winutils", "../domutils"],
function(module, unit, win, dom, cls, prop, style,
	construct, geom, attr, winutils, domutils){
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
		}
	]);

	unit.run();
});
