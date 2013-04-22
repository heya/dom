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
		},
		// geometry
		function test_geometry(t){
			var elem = ctr("p", {
					style: {
						padding: "1px 2px 3px 4px",
						border: "solid black",
						borderWidth: "5px 6px 7px 8px",
						margin: "10px 20px 30px 40px"
					}
				}, win.body());
			var box = geom.getPadExtents(elem);
			eval(t.TEST("box.t === 1"));
			eval(t.TEST("box.r === 2"));
			eval(t.TEST("box.b === 3"));
			eval(t.TEST("box.l === 4"));
			eval(t.TEST("box.w === 6"));
			eval(t.TEST("box.h === 4"));
			box = geom.getBorderExtents(elem);
			eval(t.TEST("box.t === 5"));
			eval(t.TEST("box.r === 6"));
			eval(t.TEST("box.b === 7"));
			eval(t.TEST("box.l === 8"));
			eval(t.TEST("box.w === 14"));
			eval(t.TEST("box.h === 12"));
			box = geom.getPadBorderExtents(elem);
			eval(t.TEST("box.t === 6"));
			eval(t.TEST("box.r === 8"));
			eval(t.TEST("box.b === 10"));
			eval(t.TEST("box.l === 12"));
			eval(t.TEST("box.w === 20"));
			eval(t.TEST("box.h === 16"));
			box = geom.getMarginExtents(elem);
			eval(t.TEST("box.t === 10"));
			eval(t.TEST("box.r === 20"));
			eval(t.TEST("box.b === 30"));
			eval(t.TEST("box.l === 40"));
			eval(t.TEST("box.w === 60"));
			eval(t.TEST("box.h === 40"));

			prop.set(elem, {
				innerHTML: "Hello, world!",
				style: {
					position: "absolute",
					top: "100px",
					left: "200px",
					padding: "0",
					borderWidth: "0",
					margin: "0"
				}
			});
			var contentBox = geom.getContentBox(elem),
				marginBox  = geom.getMarginBox(elem);
			//eval(t.TEST("contentBox.t === marginBox.t"));
			//eval(t.TEST("contentBox.l === marginBox.l"));
			eval(t.TEST("contentBox.w === marginBox.w"));
			eval(t.TEST("contentBox.h === marginBox.h"));

			style.set(elem, {
				padding: "1px 2px 3px 4px",
				borderWidth: "5px 6px 7px 8px",
				margin: "10px 20px 30px 40px"
			});
			box = geom.getContentBox(elem);
			//eval(t.TEST("box.t === contentBox.t"));
			//eval(t.TEST("box.l === contentBox.l"));
			eval(t.TEST("box.w === contentBox.w"));
			eval(t.TEST("box.h === contentBox.h"));
			box = geom.getMarginBox(elem);
			eval(t.TEST("box.t === marginBox.t"));
			eval(t.TEST("box.l === marginBox.l"));
			eval(t.TEST("box.w === marginBox.w + 2 + 6 + 20 + 4 + 8 + 40"));
			eval(t.TEST("box.h === marginBox.h + 1 + 5 + 10 + 3 + 7 + 30"));

			geom.setContentSize(elem, {w: 300, h: 400});
			box = geom.getContentBox(elem);
			//eval(t.TEST("box.t === 100"));
			//eval(t.TEST("box.l === 200"));
			eval(t.TEST("box.w === 300"));
			eval(t.TEST("box.h === 400"));
			box = geom.getMarginBox(elem);
			eval(t.TEST("box.t === 100"));
			eval(t.TEST("box.l === 200"));
			eval(t.TEST("box.w === 300 + 2 + 6 + 20 + 4 + 8 + 40"));
			eval(t.TEST("box.h === 400 + 1 + 5 + 10 + 3 + 7 + 30"));

			geom.setMarginBox(elem, {t: 300, l: 400, w: 500, h: 600});
			box = geom.getContentBox(elem);
			//eval(t.TEST("box.t === 300"));
			//eval(t.TEST("box.l === 400"));
			eval(t.TEST("box.w === 500 - (2 + 6 + 20 + 4 + 8 + 40)"));
			eval(t.TEST("box.h === 600 - (1 + 5 + 10 + 3 + 7 + 30)"));
			box = geom.getMarginBox(elem);
			eval(t.TEST("box.t === 300"));
			eval(t.TEST("box.l === 400"));
			eval(t.TEST("box.w === 500"));
			eval(t.TEST("box.h === 600"));

			box = geom.position(elem, true);
			eval(t.TEST("box.x === 400 + 40"));
			eval(t.TEST("box.y === 300 + 10"));
			eval(t.TEST("box.w === 500 - 20 - 40"));
			eval(t.TEST("box.h === 600 - 10 - 30"));

			box = geom.getMarginSize(elem);
			eval(t.TEST("box.w === 500"));
			eval(t.TEST("box.h === 600"));

			destroy(elem);
		},
		// attr
		function test_attr1(t){
			// this function is a copy of test_prop(), it should work the same
			var elem = win.doc.createElement("p");
			elem.id = "abc";
			win.body().appendChild(elem);
			attr.set("abc", "class", "x y z");
			eval(t.TEST("elem.className === 'x y z'"));
			eval(t.TEST("attr.get(elem, 'className') === 'x y z'"));
			eval(t.TEST("attr.get(elem, 'class') === 'x y z'"));
			attr.set("abc", {
				id: "def",
				className: "a b c",
			});
			eval(t.TEST("elem.id === 'def'"));
			eval(t.TEST("attr.get(elem, 'id') === 'def'"));
			eval(t.TEST("elem.className === 'a b c'"));
			eval(t.TEST("attr.get(elem, 'className') === 'a b c'"));
			eval(t.TEST("attr.get(elem, 'class') === 'a b c'"));
			attr.set(elem, "style", {
				display: "block",
				visibility: "visible"
			});
			eval(t.TEST("style.get(elem, 'display') === 'block'"));
			eval(t.TEST("style.get(elem, 'visibility') === 'visible'"));
			attr.set(elem, "innerHTML", "<span>Hello, world!</span>");
			eval(t.TEST("elem.firstChild"));
			eval(t.TEST("elem.firstChild === elem.lastChild"));
			eval(t.TEST("elem.firstChild.tagName.toLowerCase() === 'span'"));
			eval(t.TEST("elem.firstChild.firstChild"));
			eval(t.TEST("elem.firstChild.firstChild.data === 'Hello, world!'"));
			win.body().removeChild(elem);
		},
		function test_attr2(t){
			var elem = win.doc.createElement("p");
			elem.id = "abc";
			win.body().appendChild(elem);
			eval(t.TEST("!attr.has(elem, 'qwerty')"));
			attr.set("abc", "qwerty", "x y z");
			eval(t.TEST("!elem.qwerty"));
			eval(t.TEST("elem.getAttribute('qwerty') === 'x y z'"));
			eval(t.TEST("attr.has(elem, 'qwerty')"));
			eval(t.TEST("attr.get(elem, 'qwerty') === 'x y z'"));
			attr.set(elem, "qwerty", "a b c");
			eval(t.TEST("!elem.qwerty"));
			eval(t.TEST("elem.getAttribute('qwerty') === 'a b c'"));
			eval(t.TEST("attr.has(elem, 'qwerty')"));
			eval(t.TEST("attr.get(elem, 'qwerty') === 'a b c'"));
			attr.remove(elem, "qwerty");
			eval(t.TEST("!elem.qwerty"));
			eval(t.TEST("elem.getAttribute('qwerty') === null"));
			eval(t.TEST("!attr.has(elem, 'qwerty')"));
			eval(t.TEST("attr.get(elem, 'qwerty') === null"));
			win.body().removeChild(elem);
		}
	]);

	unit.run();
});
