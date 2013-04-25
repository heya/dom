define(["module", "heya-unit", "../main"],
function(module, unit, dom){
	"use strict";

	// tests (this is a copy of tests.js custom-tailored to test the main module)

	unit.add(module, [
		// window
		function test_window(t){
			eval(t.TEST("dom.body() === document.body"));
		},
		// dom
		function test_dom(t){
			eval(t.TEST("!dom.byId('abc')"));
			var elem = document.createElement("p");
			elem.id = "abc";
			dom.body().appendChild(elem);
			eval(t.TEST("dom.byId('abc') === elem"));
			eval(t.TEST("dom.isDescendant('abc', dom.body())"));
			eval(t.TEST("!dom.isDescendant(dom.body(), 'abc')"));
			dom.body().removeChild(elem);
			eval(t.TEST("!dom.byId('abc')"));
		},
		// class
		function test_class(t){
			var elem = document.createElement("p");
			elem.id = "abc";
			dom.body().appendChild(elem);
			eval(t.TEST("elem.className === ''"));
			dom.cls.add(elem, "x");
			eval(t.TEST("elem.className === 'x'"));
			eval(t.TEST("dom.cls.contains(elem, 'x')"));
			dom.cls.add(elem, "y");
			eval(t.TEST("dom.cls.contains(elem, 'x')"));
			eval(t.TEST("dom.cls.contains(elem, 'y')"));
			eval(t.TEST("!dom.cls.contains(elem, 'z')"));
			dom.cls.add(elem, "z");
			eval(t.TEST("dom.cls.contains(elem, 'x')"));
			eval(t.TEST("dom.cls.contains(elem, 'y')"));
			eval(t.TEST("dom.cls.contains(elem, 'z')"));
			dom.cls.remove(elem, "y");
			eval(t.TEST("dom.cls.contains(elem, 'x')"));
			eval(t.TEST("!dom.cls.contains(elem, 'y')"));
			eval(t.TEST("dom.cls.contains(elem, 'z')"));
			dom.cls.remove(elem, "x");
			eval(t.TEST("elem.className === 'z'"));
			eval(t.TEST("!dom.cls.contains(elem, 'x')"));
			eval(t.TEST("!dom.cls.contains(elem, 'y')"));
			eval(t.TEST("dom.cls.contains(elem, 'z')"));
			dom.cls.remove(elem, "z");
			eval(t.TEST("elem.className === ''"));
			eval(t.TEST("!dom.cls.contains(elem, 'x')"));
			eval(t.TEST("!dom.cls.contains(elem, 'y')"));
			eval(t.TEST("!dom.cls.contains(elem, 'z')"));
			dom.cls.add("abc", "a b c");
			eval(t.TEST("dom.cls.contains(elem, 'a')"));
			eval(t.TEST("dom.cls.contains(elem, 'b')"));
			eval(t.TEST("dom.cls.contains(elem, 'c')"));
			dom.cls.toggle(elem, "b");
			eval(t.TEST("dom.cls.contains(elem, 'a')"));
			eval(t.TEST("!dom.cls.contains(elem, 'b')"));
			eval(t.TEST("dom.cls.contains(elem, 'c')"));
			dom.cls.toggle(elem, "b");
			eval(t.TEST("dom.cls.contains(elem, 'a')"));
			eval(t.TEST("dom.cls.contains(elem, 'b')"));
			eval(t.TEST("dom.cls.contains(elem, 'c')"));
			dom.cls.toggle(elem, "a");
			eval(t.TEST("!dom.cls.contains(elem, 'a')"));
			eval(t.TEST("dom.cls.contains(elem, 'b')"));
			eval(t.TEST("dom.cls.contains(elem, 'c')"));
			dom.cls.toggle(elem, "a");
			eval(t.TEST("dom.cls.contains(elem, 'a')"));
			eval(t.TEST("dom.cls.contains(elem, 'b')"));
			eval(t.TEST("dom.cls.contains(elem, 'c')"));
			dom.cls.toggle(elem, "c");
			eval(t.TEST("dom.cls.contains(elem, 'a')"));
			eval(t.TEST("dom.cls.contains(elem, 'b')"));
			eval(t.TEST("!dom.cls.contains(elem, 'c')"));
			dom.cls.toggle(elem, "c");
			eval(t.TEST("dom.cls.contains(elem, 'a')"));
			eval(t.TEST("dom.cls.contains(elem, 'b')"));
			eval(t.TEST("dom.cls.contains(elem, 'c')"));
			dom.cls.replace(elem, "b", "y");
			eval(t.TEST("dom.cls.contains(elem, 'a')"));
			eval(t.TEST("!dom.cls.contains(elem, 'b')"));
			eval(t.TEST("dom.cls.contains(elem, 'c')"));
			eval(t.TEST("!dom.cls.contains(elem, 'x')"));
			eval(t.TEST("dom.cls.contains(elem, 'y')"));
			eval(t.TEST("!dom.cls.contains(elem, 'z')"));
			dom.cls.replace(elem, "a", "x");
			eval(t.TEST("!dom.cls.contains(elem, 'a')"));
			eval(t.TEST("!dom.cls.contains(elem, 'b')"));
			eval(t.TEST("dom.cls.contains(elem, 'c')"));
			eval(t.TEST("dom.cls.contains(elem, 'x')"));
			eval(t.TEST("dom.cls.contains(elem, 'y')"));
			eval(t.TEST("!dom.cls.contains(elem, 'z')"));
			dom.cls.replace(elem, "c", "z");
			eval(t.TEST("!dom.cls.contains(elem, 'a')"));
			eval(t.TEST("!dom.cls.contains(elem, 'b')"));
			eval(t.TEST("!dom.cls.contains(elem, 'c')"));
			eval(t.TEST("dom.cls.contains(elem, 'x')"));
			eval(t.TEST("dom.cls.contains(elem, 'y')"));
			eval(t.TEST("dom.cls.contains(elem, 'z')"));
			dom.body().removeChild(elem);
		},
		// style
		function test_style(t){
			var elem = document.createElement("p");
			elem.id = "abc";
			dom.body().appendChild(elem);
			dom.style.set("abc", "display", "none");
			eval(t.TEST("elem.style.display === 'none'"));
			eval(t.TEST("dom.style.get(elem, 'display') === 'none'"));
			dom.style.set(elem, {
				display: "block",
				visibility: "visible"
			});
			eval(t.TEST("dom.style.get(elem, 'display') === 'block'"));
			eval(t.TEST("dom.style.get(elem, 'visibility') === 'visible'"));
			dom.body().removeChild(elem);
		},
		// prop
		function test_prop(t){
			var elem = document.createElement("p");
			elem.id = "abc";
			dom.body().appendChild(elem);
			dom.prop.set("abc", "class", "x y z");
			eval(t.TEST("elem.className === 'x y z'"));
			eval(t.TEST("dom.prop.get(elem, 'className') === 'x y z'"));
			eval(t.TEST("dom.prop.get(elem, 'class') === 'x y z'"));
			dom.prop.set("abc", {
				id: "def",
				className: "a b c",
			});
			eval(t.TEST("elem.id === 'def'"));
			eval(t.TEST("dom.prop.get(elem, 'id') === 'def'"));
			eval(t.TEST("elem.className === 'a b c'"));
			eval(t.TEST("dom.prop.get(elem, 'className') === 'a b c'"));
			eval(t.TEST("dom.prop.get(elem, 'class') === 'a b c'"));
			dom.prop.set(elem, "style", {
				display: "block",
				visibility: "visible"
			});
			eval(t.TEST("dom.style.get(elem, 'display') === 'block'"));
			eval(t.TEST("dom.style.get(elem, 'visibility') === 'visible'"));
			dom.prop.set(elem, "innerHTML", "<span>Hello, world!</span>");
			eval(t.TEST("elem.firstChild"));
			eval(t.TEST("elem.firstChild === elem.lastChild"));
			eval(t.TEST("elem.firstChild.tagName.toLowerCase() === 'span'"));
			eval(t.TEST("elem.firstChild.firstChild"));
			eval(t.TEST("elem.firstChild.firstChild.data === 'Hello, world!'"));
			dom.body().removeChild(elem);
		},
		// destroy
		function test_destroy(t){
			var elem = document.createElement("p");
			elem.id = "abc";
			elem.innerHTML = "<span id='def'>Hello, world!</span>";
			dom.body().appendChild(elem);
			eval(t.TEST("dom.byId('abc')"));
			eval(t.TEST("dom.byId('def')"));
			dom.empty(elem);
			eval(t.TEST("dom.byId('abc')"));
			eval(t.TEST("!dom.byId('def')"));
			eval(t.TEST("elem.innerHTML === ''"));
			elem.innerHTML = "<span id='def'>Hello, world!</span>";
			eval(t.TEST("dom.byId('abc')"));
			eval(t.TEST("dom.byId('def')"));
			dom.destroy(elem);
			eval(t.TEST("!dom.byId('abc')"));
			eval(t.TEST("!dom.byId('def')"));
		},
		// place
		function test_place(t){
			// preparing a setup
			dom.empty(dom.body());
			var elem = document.createElement("p");
			elem.id = "a";
			elem.innerHTML = "<span id='a1'>Hello, world!</span>";
			dom.body().appendChild(elem);
			elem = document.createElement("p");
			elem.id = "b";
			elem.innerHTML = "<span id='b1'>Hello, world!</span>";
			dom.body().appendChild(elem);
			elem = document.createElement("p");
			elem.id = "c";
			elem.innerHTML = "<span id='c1'>Hello, world!</span>";
			dom.body().appendChild(elem);
			// making inserts
			dom.place("<p id='x1'></p>", "b", "before");
			dom.place("<p id='x2'></p>", "b", "after");
			dom.place("<p id='x3'></p>", "c", "replace");
			dom.place("<span id='x4'></span>", "a", "first");
			dom.place("<span id='x5'></span>", "a", "last");
			dom.place("<span id='x6'></span>", "a");
			dom.place("<span id='x7'></span>", "b", "only");
			dom.place("<span id='x8'></span>", "b", 0);
			dom.place("<span id='x9'></span>", "b", 2);
			// checking top-level nodes
			var ids = [];
			for(var node = dom.body().firstChild; node; node = node.nextSibling){
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
			dom.empty(dom.body());
		},
		// toDom
		function test_toDom(t){
			var frag = dom.toDom("<p>Hello!</p>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'p'"));
			frag = dom.toDom("<span>Hello!</span>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'span'"));
			frag = dom.toDom("<option>Hello!</option>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'option'"));
			frag = dom.toDom("<tr><td>1</td></tr>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'tr'"));
			frag = dom.toDom("<td>1</td>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'td'"));
			frag = dom.toDom("<th>1</th>");
			eval(t.TEST("frag.nodeType === 1 && frag.tagName.toLowerCase() === 'th'"));
			frag = dom.toDom("<tr><td>1</td></tr><tr><td>2</td></tr>");
			eval(t.TEST("frag.nodeType === 11"));
			eval(t.TEST("frag.childNodes.length === 2"));
			eval(t.TEST("frag.firstChild.tagName.toLowerCase() === 'tr'"));
			eval(t.TEST("frag.lastChild.tagName.toLowerCase() === 'tr'"));
			frag = dom.toDom("Hello, world!");
			eval(t.TEST("frag.nodeType === 3"));
			eval(t.TEST("frag.data === 'Hello, world!'"));
		},
		// ctr
		function test_ctr(t){
			var elem = dom.create("p", {
					id: "abc",
					className: "a b c",
					style: {
						display: "block",
						visibility: "visible"
					},
					innerHTML: "<span>Hello, world!</span>"
				}, dom.body());
			eval(t.TEST("elem.id === 'abc'"));
			eval(t.TEST("elem.className === 'a b c'"));
			eval(t.TEST("dom.style.get(elem, 'display') === 'block'"));
			eval(t.TEST("dom.style.get(elem, 'visibility') === 'visible'"));
			eval(t.TEST("elem.firstChild"));
			eval(t.TEST("elem.firstChild === elem.lastChild"));
			eval(t.TEST("elem.firstChild.tagName.toLowerCase() === 'span'"));
			eval(t.TEST("elem.firstChild.firstChild"));
			eval(t.TEST("elem.firstChild.firstChild.data === 'Hello, world!'"));
			dom.body().removeChild(elem);
		},
		// geometry
		function test_geometry(t){
			var elem = dom.create("p", {
					style: {
						padding: "1px 2px 3px 4px",
						border: "solid black",
						borderWidth: "5px 6px 7px 8px",
						margin: "10px 20px 30px 40px"
					}
				}, dom.body());
			var box = dom.getPadExtents(elem);
			eval(t.TEST("box.t === 1"));
			eval(t.TEST("box.r === 2"));
			eval(t.TEST("box.b === 3"));
			eval(t.TEST("box.l === 4"));
			eval(t.TEST("box.w === 6"));
			eval(t.TEST("box.h === 4"));
			box = dom.getBorderExtents(elem);
			eval(t.TEST("box.t === 5"));
			eval(t.TEST("box.r === 6"));
			eval(t.TEST("box.b === 7"));
			eval(t.TEST("box.l === 8"));
			eval(t.TEST("box.w === 14"));
			eval(t.TEST("box.h === 12"));
			box = dom.getPadBorderExtents(elem);
			eval(t.TEST("box.t === 6"));
			eval(t.TEST("box.r === 8"));
			eval(t.TEST("box.b === 10"));
			eval(t.TEST("box.l === 12"));
			eval(t.TEST("box.w === 20"));
			eval(t.TEST("box.h === 16"));
			box = dom.getMarginExtents(elem);
			eval(t.TEST("box.t === 10"));
			eval(t.TEST("box.r === 20"));
			eval(t.TEST("box.b === 30"));
			eval(t.TEST("box.l === 40"));
			eval(t.TEST("box.w === 60"));
			eval(t.TEST("box.h === 40"));

			dom.prop.set(elem, {
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
			var contentBox = dom.getContentBox(elem),
				marginBox  = dom.getMarginBox(elem);
			//eval(t.TEST("contentBox.t === marginBox.t"));
			//eval(t.TEST("contentBox.l === marginBox.l"));
			eval(t.TEST("contentBox.w === marginBox.w"));
			eval(t.TEST("contentBox.h === marginBox.h"));

			dom.style.set(elem, {
				padding: "1px 2px 3px 4px",
				borderWidth: "5px 6px 7px 8px",
				margin: "10px 20px 30px 40px"
			});
			box = dom.getContentBox(elem);
			//eval(t.TEST("box.t === contentBox.t"));
			//eval(t.TEST("box.l === contentBox.l"));
			eval(t.TEST("box.w === contentBox.w"));
			eval(t.TEST("box.h === contentBox.h"));
			box = dom.getMarginBox(elem);
			eval(t.TEST("box.t === marginBox.t"));
			eval(t.TEST("box.l === marginBox.l"));
			eval(t.TEST("box.w === marginBox.w + 2 + 6 + 20 + 4 + 8 + 40"));
			eval(t.TEST("box.h === marginBox.h + 1 + 5 + 10 + 3 + 7 + 30"));

			dom.setContentSize(elem, {w: 300, h: 400});
			box = dom.getContentBox(elem);
			//eval(t.TEST("box.t === 100"));
			//eval(t.TEST("box.l === 200"));
			eval(t.TEST("box.w === 300"));
			eval(t.TEST("box.h === 400"));
			box = dom.getMarginBox(elem);
			eval(t.TEST("box.t === 100"));
			eval(t.TEST("box.l === 200"));
			eval(t.TEST("box.w === 300 + 2 + 6 + 20 + 4 + 8 + 40"));
			eval(t.TEST("box.h === 400 + 1 + 5 + 10 + 3 + 7 + 30"));

			dom.setMarginBox(elem, {t: 300, l: 400, w: 500, h: 600});
			box = dom.getContentBox(elem);
			//eval(t.TEST("box.t === 300"));
			//eval(t.TEST("box.l === 400"));
			eval(t.TEST("box.w === 500 - (2 + 6 + 20 + 4 + 8 + 40)"));
			eval(t.TEST("box.h === 600 - (1 + 5 + 10 + 3 + 7 + 30)"));
			box = dom.getMarginBox(elem);
			eval(t.TEST("box.t === 300"));
			eval(t.TEST("box.l === 400"));
			eval(t.TEST("box.w === 500"));
			eval(t.TEST("box.h === 600"));

			box = dom.position(elem, true);
			eval(t.TEST("box.x === 400 + 40"));
			eval(t.TEST("box.y === 300 + 10"));
			eval(t.TEST("box.w === 500 - 20 - 40"));
			eval(t.TEST("box.h === 600 - 10 - 30"));

			box = dom.getMarginSize(elem);
			eval(t.TEST("box.w === 500"));
			eval(t.TEST("box.h === 600"));

			dom.destroy(elem);
		}
	]);

	unit.run();
});
