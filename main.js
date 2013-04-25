define(["./dom", "./class", "./style", "./prop", "./destroy", "./geometry",
	"./toDom", "./place", "./construct", "./window"],
function(dom, cls, style, prop, destroy, geom, toDom, place, create, win){
	var module = {
			toDom: toDom, place: place, create: create,
			body: win.body, destroy: destroy, empty: destroy.empty,
			cls: cls, style: style, prop: prop
		},
		mixes = [dom, geom];

	// populate our main module by mixing other modules
	mixes.forEach(function(mod){
		for(var k in mod){
			module[k] = mod[k];
		}
	});

	return module;
});
