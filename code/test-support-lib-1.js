//
//	test-support-lib-1.js	2024-01-09    usp
//
const test = {		
	//	Implements the module test functionality.
	list : [ ] ,	
		// A list of test function containers for asynchronous 
		// execution in the run() method.
	currentTest : undefined ,
		// Points to the currently executed test object.
		// Set in run(), referenced in check().
	section : 0 ,
	test : 0
		// These variables provide the counters for test numbering
	} ;
test.check = function ( title, expression = title ) {
	//	Executes a test and documents the result.
	console.log("checking")
	//	Check
	const result = (typeof expression === "string" ? eval( expression ) : expression( )) ? "passed" : "failed" ;
	// Update counter
	//	Inject test result
	const p = document.createElement( "P" );
	p.className = "test-item" ;
	p.setAttribute( result, "" );
	p.innerHTML = `<span class="test-counter">${this.section}.${++this.test}</span>${title}` ;
	this.currentTest.script.before( p );
	//	Publish test result
	document.dispatchEvent ( new CustomEvent ( "TestExecuted" , { detail : { 
		result : result ,
		origin : "host-document" ,
		url : document.location.href
		} } ) ) ;
	} ;
test.finishDocument = function ( ) {
	//	Sets the document heading attribute "passed" if there were no fails.
	const e = document.querySelector( "h1" )
	if ( ! e.hasAttribute( "failed" )) e.toggleAttribute( "passed", true );
	} ;
test.incrementCounter = function ( selector ) {
	//	Increments a test result counter in the document
	const e = document.querySelector( selector );
	e.textContent = + e.textContent + 1 ;
	} ;
test.incrementSection = function( ) {
	this.section += 1 ;
	this.test = 0 ;
	}
test.initPage = function ( root = document ) {
	//	Initialises document infrastructure
	console.log( "test.initPage() " + document.location.href );
	this.injectTestSummaries( );
	if ( new URL(document.location).searchParams.get( "descend" ) === "no" ) {
		this.mutationObserver = new MutationObserver( ( mutationList, observer ) => {
			for ( const mutationRecord of mutationList ) {
				for ( const addedNode of mutationRecord.addedNodes ) {
					if ( addedNode.tagName === "IFRAME" && addedNode.classList.contains( "test-document" )) {
						addedNode.remove( );
						}
					}
				}
			} ).observe( document.body, { 
				childList : true , 
				subtree : true
			} );
		}
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
	//	Monitor TestExecuted events.
	console.log( "setting up test event listeners" );
	document.addEventListener( "TestExecuted", evt => {
		//	Increment combined test summary counters
		this.incrementCounter( "div.test-summary.combined p.tests-executed" );
		this.incrementCounter( `div.test-summary.combined p.tests-${evt.detail.result}` );
		const e = document.querySelector( "h1" );
		if ( evt.detail.result === "failed" ) {
			e.setAttribute( "test-status", "failed" );
			document.querySelector( "div.test-summary.combined p.tests-failed" ).toggleAttribute( "failed" , true );
			}
		// Increment host document summary counters
		if ( evt.detail.origin !== "hosted-document" ) {
			this.incrementCounter( "div.test-summary.host-document p.tests-executed" );
			this.incrementCounter( `div.test-summary.host-document p.tests-${evt.detail.result}` );
			if ( evt.detail.result === "failed" ) e.setAttribute( "test-status", "failed" );
			}
		if ( window.frameElement ) window.parent.document.dispatchEvent( new CustomEvent( "TestExecuted", { detail : {
			result : evt.detail.result ,
			origin : "hosted-document" ,
			url : evt.detail.url
	} } ) ) ; } ) ; } ;
test.injectTestSummaryFields = function ( container ) {
	//	Injects test summary HTML into containers
	const t = document.createElement( "template" );
	t.innerHTML = "<p class='tests-executed counter'>0</p>"
		+ "<p class='tests-passed counter'>0</p>"
		+ "<p class='tests-failed counter'>0</p>"
	container.append( t.content );
	} ;
test.injectTestSummaries = function ( ) {
	//	Inject test summaries
	console.info( "Injecting document test summaries" );
	//	Combined results
	let p = document.createElement( "p" );
	p.className = "test-summary-title" ;
	p.textContent = "Test Summary (Combined Results)" ;
	document.currentScript.before( p );
	let container = document.createElement( "div" );
	container.className = "test-summary combined" ;
	this.injectTestSummaryFields( container );
	document.currentScript.before( container );
	//	This document
	p = document.createElement( "p" );
	p.className = "test-summary-title" ;
	p.textContent = "Test Summary (This Document)" ;
	document.currentScript.before( p );
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
	console.log("test.register()");
	this.list.push ( {
		description : description,
		func: testFunction,
		script: document.currentScript,
		section : this.section
	} ) ; } ;
test.run = function ( ) {
	//	Start child test documents and execute registered test functions.
	if ( this.mutationObserver ) {
		this.mutationObserver.disconnect( );
		delete this.mutationObserver;
		}
	console.log( "Running " + document.location.href );
	this.section = 0 ;
	for ( this.currentTest of this.list ) {
		//	Set the section number
		if ( this.section !== this.currentTest.section ) this.section = this.currentTest.section;
		//	Inject the description into the host document
		if ( this.currentTest.description ) {
			const t = document.createElement( "TEMPLATE" );
			t.innerHTML = this.currentTest.description ;
			this.currentTest.script.before( t.content ); 
			}
		//	Execute the test function
		this.currentTest.func( );
	}	
	//	Update document status if there were no errors
	const e = document.querySelector( "h1" )
	if ( ! e.hasAttribute( "test-status" )) e.setAttribute( "test-status", "passed" );
	} ;

/* * * Initialization * * */

console.log("test-support-lib.js loaded");