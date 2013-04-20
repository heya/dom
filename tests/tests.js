/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["module", "heya-unit", "./window", "./main", "./class", "./prop", "./style",
	"./construct", "./geometry", "./attr"],
function(module, unit, win, dom, cls, prop, style, construct, geom, attr){
	"use strict";

	// tests

	unit.add(module, [
		// window
		function test_window(t){
			eval(t.TEST("win.global === window"));
			eval(t.TEST("win.doc === document"));
			eval(t.TEST("win.body() === document.body"));
		}
	]);

	unit.run();
});
