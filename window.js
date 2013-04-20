define(["heya-has/sniff", "./main", "./geometry", "./style", "./construct"],
	function(has, dom, geom, style, domConstruct){

	// feature detection
	/* not needed but included here for future reference
	has.add("rtl-innerVerticalScrollBar-on-left", function(win, doc){
		var	body = module.body(doc),
			scrollable = domConstruct.create('div', {
				style: {overflow:'scroll', overflowX:'hidden', direction:'rtl', visibility:'hidden', position:'absolute', left:'0', width:'64px', height:'64px'}
			}, body, "last"),
			center = domConstruct.create('center', {
				style: {overflow:'hidden', direction:'ltr'}
			}, scrollable, "last"),
			inner = domConstruct.create('div', {
				style: {overflow:'visible', display:'inline' }
			}, center, "last");
		inner.innerHTML="&nbsp;";
		var midPoint = Math.max(inner.offsetLeft, geom.position(inner).x);
		var ret = midPoint >= 32;
		center.removeChild(inner);
		scrollable.removeChild(center);
		body.removeChild(scrollable);
		return ret;
	});
	*/

	has.add("rtl-adjust-position-for-verticalScrollBar", function(win, doc){
		var	body = module.body(doc),
			scrollable = domConstruct.create('div', {
				style: {overflow:'scroll', overflowX:'visible', direction:'rtl', visibility:'hidden', position:'absolute', left:'0', top:'0', width:'64px', height:'64px'}
			}, body, "last"),
			div = domConstruct.create('div', {
				style: {overflow:'hidden', direction:'ltr'}
			}, scrollable, "last"),
			ret = geom.position(div).x != 0;
		scrollable.removeChild(div);
		body.removeChild(scrollable);
		return ret;
	});

	has.add("position-fixed-support", function(win, doc){
		// IE6, IE7+quirks, and some older mobile browsers don't support position:fixed
		var	body = module.body(doc),
			outer = domConstruct.create('span', {
				style: {visibility:'hidden', position:'fixed', left:'1px', top:'1px'}
			}, body, "last"),
			inner = domConstruct.create('span', {
				style: {position:'fixed', left:'0', top:'0'}
			}, outer, "last"),
			ret = geom.position(inner).x != geom.position(outer).x;
		outer.removeChild(inner);
		body.removeChild(outer);
		return ret;
	});

	// module:
	//		dojo/window

	var module = {

		// summary:
		//		API to save/set/restore the global/document scope.

		global: this,
		/*=====
		 global: {
			 // summary:
			 //		Alias for the current window. 'global' can be modified
			 //		for temporary context shifting. See also withGlobal().
			 // description:
			 //		Use this rather than referring to 'window' to ensure your code runs
			 //		correctly in managed contexts.
		 },
		 =====*/

		doc: this["document"] || null,
		/*=====
		doc: {
			// summary:
			//		Alias for the current document. 'doc' can be modified
			//		for temporary context shifting. See also withDoc().
			// description:
			//		Use this rather than referring to 'window.document' to ensure your code runs
			//		correctly in managed contexts.
			// example:
			//	|	n.appendChild(dojo.doc.createElement('div'));
		},
		=====*/

		body: function(/*Document?*/ doc){
			// summary:
			//		Return the body element of the specified document or of dojo/_base/window::doc.
			// example:
			//	|	win.body().appendChild(dojo.doc.createElement('div'));

			// Note: document.body is not defined for a strict xhtml document
			// Would like to memoize this, but dojo.doc can change vi dojo.withDoc().
			doc = doc || dojo.doc;
			return doc.body || doc.getElementsByTagName("body")[0]; // Node
		},

		setContext: function(/*Object*/ globalObject, /*DocumentElement*/ globalDocument){
			// summary:
			//		changes the behavior of many core Dojo functions that deal with
			//		namespace and DOM lookup, changing them to work in a new global
			//		context (e.g., an iframe). The varibles dojo.global and dojo.doc
			//		are modified as a result of calling this function and the result of
			//		`dojo.body()` likewise differs.
			module.global = globalObject;
			module.doc = globalDocument;
		},

		withGlobal: function(	/*Object*/ globalObject,
								/*Function*/ callback,
								/*Object?*/ thisObject,
								/*Array?*/ cbArguments){
			// summary:
			//		Invoke callback with globalObject as dojo.global and
			//		globalObject.document as dojo.doc.
			// description:
			//		Invoke callback with globalObject as dojo.global and
			//		globalObject.document as dojo.doc. If provided, globalObject
			//		will be executed in the context of object thisObject
			//		When callback() returns or throws an error, the dojo.global
			//		and dojo.doc will be restored to its previous state.

			var oldGlob = module.global;
			try{
				module.global = globalObject;
				return module.withDoc.call(null, globalObject.document, callback, thisObject, cbArguments);
			}finally{
				module.global = oldGlob;
			}
		},

		withDoc: function(	/*DocumentElement*/ documentObject,
							/*Function*/ callback,
							/*Object?*/ thisObject,
							/*Array?*/ cbArguments){
			// summary:
			//		Invoke callback with documentObject as dojo/_base/window::doc.
			// description:
			//		Invoke callback with documentObject as dojo/_base/window::doc. If provided,
			//		callback will be executed in the context of object thisObject
			//		When callback() returns or throws an error, the dojo/_base/window::doc will
			//		be restored to its previous state.

			var oldDoc = module.doc,
				oldQ = has("quirks"),
				oldIE = has("ie"), isIE, mode, pwin;

			try{
				module.doc = documentObject;
				// update dojo.isQuirks and the value of the has feature "quirks".
				// remove setting dojo.isQuirks and dojo.isIE for 2.0
				module.isQuirks = has.add("quirks", module.doc.compatMode == "BackCompat", true, true); // no need to check for QuirksMode which was Opera 7 only

				if(has("ie")){
					if((pwin = documentObject.parentWindow) && pwin.navigator){
						// re-run IE detection logic and update dojo.isIE / has("ie")
						// (the only time parentWindow/navigator wouldn't exist is if we were not
						// passed an actual legitimate document object)
						isIE = parseFloat(pwin.navigator.appVersion.split("MSIE ")[1]) || undefined;
						mode = documentObject.documentMode;
						if(mode && mode != 5 && Math.floor(isIE) != mode){
							isIE = mode;
						}
						module.isIE = has.add("ie", isIE, true, true);
					}
				}

				if(thisObject && typeof callback == "string"){
					callback = thisObject[callback];
				}

				return callback.apply(thisObject, cbArguments || []);
			}finally{
				module.doc = oldDoc;
				module.isQuirks = has.add("quirks", oldQ, true, true);
				module.isIE = has.add("ie", oldIE, true, true);
			}
		}

		// summary:
		//		TODOC

		getBox: function(/*Document?*/ doc){
			// summary:
			//		Returns the dimensions and scroll position of the viewable area of a browser window

			doc = doc || module.doc;

			var
				scrollRoot = (doc.compatMode == 'BackCompat') ? module.body(doc) : doc.documentElement,
				// get scroll position
				scroll = geom.docScroll(doc), // scrollRoot.scrollTop/Left should work
				w, h;

			if(has("touch")){ // if(scrollbars not supported)
				var uiWindow = module.get(doc);   // use UI window, not dojo.global window
				// on mobile, scrollRoot.clientHeight <= uiWindow.innerHeight <= scrollRoot.offsetHeight, return uiWindow.innerHeight
				w = uiWindow.innerWidth || scrollRoot.clientWidth; // || scrollRoot.clientXXX probably never evaluated
				h = uiWindow.innerHeight || scrollRoot.clientHeight;
			}else{
				// on desktops, scrollRoot.clientHeight <= scrollRoot.offsetHeight <= uiWindow.innerHeight, return scrollRoot.clientHeight
				// uiWindow.innerWidth/Height includes the scrollbar and cannot be used
				w = scrollRoot.clientWidth;
				h = scrollRoot.clientHeight;
			}
			return {
				l: scroll.x,
				t: scroll.y,
				w: w,
				h: h
			};
		},

		get: function(/*Document*/ doc){
			// summary:
			//		Get window object associated with document doc.
			// doc:
			//		The document to get the associated window for.

			// In some IE versions (at least 6.0), document.parentWindow does not return a
			// reference to the real window object (maybe a copy), so we must fix it as well
			// We use IE specific execScript to attach the real window reference to
			// document._parentWindow for later use
			if(has("ie") && module !== document.parentWindow){
				/*
				In IE 6, only the variable "window" can be used to connect events (others
				may be only copies).
				*/
				doc.parentWindow.execScript("document._parentWindow = window;", "Javascript");
				//to prevent memory leak, unset it after use
				//another possibility is to add an onUnload handler which seems overkill to me (liucougar)
				var win = doc._parentWindow;
				doc._parentWindow = null;
				return win;	//	Window
			}

			return doc.parentWindow || doc.defaultView;	//	Window
		},

		scrollIntoView: function(/*DomNode*/ node, /*Object?*/ pos){
			// summary:
			//		Scroll the passed node into view using minimal movement, if it is not already.

			// Don't rely on node.scrollIntoView working just because the function is there since
			// it forces the node to the page's bottom or top (and left or right in IE) without consideration for the minimal movement.
			// WebKit's node.scrollIntoViewIfNeeded doesn't work either for inner scrollbars in right-to-left mode
			// and when there's a fixed position scrollable element

			try{ // catch unexpected/unrecreatable errors (#7808) since we can recover using a semi-acceptable native method
				node = dom.byId(node);
				var	doc = node.ownerDocument || module.doc,	// TODO: why module.doc?  Isn't node.ownerDocument always defined?
					body = module.body(doc),
					html = doc.documentElement || body.parentNode,
					isIE = has("ie"),
					isWK = has("webkit");
				// if an untested browser, then use the native method
				if(node == body || node == html){ return; }
				if(!(has("mozilla") || isIE || isWK || has("opera")) && ("scrollIntoView" in node)){
					node.scrollIntoView(false); // short-circuit to native if possible
					return;
				}
				var	backCompat = doc.compatMode == 'BackCompat',
					rootWidth = Math.min(body.clientWidth || html.clientWidth, html.clientWidth || body.clientWidth),
					rootHeight = Math.min(body.clientHeight || html.clientHeight, html.clientHeight || body.clientHeight),
					scrollRoot = (isWK || backCompat) ? body : html,
					nodePos = pos || geom.position(node),
					el = node.parentNode,
					isFixed = function(el){
						return (isIE <= 6 || (isIE == 7 && backCompat))
							? false
							: (has("position-fixed-support") && (style.get(el, 'position').toLowerCase() == "fixed"));
					};
				if(isFixed(node)){ return; } // nothing to do
				while(el){
					if(el == body){ el = scrollRoot; }
					var	elPos = geom.position(el),
						fixedPos = isFixed(el),
						rtl = style.getComputedStyle(el).direction.toLowerCase() == "rtl";

					if(el == scrollRoot){
						elPos.w = rootWidth; elPos.h = rootHeight;
						if(scrollRoot == html && isIE && rtl){ elPos.x += scrollRoot.offsetWidth-elPos.w; } // IE workaround where scrollbar causes negative x
						if(elPos.x < 0 || !isIE || isIE >= 9){ elPos.x = 0; } // older IE can have values > 0
						if(elPos.y < 0 || !isIE || isIE >= 9){ elPos.y = 0; }
					}else{
						var pb = geom.getPadBorderExtents(el);
						elPos.w -= pb.w; elPos.h -= pb.h; elPos.x += pb.l; elPos.y += pb.t;
						var clientSize = el.clientWidth,
							scrollBarSize = elPos.w - clientSize;
						if(clientSize > 0 && scrollBarSize > 0){
							if(rtl && has("rtl-adjust-position-for-verticalScrollBar")){
								elPos.x += scrollBarSize;
							}
							elPos.w = clientSize;
						}
						clientSize = el.clientHeight;
						scrollBarSize = elPos.h - clientSize;
						if(clientSize > 0 && scrollBarSize > 0){
							elPos.h = clientSize;
						}
					}
					if(fixedPos){ // bounded by viewport, not parents
						if(elPos.y < 0){
							elPos.h += elPos.y; elPos.y = 0;
						}
						if(elPos.x < 0){
							elPos.w += elPos.x; elPos.x = 0;
						}
						if(elPos.y + elPos.h > rootHeight){
							elPos.h = rootHeight - elPos.y;
						}
						if(elPos.x + elPos.w > rootWidth){
							elPos.w = rootWidth - elPos.x;
						}
					}
					// calculate overflow in all 4 directions
					var	l = nodePos.x - elPos.x, // beyond left: < 0
//						t = nodePos.y - Math.max(elPos.y, 0), // beyond top: < 0
						t = nodePos.y - elPos.y, // beyond top: < 0
						r = l + nodePos.w - elPos.w, // beyond right: > 0
						bot = t + nodePos.h - elPos.h; // beyond bottom: > 0
					var s, old;
					if(r * l > 0 && (!!el.scrollLeft || el == scrollRoot || el.scrollWidth > el.offsetHeight)){
						s = Math[l < 0? "max" : "min"](l, r);
						if(rtl && ((isIE == 8 && !backCompat) || isIE >= 9)){ s = -s; }
						old = el.scrollLeft;
						el.scrollLeft += s;
						s = el.scrollLeft - old;
						nodePos.x -= s;
					}
					if(bot * t > 0 && (!!el.scrollTop || el == scrollRoot || el.scrollHeight > el.offsetHeight)){
						s = Math.ceil(Math[t < 0? "max" : "min"](t, bot));
						old = el.scrollTop;
						el.scrollTop += s;
						s = el.scrollTop - old;
						nodePos.y -= s;
					}
					el = (el != scrollRoot) && !fixedPos && el.parentNode;
				}
			}catch(error){
				console.error('scrollIntoView: ' + error);
				node.scrollIntoView(false);
			}
		}
	};

	return module;
});
