/*********************************************************************************
 Copyright 2009-2011 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/

/**
 * @author Jai.Chandramouli
 */
/**
 * Function to convert xml string to an xml document object
 * @param {Object} s
 */
function stringToDoc(s){
    var doc;
    if (window.ActiveXObject) {
        doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        doc.loadXML(s);
    }
    else 
        doc = (new DOMParser()).parseFromString(s, 'text/xml');
    return (doc && doc.documentElement &&
    doc.documentElement.tagName !=
    'parsererror') ? doc : null;
}

/**
 * Converts a string into object.
 * @param {String} s String to convert to object.
 * @param {Boolean} coerce If true, converts numbers, true/false and undefined values to
 * their true data types. Default is false
 *
 * Parts of code taken from remy sharp's blog and Jquery BBQ plugin.
 * http://remysharp.com/2008/06/24/query-string-to-object-via-regex/
 * http://benalman.com/projects/jquery-bbq-plugin/
 */
function deparam(s, coerce){
    var query = {};
    coerce_types = {
        'true': !0,
        'false': !1,
        'null': null
    };
    s.replace(/\b([^&=]*)=([^&=]*)\b/g, function(m, a, d){
        if (coerce) {
            d = d && !isNaN(d) ? +d // number
 : d === 'undefined' ? undefined // undefined
 : coerce_types[d] !== undefined ? coerce_types[d] // true, false, null
 : d; // string
        }
        
        if (typeof query[a] != 'undefined') {
            query[a] += ',' + d;
        }
        else {
            query[a] = d;
        }
    });
    
    return query;
}

/**
 * Function to truncate a string after a given number of characters
 * @param {String} str The string to truncate.
 * @param {Number} len The number of characters after which to attach the truncation indicator.
 * @param {Boolean} truncateWord Flag to check if the string needs to be truncated by words or not.
 */
function truncateText(str, len, truncateWord){
    var TRUNCATION_INDICATOR = "...";
    var originalText = str;
    
    if (originalText.length > len) {
    
        /* Truncate the content of the P, then go back to the end of the
         previous word to ensure that we don't truncate in the middle of
         a word */
        originalText = originalText.substring(0, len);
        if (typeof(truncateWord) != 'undefined' && truncateWord == true) {
            originalText = originalText.replace(/\w+$/, '');
        }
        
        /* Add an ellipses to the end */
        originalText += TRUNCATION_INDICATOR;
    }
    return originalText;
}

/**
 *
 *  URL encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Url = {

    // public method for url encoding
    encode: function(string){
        if (typeof string == 'undefined') {
            return '';
        }
        return escape(this._utf8_encode(string));
    },
    
    // public method for url decoding
	/**
	 * Decodes an UrlEncoded string. Optionally, you can convert '&' to '&amp' by setting the 
	 * <code>convertAmpersand</code> value to <code>true</code>
	 * @param {String} string
	 * @param {Boolean} convertAmpersand default <code>true</code>
	 * @param {Boolean} convertHTMLTags default <code>true</code>
	 */
    decode: function(string, doConvertHTML){
        if (typeof string == 'undefined') {
            return '';
        }
		if(typeof doConvertHTML == 'undefined') {
			doConvertHTML = true;
		}
		
//		var val = '';
		var val = this._utf8_decode(unescape(string));
		
		if(doConvertHTML) {
			val = escapeHTML(val);
		}
        return val;
    },
    
    // private method for UTF-8 encoding
    _utf8_encode: function(string){
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        
        for (var n = 0; n < string.length; n++) {
        
            var c = string.charCodeAt(n);
            
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else 
                if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            
        }
        
        return utftext;
    },
    
    // private method for UTF-8 decoding
    _utf8_decode: function(utftext){
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        
        while (i < utftext.length) {
        
            c = utftext.charCodeAt(i);
            
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else 
                if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            
        }
        
        return string;
    }
}

/**
 * Deletes all cookies for this domain
 */
function deleteAllCookies(){
    var cookies = document.cookie.split(";");
    
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
/**
 * Returns the cookie value
 * @param {Object} name
 */
function getCookie(name){
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        if (eqPos > -1) {
            var data = cookie.split("=");
            if (name == $.trim(data[0])) {
                return data[1];
            }
        }
    }
    return null;
}
/**
 * Sets a cookie 
 * @param {Object} name
 * @param {Object} value
 */
function setCookie(name, value){
    var ttl = 7200;

    var date = new Date();
    date.setTime(date.getTime() + (ttl * 60 * 1000));
    
    var expires = "expires=" + date.toGMTString();
    
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}
/**
 * Removes the specified cookie
 * @param {Object} name
 */
function removeCookie(name){
    var expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = name + "=;" + expires + "; path=/";
}
/**
 * @class Allows tracking of the time difference
 * @author jai.chandramouli
 */
var TimeDiff = {
    setStartTime: function(){
        d = new Date();
        time = d.getTime();
    },
    
    getDiff: function(){
        d = new Date();
        return (d.getTime() - time);
    }
}
/**
 * Returns the X position of an element
 * @param {Object} obj
 */
function findPosX(obj){
    var curleft = 0;
    if (obj.offsetParent) 
        while (1) {
            curleft += obj.offsetLeft;
            if (!obj.offsetParent) 
                break;
            obj = obj.offsetParent;
        }
    else 
        if (obj.x) 
            curleft += obj.x;
    return curleft;
}
/**
 * Returns the Y position of an element
 * @param {Object} obj
 */
function findPosY(obj){
    var curtop = 0;
    if (obj.offsetParent) 
        while (1) {
            curtop += obj.offsetTop;
            if (!obj.offsetParent) 
                break;
            obj = obj.offsetParent;
        }
    else 
        if (obj.y) 
            curtop += obj.y;
    return curtop;
}
/**
 * Unwraps the jquery object by removing the specified tag
 */
$.fn.unwrap = function(){
    this.parent(':not(body)').each(function(){
        $(this).replaceWith(this.childNodes);
    });
    return this;
};

/**
 * @class StylesheetFormatter toggles the CSS properties to support RTL layouts
 * @author jai.chandramouli
 */
StylesheetFormatter = {
	targetWin:this,
    styleSheet: 0,
    sheets: (document.styleSheets) ? document.styleSheets : undefined,
	
	getSheets:function() {
		var win = StylesheetFormatter.targetWin;
		return (win.document.styleSheets) ? win.document.styleSheets : undefined
	},
    /**
     * Returns the cssRules object for the given filename or index
     * @param {Object} val
     */
    getCssRules: function(val){
        if (val == 'undefined') 
            return this;
        if (this.getSheets() == 'undefined') 
            return undefined;
        
        if (typeof val == 'number') {
            this.styleSheet = val;
            if (val > this.getSheets().length) 
                return;
            
            if (jQuery.browser.msie) {
                return this.getSheets()[val].rules;
            }
            else {
                return this.getSheets()[val].cssRules;
            }
        }
        var regex = new RegExp(val);

        var noOfStyleSheets = this.getSheets().length;
        for(var i = 0; i < noOfStyleSheets; i++) {
            if (regex.test(this.getSheets()[i].href)) {
                this.styleSheet = i;
                if (jQuery.browser.msie) {
                    return this.getSheets()[i].rules;
                }
                else {
                    return this.getSheets()[i].cssRules;
                }
            }
        }
    },
    /**
     * Returns the contents of the given filename or index
     * @param {Object} val
     */
    getContents: function(val){
    
        if (val == 'undefined') 
            return this;
        if (this.getSheets() == 'undefined') 
            return undefined;
        
        if (typeof val == 'number') {
            this.styleSheet = val;
            if (val > this.getSheets().length) 
                return;
            
            if (typeof this.getSheets()[val].cssText != 'undefined') {
                return this.getSheets()[val].cssText;
            }
        }
        var regex = new RegExp(val);
        for (i in this.getSheets()) {
            if (regex.test(this.getSheets()[i].href)) {
                this.styleSheet = i;
                if (typeof this.getSheets()[i].cssText != 'undefined') {
                    return this.getSheets()[i].cssText;
                }
            }
        }
    },
	/**
	 * Returns the stylesheet object for the given name or index
	 * @param {Object} val File name or index of the stylesheet
	 */
	getStylesheet: function(val){
        if (val == 'undefined') 
            return this;
        if (this.getSheets() == 'undefined') 
            return undefined;
        
        if (typeof val == 'number') {
            this.styleSheet = val;
            if (val > this.getSheets().length) 
                return;
            
            if (typeof this.getSheets()[val] != 'undefined') {
                return this.getSheets()[val];
            }
        }
        var regex = new RegExp(val);
        for (i in this.getSheets()) {
            if (regex.test(this.getSheets()[i].href)) {
                this.styleSheet = i;
                if (typeof this.getSheets()[i] != 'undefined') {
                    return this.getSheets()[i];
                }
            }
        }
    },
    /**
     * Toggles the styles of a given stylesheet file or id 
     * @param {Object} file Filename or index of the stylesheet
     */
    toggle: function(file){
    	
        var exceptions = ['prefwindow', 'errorwindow', '.browsebutton div', '.browsebutton div div', '.htmlbutton', 
		'.menu', '.menu div', '.menusmall div', '.items li a', 
		'.defaultbuttonsmall', '.defaultbuttonsmall div', '.defaultbuttonsmall div div', 
		'.defaultbutton', '.defaultbutton div', '.defaultbutton div div'];
        
		// for IE
		if (jQuery.browser.msie) {
			var stylesheet = this.getStylesheet(file);
			if (!stylesheet) 
				return this;
				
			var set1 = stylesheet.cssText.split('}');
			
			for( var k=0; k<set1.length; k++ ) {
				
				var t = trim(set1[k]);
				if(t == '') 
				continue;
				
				var set2 = t.split('{');
				var selector = trim(set2[0]);
				if ($.inArray(selector.toLowerCase(), exceptions) > -1) 
                continue;
				
				var props = trim(set2[1]);
				
				if(props.length == 0)
				continue;
				
				var newCssStr = this.toggleStyle(props);
				set2[1] = newCssStr;
				
				set1[k] = set2.join('{\n');
			}
			
			stylesheet.cssText = set1.join('}\n');
			
			return;
		}
        
		// for Mozilla browsers
		
        var css = this.getCssRules(file);
		if(!css)
		return this;
		
        var clen = css.length;
        for (var i = 0; i < clen; i++) {
        	
			if(!css[i].style)
			continue;
			
            var style = css[i].style;
            var selector = css[i].selectorText;
            
            if ($.inArray(selector.toLowerCase(), exceptions) > -1) 
                continue;
            
			
			var cssStr = css[i].style.cssText;
			
			var newCssStr = this.toggleStyle(cssStr);
			
			if(jQuery.browser.safari) {
				newCssStr = newCssStr.replace(/:\s/g, ':')
			}
			
            css[i].style.cssText = newCssStr;
        }
    },
	
	/**
	 * Toggles the style properties for a given style
	 * @param {Object} str
	 */
	toggleStyle: function(str) {
		var csss = str.split(';');
        var propStr = '';
        var len = csss.length;
        for (var j = 0; j < len; j++) {
        
            if (trim(csss[j]).length == 0) 
                continue;
            
            var s = trim(csss[j]).split(/\s*:\s*/);
            
			switch(trim(s[0]).toLowerCase()) {
				
				case 'float':
					if (trim(s[1]).toLowerCase() == 'left') {
	                    s[1] = 'right';
	                }
	                else if (trim(s[1]).toLowerCase() == 'right') {
	                    s[1] = 'left';
	                }
					break;
				case 'margin':
					var t = trim(s[1]).split(/\s+/);
	                if (t.length == 4) {
	                    var r = t[1];
	                    var l = t[3];
	                    t[1] = l;
	                    t[3] = r;
	                }
	                s[1] = t.join(' ');
					break;
				case 'margin-left':
					s[0] = 'margin-right';
					break;
				case 'margin-right':
					s[0] = 'margin-left';
					break;
				case 'padding':
					var t = trim(s[1]).split(/\s+/);
	                if (t.length == 4) {
	                    var r = t[1];
	                    var l = t[3];
	                    t[1] = l;
	                    t[3] = r;
	                }
	                s[1] = t.join(' ');
					break;
				case 'padding-left':
					s[0] = 'padding-right';
					break;
				case 'padding-right':
					s[0] = 'padding-left';
					break;
				case 'text-align':
					if (trim(s[1]).toLowerCase() == 'left') {
	                    s[1] = 'right';
	                }
	                else if (trim(s[1]).toLowerCase() == 'right') {
	                    s[1] = 'left';
	                }
					break;
				case 'left':
					s[0] = 'right';
					break;
				case 'right':
					s[0] = 'left';
					break;
				
				/**
				 * border-left
				 */
				case 'border-left':
					s[0] = 'border-right';
					break;
				/**
				 * border-right
				 */
				case 'border-right':
					s[0] = 'border-left';
					break;
					
				/****************************************
				 * SAFARI SPECIFIC STYLES
				 ****************************************/
				/**
				 * border-left-width
				 */
				case 'border-left-width':
					s[0] = 'border-right-width';
					break;
				/**
				 * border-right-width
				 */
				case 'border-right-width':
					s[0] = 'border-left-width';
					break;
					
				/**
				 * border-left-style
				 */
				case 'border-left-style':
					s[0] = 'border-right-style';
					break;
				/**
				 * border-right-style
				 */
				case 'border-right-style':
					s[0] = 'border-left-style';
					break;
					
				/**
				 * border-left-color
				 */
				case 'border-left-color':
					s[0] = 'border-right-color';
					break;
				/**
				 * border-right-color
				 */
				case 'border-right-color':
					s[0] = 'border-left-color';
					break;
					
				/***************************************/
				
				default:
					break;
			}
			
            propStr += s.join(': ') + ';\n';
        }
		
		return propStr;
	}
};
/**
 * Camelize string
 * @param {String} val
 */
function camelize(val){
    return val.replace(/-(.)/g, function(m, l){
        return l.toUpperCase()
    });
};
/**
 * Trims whitespace
 * @param {String} val
 */
function trim(val){
    var val = val.replace(/^\s+/, '');
    return val.replace(/\s+$/, '');
};

/**
 * Converts ampersand and all HTML tags to character codes
 * @param {String} val
 */
function escapeHTML(val) {
	if(val == null || typeof val == 'undefined') {
		return null;
	}
	var val = val.replace(/&(?!amp;)/g, '&amp;');
	val = val.replace(/</, '&lt;');
	return val.replace(/>/, '&gt;');
}

/**
 * Redraws the given object
 */
function redrawObject(obj) {
	if(obj) {
		$(obj).css('display', 'none'); 
		$(obj).css('display', 'block');
	}
}

function getNumber(val) {
    if(val == undefined) {
        return 0;
    }
    return parseInt(val);
}

var FontResizeDetector = {
	
	checkDiv: '<div id="checkdiv" style="left:1%;line-height:1;font-family:monospace;width:0px;position:absolute;">&nbsp;</div>',
	
	stop:false,
	
	initialize: function() {
		$("body").prepend(FontResizeDetector.checkDiv);
		FontResizeDetector.fontCheck(FontResizeDetector.receivechange);
	},
	
	fontCheck: function(resultHandler) {
        var checkdiv = document.getElementById("checkdiv");
        var height = checkdiv.offsetHeight;
		var width = checkdiv.offsetWidth;
		var left = checkdiv.offsetLeft;
		var right = checkdiv.offsetRight;
        
        repeat();
        function repeat(){
			// for some reason, offsetHeight doesn't change in FF (except my browser).
			// added a check for 'offsetLeft', which is working on other FF browsers I tested in (but not in mine)
			// a strange case, therefore decided to keep both checks  
			//
			if (checkdiv.offsetHeight != height || checkdiv.offsetLeft != left 
			|| checkdiv.offsetWidth != width) {
//				alert(checkdiv.offsetLeft +":"+left)
                height = checkdiv.offsetHeight;
				width = checkdiv.offsetWidth;
				left = checkdiv.offsetLeft;
				right = checkdiv.offsetRight;
                resultHandler();
            }
            if (!FontResizeDetector.stop) 
                setTimeout(repeat, 500);
        }
	},
	
	receivechange: function() {
		window.location.reload();
	}

}
