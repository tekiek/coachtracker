/* http://keith-wood.name/signature.html
   Signature plugin for jQuery UI v1.1.0.
   Requires excanvas.js in IE.
   Written by Keith Wood (kbwood{at}iinet.com.au) April 2012.
   Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license. 
   Please attribute the author if you use it. */
(function($){var d={options:{background:'#ffffff',color:'#000000',thickness:2,guideline:false,guidelineColor:'#a0a0a0',guidelineOffset:50,guidelineIndent:10,notAvailable:'Your browser doesn\'t support signing',syncField:null,change:null},_create:function(){this.element.addClass(this.widgetFullName||this.widgetBaseClass);try{this.canvas=$('<canvas width="'+this.element.width()+'" height="'+this.element.height()+'">'+this.options.notAvailable+'</canvas>')[0];this.element.append(this.canvas);this.ctx=this.canvas.getContext('2d')}catch(e){$(this.canvas).remove();this.resize=true;this.canvas=document.createElement('canvas');this.canvas.setAttribute('width',this.element.width());this.canvas.setAttribute('height',this.element.height());this.canvas.innerHTML=this.options.notAvailable;this.element.append(this.canvas);if(G_vmlCanvasManager){G_vmlCanvasManager.initElement(this.canvas)}this.ctx=this.canvas.getContext('2d')}this._refresh(true);this._mouseInit()},_refresh:function(a){if(this.resize){var b=$(this.canvas);$('div',this.canvas).css({width:b.width(),height:b.height()})}this.ctx.fillStyle=this.options.background;this.ctx.strokeStyle=this.options.color;this.ctx.lineWidth=this.options.thickness;this.ctx.lineCap='round';this.ctx.lineJoin='round';this.clear(a)},clear:function(a){this.ctx.fillRect(0,0,this.element.width(),this.element.height());if(this.options.guideline){this.ctx.save();this.ctx.strokeStyle=this.options.guidelineColor;this.ctx.lineWidth=1;this.ctx.beginPath();this.ctx.moveTo(this.options.guidelineIndent,this.element.height()-this.options.guidelineOffset);this.ctx.lineTo(this.element.width()-this.options.guidelineIndent,this.element.height()-this.options.guidelineOffset);this.ctx.stroke();this.ctx.restore()}this.lines=[];if(!a){this._changed()}},_changed:function(a){if(this.options.syncField){$(this.options.syncField).val(this.toJSON())}this._trigger('change',a,{})},_setOptions:function(a){if(this._superApply){this._superApply(arguments)}else{$.Widget.prototype._setOptions.apply(this,arguments)}this._refresh()},_mouseCapture:function(a){return!this.options.disabled},_mouseStart:function(a){this.offset=this.element.offset();this.offset.left-=document.documentElement.scrollLeft||document.body.scrollLeft;this.offset.top-=document.documentElement.scrollTop||document.body.scrollTop;this.lastPoint=[this._round(a.clientX-this.offset.left),this._round(a.clientY-this.offset.top)];this.curLine=[this.lastPoint];this.lines.push(this.curLine)},_mouseDrag:function(a){var b=[this._round(a.clientX-this.offset.left),this._round(a.clientY-this.offset.top)];this.curLine.push(b);this.ctx.beginPath();this.ctx.moveTo(this.lastPoint[0],this.lastPoint[1]);this.ctx.lineTo(b[0],b[1]);this.ctx.stroke();this.lastPoint=b},_mouseStop:function(a){this.lastPoint=null;this.curLine=null;this._changed(a)},_round:function(a){return Math.round(a*100)/100},toJSON:function(){var b='{"lines":[';var c='';$.each(this.lines,function(){b+=c+'[';var a='';$.each(this,function(){b+=a+'['+this[0]+','+this[1]+']';a=','});b+=']';c=','});b+=']}';return b},draw:function(a){this.clear(true);if(typeof a=='string'){a=$.parseJSON(a)}this.lines=a.lines||[];var b=this.ctx;$.each(this.lines,function(){b.beginPath();$.each(this,function(i){b[i==0?'moveTo':'lineTo'](this[0],this[1])});b.stroke()});this._changed()},isEmpty:function(){return this.lines.length==0},_destroy:function(){this.element.removeClass(this.widgetFullName||this.widgetBaseClass);$(this.canvas).remove();this.canvas=this.ctx=this.lines=null;this._mouseDestroy()}};if(!$.Widget.prototype._destroy){$.extend(d,{destroy:function(){this._destroy();$.Widget.prototype.destroy.call(this)}})}if($.Widget.prototype._getCreateOptions===$.noop){$.extend(d,{_getCreateOptions:function(){return $.metadata&&$.metadata.get(this.element[0])[this.widgetName]}})}$.widget('kbw.signature',$.ui.mouse,d);$.kbw.signature.options=$.kbw.signature.prototype.options})(jQuery);