
const test = {		
	//	Implements the module test functionality.
	list : [ ] ,	
		// A list of test function containers for asynchronous 
		// execution in the run() method.
	currentTest : undefined  
		// Points to the currently executed test object.
		// Set in run(), referenced in check().
	} ;
test.check = function ( title, expression = title ) {
	//	Executes the exression into a result of "passed" or "failed",
	//	injects a test result entry into the document and dispatches
	//	a TestExecuted event to the document that carries the result.
	console.log("checking")
	const result = (typeof expression === "string" ? eval( expression ) : expression( )) ? "passed" : "failed" ;
	this.currentTest.script.before( Dom.createElement( "p", { 
		attributes : { class : "test-item" } ,
		properties : { innerHTML : `(${result}) ${title}` }
		} ) ) ;
	document.dispatchEvent( new CustomEvent ( "TestExecuted" , { detail : { 
		result : result ,
		origin : "host-document" 
		} } ) ) ; 
	} ;
test.incrementCounter = function ( selector ) {
	//	Increments a test result counter in the document
	const e = document.querySelector( selector );
	e.textContent = + e.textContent + 1 ;
	} ;
test.initPage = function ( root = document ) {
	//	Initializes document structures for testing.
	this.setupDocumentEventListeners( );
	for ( const container of root.querySelectorAll( "div.test-summary" ))
		this.setupTestSummaryContainer( container );
	for ( const iframe of root.querySelectorAll( "iframe.test-document" )) {
		this.setupIFrameResizer( iframe );
		this.setupIFrameEventListeners( iframe );
	} } ;
test.register = function ( description, testFunction ) {
	//	Adds a test function and an optional description to the 
	//	test functions list. Adds a reference to the current script
	//	to be used for injecting HTML code into the host document.
	//	The test functions are executed in the run() method.
	this.list.push ( {
		description : description,
		func: testFunction,
		script: document.currentScript
	} ) ; } ;
test.run = function ( ) {
	if ( window.frameElement ) return ;
	console.log( "running " + document.location.href );
	//	Iterate over the registered test objects and execute the test functions.
	for ( this.currentTest of this.list ) {
		//	Inject the description into the host document
		if ( this.currentTest.description ) this.currentTest.script.before ( 
			Dom.createElement( "template", {
			properties : { innerHTML : this.currentTest.description }
			} ).content ) ;
		//	Execute the test function
		this.currentTest.func( );
	} } ;
test.setupDocumentEventListeners = function ( ) {
	//	This event listener looks out for TestExecuted events
	//	from the host document and hosted documents.
	console.log( "setting up document event listeners");
	document.addEventListener( "TestExecuted", evt => {
		//	Increment combined test summary counters
		this.incrementCounter( "div.test-summary.combined span[name='tests-executed']" );
		this.incrementCounter( `div.test-summary.combined span[name='tests-${evt.detail.result}']` );
		// Increment host document summary counters
		if ( evt.detail.origin !== "hosted-document" ) {
			this.incrementCounter( "div.test-summary.host-document span[name='tests-executed']" );
			this.incrementCounter( `div.test-summary.host-document span[name='tests-${evt.detail.result}']` );
		} } ) ;
	} ;
test.setupIFrameEventListeners = function ( iframe ) {
	iframe.contentWindow.addEventListener( "load" , ( ) => { 
		//	Wait for iframe content loaded.
	console.log( "setting up iframe event listeners");
	iframe.contentDocument.addEventListener( "TestExecuted" , evt => {
		//	Re-dispatch TestExecuted events from the hosted document 
		//	with new origin value, because iframe content document
		//	events don't bubble to the host document.
//		debugger;
		document.dispatchEvent( new CustomEvent ( "TestExecuted" , { detail : { 
		result : evt.detail.result ,
		origin : "hosted-document" 
	} } ) ) ;
	} ) ;
	} ) ; } ;
test.setupIFrameResizer = function ( iframe ) {
	function handleSizeChange( entries ) {
		// Set the iframe (=this) height from observed body height
		console.log("iframe size changed")
		this.style.height = entries[0].target.parentElement.scrollHeight + 1 + "px" ;
		}
	iframe.contentWindow.addEventListener( "load", evt => {
		// Create a resize observer for each iframe document
		console.log("creating resize observer")
		const observer = new ResizeObserver( handleSizeChange.bind( evt.currentTarget.frameElement ));
		observer.observe( evt.target.body );
		} ) ;
	} ;
test.setupTestSummaryContainer = function ( container ) {
	//	Injects test summary HTML into containers
	container.append( Dom.createElement( "p", {
		properties : { innerHTML : "Tests executed:	<span name='tests-executed'>0</span>" }
		} ) ) ;
	container.append( Dom.createElement( "p", {
		properties : { innerHTML : "Tests passed:	<span name='tests-passed'>0</span>" }
		} ) ) ;
	container.append( Dom.createElement( "p", {
		properties : { innerHTML : "Tests executed:	<span name='tests-failed'>0</span>" }
		} ) ) ;
	} ;
