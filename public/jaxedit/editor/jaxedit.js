
/* JaxEdit: online LaTeX editor with live preview
* Copyright (c) 2011-2013 JaxEdit project
* License: GNU General Public License, Version 3
*
* Website: http://jaxedit.com
* Source:  https://github.com/zohooo/jaxedit
* Release: http://code.google.com/p/jaxedit/
*/

// window.jsquick;

function initJaxEdit() {
	window.jaxedit = (function(){
		var gatepath = "",
		mathname = "MathJax.js?config=TeX-AMS_HTML",
		mathpath = "",
		shareurl = "";

		return {
			autoScroll: false,
			dialogMode: null,
			fileid: 0,
			fileName: "noname.tex",
			hasEditor: false,
			hasParser: false,
			localDrive: false,
			trustHost: false,
			useDrive: null,
			version: "0.28",
			view: "write",
			wcode: null,

			options: {
				debug: false,
				highlight: false,
				localjs: false
			},

			childs: {
				html : document.documentElement,
				body : document.body,
				wrap : document.getElementById("wrap"),
				head : document.getElementById("head"),
				example : document.getElementById("example"),
				newbtn : document.getElementById("newbtn"),
				openbtn : document.getElementById("openbtn"),
				savebtn : document.getElementById("savebtn"),
				presbtn : document.getElementById("presbtn"),
				loginbtn : document.getElementById("loginbtn"),
				drivesel: document.getElementById("drivesel"),
				main : document.getElementById("main"),
				ltop : document.getElementById("ltop"),
				source : document.getElementById("source"),
				codearea : codeAreaObject,
				lbot : document.getElementById("lbot"),
				resizer : document.getElementById("resizer"),
				right : document.getElementById("right"),
				rtop : document.getElementById("rtop"),
				preview : document.getElementById("preview"),
				showarea : document.getElementById("showarea"),
			},

			scrollers: {
				codelength : 0,
				codechange : 0,
				codescroll : 0,
				showscroll : 0,
				showheight : 1,
				divheights : []
			},

			textdata: {
				oldtextvalue : "", oldtextsize : 0, oldselstart : 0, oldselend : 0, oldseltext : "",
				newtextvalue : "", newtextsize : 0, newselstart : 0, newselend : 0, newseltext : ""
			},

			getOptions: function() {
				var options = this.options, browser = window.jsquick.browser;

				if (browser.chrome || browser.firefox >= 3 || browser.msie >=8 || browser.safari >= 5.2 || browser.opera >= 9) {
					if (!window.jsquick.touch) {
						options.highlight = true;
					}
				}

				options.localjs = (location.protocol == "file:" || location.protocol == "https:");

				var qs = location.search.length > 0 ? location.search.substring(1) : "";
				var items = qs.split("&"), pair, name, value;

				for (var i=0; i<items.length; i++) {
					pair = items[i].split("=");
					if (pair.length == 1) {
						var id = parseInt(pair[0]);
						if (isFinite(id)) this.fileid = id;
						continue;
					}
					name = decodeURIComponent(pair[0]);
					value = pair[1] ? decodeURIComponent(pair[1]) : "";
					switch (typeof options[name]) {
						case "boolean":
						if (value == "true" || value == "1") {
							options[name] = true;
						} else if (value == "false" || value == "0") {
							options[name] = false;
						}
						break;
						case "number":
						value = parseFloat(value);
						if (!isNaN(value)) {
							options[name] = value;
						}
						break;
						case "string":
						options[name] = value;
						break;
					}
				}

				mathpath = options.localjs ? "library/mathjax/unpacked/" : "http://cdn.mathjax.org/mathjax/2.1-latest/";
				if (location.pathname.slice(0, 6) == "/note/") {
					gatepath = "/gate/"; shareurl = "/note/";
				} else {
					gatepath = "/door/"; shareurl = "/beta/";
				}
				if (/jaxedit/.test(location.hostname)) this.trustHost = true;
			},

			doResize: function(clientX) {
				var that = this;
				var childs = that.childs,
				html = childs.html,
				body = childs.body,
				head = childs.head,
				main = childs.main,
				ltop = childs.ltop,
				source = childs.source,
				codearea = childs.codearea,
				lbot = childs.lbot,
				resizer = childs.resizer,
				right = childs.right,
				rtop = childs.rtop,
				preview = childs.preview,
				showarea = childs.showarea;
				var wsizes = [], hsizes = [];

				var pageWidth = window.innerWidth;
				var pageHeight = window.innerHeight;
				if (typeof pageWidth != "number" ){
					if (document.compatMode == "CSS1Compat"){
						pageWidth = document.documentElement.clientWidth;
						pageHeight = document.documentElement.clientHeight;
					} else {
						pageWidth = document.body.clientWidth;
						pageHeight = document.body.clientHeight;
					}
				}

				var headHeight = 42, topHeight = 26, botHeight = 24, halfBorder = 4;
				var mainWidth = pageWidth, mainHeight = pageHeight - headHeight,
				halfHeight = mainHeight - halfBorder, wrapHeight = halfHeight - topHeight - botHeight;
				var lHalfWidth, lWrapWidth, rHalfWidth, rWrapWidth, lWrapHeight, rWrapHeight;

				switch (this.view) {
					case "read":
					resizeFull();
					return;
					case "write":
					resizeHalf();
					return;
					case "tiny":
					resizeQuad();
					return;
				}

				function resizeFull() {
					wsizes.push([html, pageWidth]);
					wsizes.push([body, 802]);
					wsizes.push([head, 798]);
					wsizes.push([main, 802]); hsizes.push([main, mainHeight]);
					wsizes.push([right, 798]); hsizes.push([right, halfHeight]);
					wsizes.push([preview, 794]); hsizes.push([preview, halfHeight - 8]);
					wsizes.push([showarea, 694]); hsizes.push([showarea, halfHeight - 108]);
					that.resizeElements(wsizes, hsizes);

					body.style.height = "100%";
					showarea.style.padding = "50px";
					body.style.margin = "auto";
					body.style.backgroundColor = "gray";
					right.style.backgroundColor = "white";
				}

				function resizeHalf() {
					if (typeof clientX == "number") {
						lHalfWidth = lWrapWidth = clientX - halfBorder,
						rHalfWidth = rWrapWidth = pageWidth - clientX - halfBorder;
					} else {
						lHalfWidth = lWrapWidth = Math.ceil(pageWidth / 2) - halfBorder,
						rHalfWidth = rWrapWidth = Math.floor(pageWidth / 2) - halfBorder;
					}
					
					if (rHalfWidth < 0) {
						right.style.display = "none"; lHalfWidth = pageWidth - halfBorder - 2;
					} else {
						right.style.display = "block";
					}
					lWrapHeight = rWrapHeight = wrapHeight;

					
					wsizes.push([right, rHalfWidth]); hsizes.push([right, halfHeight]);

					right.style.top = 0 + "px";

					hsizes.push([resizer, halfHeight + 4]);
					

					adjustSize();
					that.resizeElements(wsizes, hsizes);
				}

				function resizeQuad() {
					lWrapWidth = pageWidth - halfBorder; rWrapWidth = pageWidth * 0.382;
					lWrapHeight = wrapHeight; rWrapHeight = wrapHeight * 0.382;

					
					wsizes.push([right, rWrapWidth]); hsizes.push([right, rWrapHeight]);

					right.style.top = (topHeight + halfBorder / 2) + "px";

					adjustSize();
					that.resizeElements(wsizes, hsizes);
				}

				function adjustSize() {
					wsizes.push([html, pageWidth]);
					wsizes.push([body, pageWidth]);
					wsizes.push([head, pageWidth - 4]);
					wsizes.push([main, mainWidth]); hsizes.push([main, mainHeight]);

					wsizes.push([source, lWrapWidth - 2]); hsizes.push([source, lWrapHeight]);
					if (that.options.highlight && that.editor) {
						wsizes.push([that.editor.getWrapperElement(), lWrapWidth - 8]);
						hsizes.push([that.editor.getWrapperElement(), lWrapHeight - 10]);
					} else {
						wsizes.push([codearea, lWrapWidth - 8]);
						hsizes.push([codearea, lWrapHeight - 10]);
					}

					wsizes.push([preview, rWrapWidth - 6]); hsizes.push([preview, rWrapHeight - 8]);
					wsizes.push([showarea, rWrapWidth - 6]); hsizes.push([showarea, rWrapHeight - 10]);

					wsizes.push([ltop, lWrapWidth - 6]); wsizes.push([lbot, lWrapWidth - 6]);
				}
			},

			resizeElements: function(wsizes, hsizes) {
				for (var i = 0; i < wsizes.length; i++) {
					wsizes[i][0].style.width = wsizes[i][1] + "px";
				};
				for (i = 0; i < hsizes.length; i++) {
					hsizes[i][0].style.height = hsizes[i][1] + "px";
				};
			},

			loadEditor: function() {
				var that = this;
				
				window.jsquick.loadScript("jaxedit/editor/textarea/simple.js", function(){
					that.addEditor();
					that.hasEditor = true;
					that.initialize();
				});
				// that.initialize();
			},

			loadParser: function() {
				var that = this;
				var script = document.createElement("script");
				script.type = "text/x-mathjax-config";
				script[(window.opera ? "innerHTML" : "text")] =
				"MathJax.Hub.Config({\n" +
					"  skipStartupTypeset: true,\n" +
					"  TeX: { extensions: ['color.js', 'extpfeil.js'] },\n" +
					"  'HTML-CSS': { imageFont: null }\n" +
					"});";

				// Append object
				document.body.appendChild(script);

				window.jsquick.loadStyles("jaxedit/typejax/typejax.css");
				window.jsquick.loadScript("jaxedit/typejax/typejax.js", function(){
					window.jsquick.loadScript(mathpath + mathname, function(){
						MathJax.Hub.processUpdateTime = 200;
						MathJax.Hub.processUpdateDelay = 15;
						that.hasParser = true;
						that.initialize();
						that.autoScroll = true;
					});
				});
			},

			initialize: function() {
				if (this.hasEditor && this.hasParser) {
					this.initEditor();
				}
			},

			initEditor: function(value) {
				var childs = this.childs,
				codearea = childs.codearea,
				lbot = childs.lbot,
				showarea = childs.showarea;
				var editor = this.editor,
				scrollers = this.scrollers,
				data = this.textdata;
				var highlight = this.options.highlight;

				if (!highlight && window.jsquick.browser.msie) codearea.setActive();

				if (typeof value == "string") {
					editor.setValue(value);
				}
				data.newtextvalue = editor.getValue();
				data.newtextsize = data.newtextvalue.length;
				if (!highlight) {
					data.newselstart = codearea.selectionStart;
					data.newselend = codearea.selectionEnd;
				}

			//lbot.innerHTML = "size: " + data.newtextsize + "; textarea: initialized";
			scrollers.codelength = data.newtextsize;
			scrollers.codechange = 0;
			scrollers.codescroll = 0;
			scrollers.showscroll = 0;
			scrollers.showheight = 1;
			scrollers.divheights = [];

			editor.setReadOnly(true);
			typejax.updater.init(data.newtextvalue, data.newtextsize, showarea);
			this.addHandler();
			editor.setReadOnly(false);
		},

		doLoad: function() {
			var codearea = this.childs.codearea,
			showarea = this.childs.showarea;

			this.getOptions();

			this.autoScroll = false;

			//codearea.value = "test";
			/*if (window.localStorage && this.fileid <= 0) {
				if (localStorage.getItem("texcode")) {
					codearea.value = localStorage.getItem("texcode");
				}
				if (localStorage.getItem("scroll")) {
					codearea.scrollTop = parseInt(localStorage.getItem("scroll"));
				}
			}*/

			showarea.innerHTML = "<div id='parser-loading'><i class='gif-loading'></i>Loading TypeJax and MathJax...</div>";
			
			this.loadEditor();
			this.loadParser();
		},

		showWindow: function(enableShare) {
			this.doResize();
			this.childs.wrap.style.visibility = "visible";
			if (this.view == "write") {
				if (location.protocol != "file:") {
					this.bindExample();
				}
				this.addResizer();
				if (this.trustHost) enableShare();
			}
			this.bindPresent();
		},

		addResizer: function() {
			var resizer = this.childs.resizer, main = this.childs.main;
			var that = this;

			resizer.onmousedown = function(event) {
				that.forResize = true;
				var ev = event ? event : window.event;
				if (ev.preventDefault) {
					ev.preventDefault();
				} else {
					ev.returnValue = false;
				}
			};

			main.onmousemove = function(event) {
				if (that.forResize) {
					var ev = event ? event : window.event;
					//resizer.style.left = (ev.clientX - 2) + "px";
				}
			};

			resizer.onmouseup = function(event) {
				if (that.forResize) {
					var ev = event ? event : window.event;
					that.doResize(ev.clientX);
				}
				that.forResize = false;
			};
		},

		doScroll: function(isForward) {
			if (!this.autoScroll) return;
			var scrollers = this.scrollers, divheights = scrollers.divheights;
			if (!divheights.length) return;
			var codelength = scrollers.codelength,
			codescroll = scrollers.codescroll,
			codechange = scrollers.codechange,
			showscoll = scrollers.showscroll,
			showheight = scrollers.showheight;
			var editor = this.editor, editinfo = editor.getScrollInfo(),
			leftpos = editinfo.top,
			leftscroll = editinfo.height,
			leftclient = editinfo.clientHeight,
			leftsize = leftscroll - leftclient;
			var showarea = this.childs.showarea,
			rightpos = showarea.scrollTop,
			rightscroll = showarea.scrollHeight,
			rightclient = showarea.clientHeight,
			rightsize = rightscroll - rightclient;

			var length, newpos, thatpos, thatarea;

			function getLeftIndex() {
				var length;
				/* length = codelength * (leftpos / leftsize); */
				if (leftpos <= codescroll) {
					length = (codescroll <= 0) ? 0 : codechange * leftpos / codescroll;
				} else {
					length = (codescroll >= leftsize) ? codelength : codechange + (codelength - codechange) * (leftpos - codescroll) / (leftsize - codescroll)
				}
				return length;
			}

			function getLeftScroll(length) {
				var newpos;
				/* newpos = leftsize * length / codelength; */
				if (length <= codechange) {
					newpos = (codechange <= 0) ? 0 : codescroll * length / codechange;
				} else {
					newpos = (codechange >= codelength) ? leftsize : codescroll + (leftsize - codescroll) * (length - codechange) / (codelength - codechange);
				}
				return newpos;
			}

			function getRightIndex() {
				var length, data, i;
				var height = showheight * rightpos / rightsize;
				for (i = 1; i < divheights.length; i++) {
					data = divheights[i];
					if (height > data[2]) {
						height -= data[2];
					} else {
						if (data[2] > 0) {
							length = data[0] + (data[1] - data[0]) * height / data[2];
						} else {
							length = data[0];
						}
						break;
					}
				}
				return length;
			}

			function getRightScroll(length) {
				var height = 0, data, i;
				for (i = 0; i < divheights.length; i++) {
					data = divheights[i];
					if (length > data[1]) {
						height += data[2];
					} else {
						height += data[2] * (length - data[0]) / (data[1] - data[0]);
						break;
					}
				}
				var newpos = rightsize * (height / showheight);
				return newpos;
			}

			// leftpos <--> length <--> height <--> rightpos

			if (isForward) { // left to right
				length = getLeftIndex();
				newpos = getRightScroll(length);
				//console.log("left2right:", leftpos, Math.round(length), Math.round(newpos));
				thatpos = rightpos, thatarea = showarea;
			} else { // right to left
				length = getRightIndex();
				newpos = getLeftScroll(length);
				//console.log("right2left:", rightpos, Math.round(length), Math.round(newpos));
				thatpos = leftpos, thatarea = editor;
			}

			var that = this;
			if (Math.abs(newpos - thatpos) > 10) {
				this.autoScroll = false;
				if (isForward) {
					thatarea.scrollTop = newpos;
				} else {
					thatarea.scrollTo(0, newpos);
				}
				setTimeout(function(){that.autoScroll = true;}, 20);
			}
		},

		setScrollers: function(length, change, scroll) {
			var scrollers = this.scrollers;
			scrollers.codelength = length;
			scrollers.codechange = change;
			scrollers.codescroll = scroll;
		},

		bindExample: function() {
			var example = document.getElementById("example");
			var that = this;

			function openExample() {
				if (example.selectedIndex == 0) return;
				var name = example.options[example.selectedIndex].value;
				window.jsquick.ajax({
					type: "GET",
					url: "jaxedit/editor/example/" + name,
					data: "",
					success: success
				});

				function success(text, status) {
					if ((status >= 200 && status <300) || status == 304) {
						that.initEditor(text);
					} else {
						that.changeDialog("bodyinfo", "footclose", "Error", "Error 404: File Not Found!");
					}
				}
			}
			example.onchange = openExample;
			example.style.display = "inline-block";
		},

		bindPresent: function() {
			var that = this;
			var presbtn = document.getElementById("presbtn");
			window.jsquick.loadScript("showjax/showjax.js", function(){
				presbtn.onclick = function(event) {
					var ev = event ? event : window.event;
					ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;
					window.onresize = null;
					window.jsquick.loadStyles("jaxedit/showjax/showjax.css", "showjax-style");
					showjax.doPresent(that.childs.showarea);
				};
			});
		},

		bindShare: function() {
			var that = this;
			function downloadContent(fid, wcode) {
				console.log("fetch file with fid=" + fid);
				var path = gatepath + "share.php", info = "fid=" + fid + "&wcode=" + wcode;
				path += "?info=" + encodeURIComponent(that.encodeText(encodeURIComponent(info)));

				function success(text, status, xhr) {
					if ((status >= 200 && status <300) || status == 304) {
						document.getElementById("filename").innerHTML = that.fileName = name;
						console.log("hasEditor", that.hasEditor, "hasParser", that.hasParser);
						var data = decodeURIComponent(that.decodeText(text));
						if (that.hasEditor && that.hasParser) {
							that.initEditor(data);
						} else if (that.hasEditor) {
							that.editor.setValue(data);
						} else {
							that.childs.codearea.value = data;
						}
						that.wcode = wcode;
						var view = xhr.getResponseHeader("Permission");
						that.toggleModal(false);
						if (that.view !== view) {
							that.view = view;
							that.showWindow(enableShare);
						}
					} else {
						that.toggleInfo(status + ": " + text);
					}
				}

				window.jsquick.ajax({
					type: "GET",
					url: path,
					data: "",
					success: success
				});
			}

			function uploadContent(data, name, fid, wcode, rcode, email) {
				var path = gatepath + "share.php", info = "wcode=" + wcode;
				if (fid) info += "&fid=" + fid;
				if (rcode) info += "&rcode=" + rcode;
				if (email) info += "&email=" + email;
				path += "?info=" + encodeURIComponent(that.encodeText(encodeURIComponent(info)));
				var boundary, content, request;

				boundary = 'jjaaxxeeddiitt';
				content = ['--' + boundary,
				'Content-Disposition: form-data; name="file"; filename="' + name + '"',
				'Content-Type: text/plain; charset=utf-8',
				'',
				that.encodeText(encodeURIComponent(data)),
				'--' + boundary + '--'].join('\r\n');

				function success(text, status) {
					if ((status >= 200 && status <300) || status == 304) {
						document.getElementById("filename").innerHTML = that.fileName = name;
						that.fileid = parseInt(text);
						that.wcode = wcode;
						showShareUrl(parseInt(text));
					} else {
						that.toggleInfo("Error " + status + ": Failed to upload file!");
					}
				}

				window.jsquick.ajax({
					type: "POST",
					url: path,
					data: content,
					success: success,
					contentType: "multipart/form-data; boundary=" + boundary
				});
			}

			function showShareUrl(fid) {
				var url = location.protocol + "//" + location.host + shareurl + "?" + fid;
				var info = "Sharing URL is <a href='" + url + "'>" + url + "</a>";
				that.changeDialog("bodyinfo", "footclose", "Share File", info);
			}

			function setupShare() {
				var dialog = document.getElementById("dialog"),
				dlgtitle = document.getElementById("dlgtitle"),
				dbtnshare = document.getElementById("dbtnshare"),
				share_email = document.getElementById("share_email"),
				share_rcode = document.getElementById("share_rcode"),
				share_wcode = document.getElementById("share_wcode");

				function checkShare() {
					var name = that.fileName ? that.fileName : "noname.tex";
					var note = document.getElementById("share_note");
					var email = share_email.value,
					rcode = share_rcode.value,
					wcode = share_wcode.value;
					if (rcode.length < 4) {
						note.innerHTML = "Error: reading password is too short!";
					} else if (wcode.length < 6) {
						note.innerHTML = "Error: editing password is too short!";
					} else if (email.indexOf("@") <= 0 || email.indexOf("@") == email.length - 1) {
						note.innerHTML = "Error: your email address is invalid!";
					} else {
						that.changeDialog("bodyinfo", "footclose", "", "Uploading file...", true);
						uploadContent(that.editor.getValue(), name, null, wcode, rcode, email);
					}
				}

				function checkPress(event) {
					var ev = event ? event : window.event;
					if (ev.keyCode == 13) checkShare();
				}

				dlgtitle.innerHTML = "Share File";
				share_rcode.value = share_wcode.value = that.randomString(4);
				share_wcode.value += that.randomString(2);
				dbtnshare.onclick = checkShare;
				dialog.onkeypress = checkPress;
				that.changeDialog("bodyshare", "footshare");
				share_email.focus();
			}

			function enableShare() {
				var sharebtn = document.getElementById("sharebtn");
				sharebtn.onclick = function() {
					var fid = that.fileid;
					var name = that.fileName ? that.fileName : "noname.tex";
					if (fid > 0) {
						uploadContent(that.editor.getValue(), name, fid, that.wcode);
					} else {
						setupShare();
					}
				};
				sharebtn.style.display = "inline-block";
			}

			function setupFetch() {
				function checkFetch() {
					var scode = document.getElementById("share_scode").value;
					that.changeDialog("bodyinfo", "footclose", "Fetch File", "Fetching file...", true);
					downloadContent(that.fileid, scode);
				};

				function checkPress(event) {
					var ev = event ? event : window.event;
					if (ev.keyCode == 13) checkFetch();
				}

				that.childs.codearea.value = "";
				that.view = "load";
				document.getElementById("dbtnfetch").onclick = checkFetch;
				document.getElementById("dialog").onkeypress = checkPress;
				that.changeDialog("bodyfetch", "footfetch", "Enter Password");
				document.getElementById("share_scode").focus();
			}

			if (this.fileid > 0) setupFetch();
			return enableShare;
		},

		toggleLoading: function(info) {
			this.changeDialog("bodyinfo", null, null, info, true);
		},

		toggleInfo: function(info) {
			this.changeDialog("bodyinfo", null, null, info);
		},

		changeDialog: function(idbody, idfoot, title, info, loading) {
			var childs, element, i;
			if (idbody) {
				childs = document.getElementById("dlgbody").childNodes;
				for (i = 0; i < childs.length; i++) {
					element = childs[i];
					if (element.nodeType == 1) {
						if (element.id === idbody) {
							element.style.display = "block"
						} else {
							element.style.display = "none";
						}
					}
				}
			}
			if (idfoot) {
				childs = document.getElementById("dlgfoot").childNodes;
				for (i = 0; i < childs.length; i++) {
					element = childs[i];
					if (element.nodeType == 1) {
						if (element.id === idfoot) {
							element.style.display = "inline-block"
						} else {
							element.style.display = "none";
						}
					}
				}
			}
			if (title) {
				document.getElementById("dlgtitle").innerHTML = title;
			}
			if (info) {
				if (loading) info = "<i class='gif-loading'></i>" + info;
				document.getElementById("bodyinfo").innerHTML = info;
			}
			this.toggleModal(true);
		},

		encodeText: function(text) {
			if (!text) return text;
			var length = text.length, safePrime = 1964903159, result = [],
			index = navigator.userAgent.length % length, step = safePrime % length;
			console.log("encodeText: length = " + length + " start = " + index + " step = " + step);
			for (var i = 0; i < length; i++) {
				result.push(text.charAt(index));
				index = (index - step + length) % length;
			}
			return result.join("");
		},

		decodeText: function(text) {
			if (!text) return text;
			var length = text.length, safePrime = 1964903159, result = [],
			index = navigator.userAgent.length % length, step = safePrime % length;
			console.log("decodeText: length = " + length + " start = " + index + " step = " + step);
			for (var i = 0; i < length; i++) {
				result[index] = text.charAt(i);
				index = (index - step + length) % length;
			}
			return result.join("");
		},

		randomString: function(size) {
			var text = "";
			var possible = "abcdefghijklmnopqrstuvwxyz";
			for (var i=0; i < size; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
				return text;
		}
	}
})();
jaxedit.doLoad()
};
window.onresize = function() {jaxedit.doResize()};
