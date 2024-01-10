function incrementCounter( selector ){
	const counter = document.querySelector( selector );
	counter.textContent = + counter.textContent + 1;
	}
export function addTestEventHandlers( iframe ){
	iframe.contentDocument.addEventListener("TestPassed", evt=>{
		console.log("test passed");
		incrementCounter("span#total-test-count");
		incrementCounter("span#total-pass-count");
		});
	iframe.contentDocument.addEventListener("TestFailed", evt=>{
		console.log("test failed");
		incrementCounter("span#total-test-count");
		incrementCounter("span#total-fail-count");
		});
	} 

export function prepareChildDocuments(){
	for ( const iframe of document.querySelectorAll("iframe.test-document")){
		iframe.contentWindow.addEventListener( "load", evt => {
			addTestEventHandlers( iframe );
			});
	}	}

export function initPage ( ) {
	prepareChildDocuments();	
	}

// Module init code

initPage();
