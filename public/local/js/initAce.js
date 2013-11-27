
$ = jQuery;

$(document).ready(function() {

	rightSlider();
	leftSlider();

	editor = ace.edit("editor");
	editor.getSession().setMode("ace/mode/latex");


	sharejs.open(documentID, 'text', function (error, doc) {
		doc.attach_ace(editor);
	});

	/* Got the idea from http://stackoverflow.com/questions/3929781/calling-a-function-in-javascript-without-parentheses/3929877#3929877 */
	Object.defineProperty(codeAreaObject, 'value', {
		get: function() {
			return editor.getValue();
		},
		set: function(text) {
			return editor.setValue(text);
		}
	});
	Object.defineProperty(codeAreaObject, 'selectionStart', {
		get: function() {
			return editor.getSession().getDocument().positionToIndex(editor.getSelectionRange().start);
		},
		set: undefined
	});
	Object.defineProperty(codeAreaObject, 'selectionEnd', {
		get: function() {
			return editor.getSession().getDocument().positionToIndex(editor.getSelectionRange().end);
		},
		set: undefined
	});
	Object.defineProperty(codeAreaObject, 'onDocumentChange', {
		get: undefined,
		set: function(doChange) {
			editor.getSession().on('change', function(e) {
				doChange();// e.type, etc
			});
		}
	});

	initJaxEdit();
});