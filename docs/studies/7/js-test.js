
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
	//	Executes the test exression into a result of "passed" or "failed",
	//	injects a test result entry into the document and dispatches
	//	a TestExecuted event to the document that carries the result.
	console.log("checking")
	const result = (typeof expression === "string" ? eval( expression ) : expression( )) ? "passed" : "failed" ;
	const p = document.createElement( "P" );
	p.className = "test-item" ;
	p.innerHTML = `(${result})	${title}` ;
	this.currentTest.script.before( p );
	document.dispatchEvent ( new CustomEvent ( "TestExecuted" , { detail : { 
		result : result ,
		origin : "host-document" ,
		url : document.location.href
		} } ) ) ;
	} ;
test.incrementCounter = function ( selector ) {
	//	Increments a test result counter in the document
	const e = document.querySelector( selector );
	e.textContent = + e.textContent + 1 ;
	} ;
test.initPage = function ( root = document ) {
	//	Initialises document infrastructure
	console.log( "test.initPage() " + document.location.href );
	this.injectTestSummaries( );
	this.initTestEventListeners( );
	if ( window.frameElement ) this.initResizeObserver( );
	} ;
test.initResizeObserver = function ( ) {
	//	Monitors documents size changes and adjusts the
	//	hosting iframe height accordingly.
	console.log("test.initResizeObserver()");
	const observer = new ResizeObserver( ( entries ) =>{
		console.log("test.initResizeObserver(): Height changed to " + entries[ 0 ].target.scrollHeight );
		//	An additional pixel compensates rounding effects
		window.frameElement.style.height = entries[ 0 ].target.scrollHeight + 1 + "px" ;
		} ) ;
	observer.observe( document.documentElement );
	} ;
test.initTestEventListeners = function ( ) {
	//	This event listener looks out for TestExecuted events
	//	from the host document and hosted documents.
	console.log( "setting up test event listeners" );
	document.addEventListener( "TestExecuted", evt => {
		//	Increment combined test summary counters
		this.incrementCounter( "div.test-summary.combined span[name='tests-executed']" );
		this.incrementCounter( `div.test-summary.combined span[name='tests-${evt.detail.result}']` );
		// Increment host document summary counters
		if ( evt.detail.origin !== "hosted-document" ) {
			this.incrementCounter( "div.test-summary.host-document span[name='tests-executed']" );
			this.incrementCounter( `div.test-summary.host-document span[name='tests-${evt.detail.result}']` );
			}
		if ( window.frameElement ) window.parent.document.dispatchEvent( new CustomEvent( "TestExecuted", { detail : {
			result : evt.detail.result ,
			origin : "hosted-document" ,
			uri : document.location.href
	} } ) ) ; } ) ; } ;
test.injectTestSummaryFields = function ( container ) {
	//	Injects test summary HTML into containers
	const t = document.createElement( "template" );
	t.innerHTML = "<p>Tests executed:	<span name='tests-executed'>0</span></p>\n"
		+ "<p>Tests passed:	<span name='tests-passed'>0</span></p>\n"
		+ "<p>Tests failed:	<span name='tests-failed'>0</span></p>"
	container.append( t.content );
	} ;
test.injectTestSummaries = function ( ) {
	//	Inject test summaries
	console.info( "Injecting document test summaries" );
	let container = document.createElement( "div" );
	container.className = "test-summary combined" ;
	this.injectTestSummaryFields( container );
	document.currentScript.before( container );
	container = document.createElement( "div" );
	container.className = "test-summary host-document" ;
	this.injectTestSummaryFields( container );
	document.currentScript.before( container );
	} ;
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
	//	Start child test documents and execute registered test functions.
	console.log( "Running " + document.location.href );
	for ( this.currentTest of this.list ) {
		//	Inject the description into the host document
		if ( this.currentTest.description ) {
			const t = document.createElement( "TEMPLATE" );
			t.innerHTML = this.currentTest.description ;
			this.currentTest.script.before ( t.content ); 
			}
		//	Execute the test function
		this.currentTest.func( );
	}	} ;

/* * * Initialization * * */

