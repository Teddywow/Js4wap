/*
*   js4wap.js
*	edited by lizijie
*/
(function(window){
	var Js4wap=(function(){
		var Js4wap=function(selector){
			return new Js4wap.prototype.init(selector);
		}
		var emptyArray = [];
		Js4wap.prototype={
			constructor:Js4wap,
			length: 0,
			forEach: emptyArray.forEach,
		    reduce: emptyArray.reduce,
		    push: emptyArray.push,
		    sort: emptyArray.sort,
		    splice: emptyArray.splice,
		    indexOf: emptyArray.indexOf,
			init:function(selector){
				var that=this;
				if(!selector) return this;
				if(typeof selector === "string"){
					this.makeArray(that.qsa(document,selector));
				}else{
					return this.push(selector);
				}
			},
			camelize:function(str){ 
				return str.replace(/-+(.)?/g, function(match, chr){ 
					return chr ? chr.toUpperCase() : '' }) 
			},
			qsa:function(element,selector){
				var found,
					simpleSelectorRE = /^[\w-]*$/,
			        maybeID = selector[0] == '#',
			        maybeClass = !maybeID && selector[0] == '.',
			        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
			        isSimple = simpleSelectorRE.test(nameOnly);
			    return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
			      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
			      (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
			      (
			        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
			          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
			          element.getElementsByTagName(selector) : // Or a tag
			          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
			      )
			},
			makeArray:function(elems){
				for(var i=0,len=elems.length;i<len;i++){
					this.push(elems[i]);
				}
				return this;
			},
			hasClass:function(o,className){
				return o.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))===null?false:true;
			},
			addClass:function(className){
				var that=this;
				if(!className) return this;
			    this.each(function(){
			    	var oClassName=this.className;
			    	if(!that.hasClass(this,className)) {
				    	oClassName += " "+className;
				    	this.className=oClassName.trim();
				    }
			    });
			    return this;
			},
			removeClass:function(className){
				var that=this;
				if(!className) return this;
			    this.each(function(){
			    	var oClassName=this.className;
			    	if(that.hasClass(this,className)) {
				    	this.className=oClassName.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),' ').trim();
				    }
			    });
			    return this;
			},
			find:function(selector){
				var result=$();
				this.each(function(){
					var elems=this.querySelectorAll(selector),
						len=elems.length;
					for(var i=0;i<len;i++){
						result.push(elems[i]);
					}
				});
				return result;
			},
			parent:function(){
				var parent=$();
				this.each(function(){
					var pNode=this.parentNode;
					if(parent.indexOf(pNode)<0){
						parent.push(pNode);
					}
				});
				return parent;
			},
			children:function(){
				var children=$();
				this.each(function(){
					var cNode=this.children,
						len=cNode.length;
					for(var i=0;i<len;i++){
						children.push(cNode[i]);
					}
				});
				return children;
			},
			prev:function(){
				var prev=$();
				this.each(function(){
					var pvNode=this.previousElementSibling;
					if(pvNode!==null){
						prev.push(pvNode);
					}
				});
				return prev;
			},
			next:function(){
				var next=$();
				this.each(function(){
					var nNode=this.nextElementSibling;
					if(nNode!==null){
						next.push(nNode);
					}
				});
				return next;
			},
			each:function(fn){
				for (var i = 0,len=this.length;i < len; i++) {
			        fn.apply(this[i],[i,this[i]]);
			    }
			},
			html:function(thtml){
				var htmlStr=[];
				if(thtml){
					this.each(function(){
						this.innerHTML=thtml;
					});
					return this;
				}else{
					this.each(function(){
						htmlStr.push(this.innerHTML);
					});
					return htmlStr;
				}	
			},
			offset:function(){
				var offset=this[0].getBoundingClientRect();
				return {
					width:offset.width,
					height:offset.height,
					top:offset.top+window.pageXOffset,
					left:offset.left+window.pageYOffset
				}
			},
			width:function(){
				return this.offset().width;
			},
			height:function(){
				return this.offset().height;
			},
			top:function(){
				return this.offset().top;
			},
			left:function(){
				return this.offset().left;
			},
			css:function(property,value){
				var element=this[0],
					property=this.camelize(property);
				if(arguments.length<2){
					return element.style[property] || getComputedStyle(element)[property];
				}else{
					this.each(function(){
						this.style[property]=value;
					})
					return this;
				}
			},
			on:function(event,fn,type){
				this.each(function(){
					this.addEventListener(event,fn,type);
				})
				return this;
			},
			off:function(event,fn,type){
				this.each(function(){
					this.removeEventListener(event,fn,type);
				})
				return this;
			},
			swipeLeft:function(fn,data){
				this.each(function(){
					var startX,touchX;
					this.addEventListener('touchstart',function(e){
						e.preventDefault();
						startX=e.targetTouches[0].pageX;
					},false);
					this.addEventListener('touchmove',function(e){
						e.preventDefault();
						touchX=e.targetTouches[0].pageX
					},false);
					this.addEventListener('touchend',function(e){
						if(touchX-startX<-30){
							fn.call(this,data)
						}
					})
				})
				return this;
			},
			swipeRight:function(fn,data){
				this.each(function(){
					var startX,touchX;
					this.addEventListener('touchstart',function(e){
						e.preventDefault();
						startX=e.targetTouches[0].pageX;
					},false);
					this.addEventListener('touchmove',function(e){
						e.preventDefault();
						touchX=e.targetTouches[0].pageX
					},false);
					this.addEventListener('touchend',function(e){
						if(touchX-startX>30){
							fn.call(this,data)
						}
					})
				})
				return this;
			},
			swipeUp:function(fn,data){
				this.each(function(){
					var startY,touchY;
					this.addEventListener('touchstart',function(e){
						e.preventDefault();
						startY=e.targetTouches[0].pageY;
					},false);
					this.addEventListener('touchmove',function(e){
						e.preventDefault();
						touchY=e.targetTouches[0].pageY
					},false);
					this.addEventListener('touchend',function(e){
						if(touchY-startY<-30){
							fn.call(this,data)
						}
					})
				})
				return this;
			},
			swipeDown:function(fn,data){
				this.each(function(){
					var startY,touchY;
					this.addEventListener('touchstart',function(e){
						e.preventDefault();
						startY=e.targetTouches[0].pageY;
					},false);
					this.addEventListener('touchmove',function(e){
						e.preventDefault();
						touchY=e.targetTouches[0].pageY
					},false);
					this.addEventListener('touchend',function(e){
						if(touchY-startY>30){
							fn.call(this,data)
						}
					})
				})
				return this;
			}
		}
		Js4wap.prototype.init.prototype=Js4wap.prototype;
		return Js4wap;
	})();
	window.Js4wap=Js4wap;
	window.$===undefined&&(window.$=Js4wap);
})(window)