// cf README.md for motivation and ToDo
      
AFRAME.registerComponent('selfinspect', {
  init: function () {
    // lifecycles
      //AFrame ?
      //systems ?
      //components: init update remove tick play pause updateSchema
    
    var ignoreProps = ["prototype", "length", "name", "THREE", "TWEEN", "version", "scenes" ]
    
    var sceneEl = this.el
    var aframeColor = "#ef2d5e"
    console.log('selfinspect')
    
    Object.getOwnPropertyNames(AFRAME)
      .map(function(v, i){ 
	var components = 0;
	var entities = 0;
	var others = 0;
      
      
      function addComponentBlock(i, v){
        var aframeColor = "orange";
        var e = document.createElement("a-box");
        e.setAttribute("position", {x:3+components*5, y:i, z:-10} );
        e.setAttribute("snappable", "");
        e.setAttribute("opacity", "0.4");
        e.setAttribute("width", "4");
        e.setAttribute("class", "component");
        e.setAttribute("id", "source_" + v);
        e.setAttribute("blocktype", v);
        var t = document.createElement("a-text");
        t.setAttribute("position", "-1 0 0.51" );
        t.setAttribute("value", v );
        e.appendChild(t);
        var b1 = document.createElement("a-box");
        b1.setAttribute("width", "1" );
        b1.setAttribute("color", aframeColor );
        b1.setAttribute("height", "0.4" );
        b1.setAttribute("position", "-1.5 0.4 0" );
        e.appendChild(t);
        var b0 = document.createElement("a-box");
        b0.setAttribute("width", "1" );
        b0.setAttribute("color", aframeColor );
        b0.setAttribute("height", "0.4" );
        b0.setAttribute("position", "-1.5 0.4 0" );
        e.appendChild(b0);
        var b2 = document.createElement("a-box");
        b2.setAttribute("width", "2" );
        b2.setAttribute("color", aframeColor );
        b2.setAttribute("height", "0.4" );
        b2.setAttribute("position", "1 0.4 0" );
        e.appendChild(b2);
        var b3 = document.createElement("a-box");
        b3.setAttribute("width", "4" );
        b3.setAttribute("color", aframeColor );
        b3.setAttribute("height", "0.4" );
        b3.setAttribute("position", "0 0 0" );
        e.appendChild(b3);
        var b4 = document.createElement("a-box");
        b4.setAttribute("width", "1" );
        b4.setAttribute("color", aframeColor );
        b4.setAttribute("height", "1" );
        b4.setAttribute("position", "-0.5 -0.2 0" );
        e.appendChild(b4);
	components++;
        return e;
      }
      
      function addEntityBlock(i, v){
        var aframeColor = "blue";
        var e = document.createElement("a-box");
        e.setAttribute("position", {x:3+entities*5, y:i, z:-10} );
        e.setAttribute("snappable", "");
        e.setAttribute("opacity", "0.4");
        e.setAttribute("width", "4");
        e.setAttribute("class", "entity");
        e.setAttribute("id", "source_" + v);
        e.setAttribute("blocktype", v);
        var t = document.createElement("a-text");
        t.setAttribute("position", "-1 0 0.51" );
        t.setAttribute("value", v );
        e.appendChild(t);
        var b2 = document.createElement("a-sphere");
        b2.setAttribute("scale", "1 0.2 1" );
        b2.setAttribute("color", aframeColor );
        b2.setAttribute("position", "0 0.5 -0.5" );
        e.appendChild(b2);
        var b3 = document.createElement("a-box");
        b3.setAttribute("width", "4" );
        b3.setAttribute("color", aframeColor );
        b3.setAttribute("position", "0 0 0" );
        e.appendChild(b3);
        var b4 = document.createElement("a-box");
        b4.setAttribute("color", aframeColor );
        b4.setAttribute("position", "-0.5 -0.2 0" );
        e.appendChild(b4);
	entities++;
        return e;
      }
      
      
      function addOtherBlock(i, v){
        var e = document.createElement("a-entity");
        e.setAttribute("position", {x:3+others*2, y:i, z:-10} );
        e.class = "other";
        e.setAttribute("id", v);
        e.setAttribute("blocktype", v);
        var t = document.createElement("a-text");
        t.setAttribute("position", "-1 0 0.51" );
        t.setAttribute("value", v );
        e.appendChild(t);
        var b4 = document.createElement("a-box");
        b4.setAttribute("color", aframeColor );
        b4.setAttribute("position", "-0.5 -0.2 0" );
        e.appendChild(b4);
	others++;
        return e;
      }
      
      var e = document.createElement("a-box")
      e.setAttribute("position", {x:0, y:i*1.1, z:-10} )
      e.setAttribute("material", "color:"+aframeColor )
      e.id = v;
      
      var txt = document.createElement("a-entity")
      txt.setAttribute("text","value:"+v+" ;color:"+aframeColor )
      txt.setAttribute("scale","10 10 10" )
      e.appendChild(txt)
      
      // we must go deeper
      //console.log(v)
      
      var props = Object.getOwnPropertyNames(AFRAME[v])
      if ((ignoreProps.indexOf(v)>-1)){
        console.log('ignoring',v)
      }
      
      if (!(ignoreProps.indexOf(v)>-1) && props){

        for (var prop in props){
          if (!(ignoreProps.indexOf(props[prop])>-1)){
            //console.log("    "+props[prop]);
            if (v == "components")  { c = addComponentBlock(i, props[prop]); }
            else if (v == "geometries")  { c = addEntityBlock(i, props[prop]); }
            else { c = addOtherBlock(i, props[prop]) }
            e.appendChild(c)
          }
        }
      }      
      
      sceneEl.appendChild(e)
    });
  }
});
    

AFRAME.registerComponent('snapping-zone', {
  init: function () {
    // on release block check if snappable, else eject
  }
});
    
var stack = [];
// managing only 1 for now
      
AFRAME.registerComponent('snappable', {
  init: function () {
    var el = this.el;
    var stackEl = document.querySelector("#stack");
    var resultEl = document.querySelector("#result");
    this.el.addEventListener('click', function (evt) {
      var classEl = el.getAttribute("class");
      if ((classEl == "entity") && (stack.length == 0 )){
        var modifiedEl = el.cloneNode(true);
        modifiedEl.setAttribute("position", "0 0 0");
        //modifiedEl.removeAttribute("snappable");
	// arguable
        stackEl.appendChild(modifiedEl);
        stack.push(modifiedEl);
	var blocktype = modifiedEl.getAttribute("blocktype");
        var frameworkEl = document.createElement("a-" + blocktype); 
        resultEl.appendChild(frameworkEl);
        
      }
      if ((classEl == "component") && (stack.length > 0 )){
        var modifiedEl = el.cloneNode(true);
        modifiedEl.setAttribute("position", "0 " + (stack.length * -1.5) + " 0");
        stackEl.appendChild(modifiedEl);
        stack.push(modifiedEl);
        
        //just as PoC example but should be based on blocktype
	var blocktype = modifiedEl.getAttribute("blocktype");
	var defaultvalue = "";
	if (blocktype == "color") defaultvalue = "red";
        resultEl.children[0].setAttribute(blocktype, defaultvalue)
      }
    });
  }
});
