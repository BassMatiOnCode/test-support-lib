//
//	js-test-0.js
//	This is a non-module that provides DOM element injection functions.
//

const test = {					//	Implements the module test functionality.
	testFunctions : [ ] ,		// list of tests for asynchronous execution
	currentScript : null ,		// points to the current script
	testsProcessed : 0 ,			// counts the tests
	sectionsProcessed : 0 ,		// counts the sections
	} ;
test.incrementSummaryCounter = function ( summary, key, value = 1 ) {
	if ( ! summary ) return;
	const e = summary.querySelector( `.${key} > span` );
	if ( e ) return e.innerText = + e.innerText + value ;
	} ;
test.getSummaryValue = function ( summary, key ) {
	if ( ! summary ) return;
	const e = summary.querySelector( `.${key} > span` );
	if ( e ) return e.innerText;
	} ;
test.setSummaryValue = function ( summary, key, value = "" ) {
	if ( ! summary ) return;
	const e = summary.querySelector( `.${key} > span` );
	if ( e ) e.innerText = value;
	} ;
test.updateCounters = function( testContainer, data ) {
	let parentWindow = window ;
	while ( testContainer ) {
		// Find container summary
		const summary = testContainer.querySelector( ".test-container > .test-summary" );
		if ( summary ) {
			if ( data.status === "fail" ) {
				// Parent fails if a child failed
				if ( summary.getAttribute( "test-status" ) === "success" ) {
					// Revert success to fail, decrement success counters
					// TODO: Check if counters are really to be decremented.
					if ( summary.classList.contains( "section" )) data.counters.sectionsSucceeded -= 1;
					else if ( summary.classList.contains( "module" )) data.counters.modulesSucceeded -= 1;
					}
				if ( summary.getAttribute( "test-status" ) !== "fail" ) {
					// Set status to fail, increment fail counters
					if ( summary.classList.contains( "section" )) data.counters.sectionsFailed += 1;
					else if ( summary.classList.contains( "module" )) data.counters.modulesFailed += 1;
					}
				// Set container summary status to "fail"
				summary.setAttribute( "test-status", data.status );
				this.setSummaryValue( summary, "status", data.status );
				}
			if ( data.counters ) for ( const [key, value] of Object.entries( data.counters )) this.incrementSummaryCounter( summary, key, value );
			}
		// Ascend to parent test container
		testContainer = testContainer.parentElement.closest( ".test-container" );
		if ( ! testContainer ) {
			testContainer = parentWindow.frameElement && parentWindow.frameElement.closest( ".test-container" );
			parentWindow = parentWindow.parent;
			}
		}
	} ;
test.initModule = function ( options = { addModuleSummary : false } ) {
	//	Creates the module test summary above the current script
	//	- - -
	console.log( "initModule()" );
	// Create the module test summary elements
	let s = '<div class="module test-summary">\r\n'
		+ '<p class="status">Status:		<span>undefined</span></p>\r\n' ;
	if ( options.addModuleSummary )
		s += '<p class="modulesProcessed">Modules processed:	<span>0</span></p>\r\n'
		+ '<p class="modulesSucceeded">Modules succeeded:	<span>0</span></p>\r\n'
		+ '<p class="modulesFailed">Modules failed:	<span>0</span></p>\r\n'
		;
	s += '<p class="sectionsProcessed">Sections processed:	<span>0<span></p>\r\n'
		+ '<p class="sectionsSucceeded">Sections succeeded:	<span>0<span></p>\r\n'
		+ '<p class="sectionsFailed">Sections failed:	<span>0<span></p>\r\n'
		+ '<p class="testsProcessed">Tests processed:	<span>0<span></p>\r\n'
		+ '<p class="testsSucceeded">Tests succeeded:	<span>0<span></p>\r\n'
		+ '<p class="testsFailed">Tests failed:		<span>0<span></p>\r\n'
		+ '</div>\r\n' ;
	const template = document.createElement( "TEMPLATE" );
	template.innerHTML = s ;
	document.currentScript.before( ...template.content.childNodes );
	document.body.classList.add( "module", "test-container" );
	this.updateCounters ( document.body, { counters : { modulesProcessed : 1 } } );
	} ;
test.closeModule = function( ) {
	//	Sets the test module status and increments the succeeded modules counters.
	const summary = document.body.querySelector( ".module.test-summary" );
	if ( this.getSummaryValue( summary, "testsFailed" ) === "0" ) {
		summary.setAttribute( "test-status", "success" );
		this.setSummaryValue( summary, "status", "success" );
		this.updateCounters( document.body, { counters : { modulesSucceeded : 1 } } );
		}
	} ;
test.initSection = function ( options = {
	addModuleSummary : false ,
	addSectionSummary : false } )
	{
	// REQ: The section init script element must be a direct child of the section test container.
	this.sectionsProcessed += 1 ;
	this.testsProcessed = 0;
	document.currentScript.parentElement.classList.add( "section", "test-container" );
	let s = '<div class="section test-summary">\r\n'
		+ '<p class="status">Status:		<span>undefined</span></p>\r\n' ;
	if ( options.addModuleSummary ) {
		s += '<p class="modulesProcessed">Modules processed:	<span>0</span></p>\r\n'
		+ '<p class="modulesSucceeded">Modules succeeded:	<span>0</span></p>\r\n'
		+ '<p class="modulesFailed">Modules failed:	<span>0</span></p>\r\n' ;
		}
	if ( options.addSectionSummary ) {
		s += '<p class="sectionsProcessed">Sections processed:	<span>0<span></p>\r\n'
		+ '<p class="sectionsSucceeded">Sections succeeded:	<span>0<span></p>\r\n'
		+ '<p class="sectionsFailed">Sections failed:	<span>0<span></p>\r\n' ;
		}
	s += '<p class="testsProcessed">Tests processed:	<span>0</span></p>\r\n'
		+ '<p class="testsSucceeded">Tests succeeded:	<span>0</span></p>\r\n'
		+ '<p class="testsFailed">Tests failed:		<span>0</span></p>\r\n'
		+ '</div>\r\n' ;
	const template = document.createElement( "TEMPLATE" );
	template.innerHTML = s;
	document.currentScript.before( ...template.content.childNodes );
	const sectionContainer = document.currentScript.closest( ".test-container" );
	sectionContainer.setAttribute( "section-number", this.sectionsProcessed );
	this.updateCounters ( sectionContainer, { counters : { sectionsProcessed : 1 } } );
	// insert section number in heading
	const target = sectionContainer.previousElementSibling.querySelector( "span.section-number" );
	if ( target ) target.innerText = this.sectionsProcessed ;
	} ;
test.closeSection = function( ) {
	//	Sets the test module status and increments the succeeded modules counters.
	const container = (document.currentScript || this.currentScript).closest( ".test-container" );
	const summary = container.querySelector(".test-container > .section.test-summary");
	if ( this.getSummaryValue( summary, "testsFailed" ) === "0" ) {
		summary.setAttribute( "test-status", "success" );
		this.setSummaryValue( summary, "status", "success" );
		this.updateCounters( container, { counters : { sectionsSucceeded : 1 }} );
		}
	} ;
test.createTestContainer = function ( title, description, success, calculated, expected, message ) {
	//	Creates the test DIV container, filled with result-independent entries.
	//	- - -
	// Setup for synchronous calls
	if ( ! this.currentScript ) this.currentScript = document.currentScript;
	// Find the parent section container
	const sectionContainer = this.currentScript.closest( ".test-container" );
	// Determine section and test numbers
	if ( this.sectionsProcessed === + sectionContainer.getAttribute( "section-number" ))this.testsProcessed += 1;
	else {
		this.sectionsProcessed += 1;
		this.testsProcessed = 1 ;
		}
	// Inject HTML code for the test result
	let s = `<div class="test" test-status="${success?'success':'fail'}">\r\n`
		+ `<p>${sectionContainer.getAttribute( "section-number" )}.${this.testsProcessed} ${title}</p>\r\n`
		+ (description ? `<p>${description}</p>\r\n` : ``)
		+ `<p id="result">Result:\t<span>${success ? "success" : "fail"}</span></p>\r\n` ;
	if ( ! success ) s += `<p>Expected:	${expected}</p>\r\n`
		+ `<p>Calculated:	${calculated}</p>\r\n`
		+ (message ? `<p>${message}</p>\r\n` : "" );
	s += `<\div>\r\n` ;
	const template = document.createElement( "TEMPLATE" );
	template.innerHTML = s;
	this.currentScript.before( ...template.content.childNodes );
	// Update summary counters
	const data = { counters : { testsProcessed : 1 , testsFailed : 0 , sectionsSucceeded : 0 , sectionsFailed : 0 , modulesSucceeded : 0 , modulesFailed : 0 }};
	if ( success ) data.counters.testsSucceeded = 1;
	else { data.status = "fail" ; data.counters.testsFailed = 1 ; }
	this.updateCounters( sectionContainer, data );
	// Cleanup for synchronous calls
	if ( document.currentScript ) this.currentScript = null ;
	}
test.checkEqual = function ( title, description, calculated, expected, message ) {
	this.createTestContainer( title, description, calculated === expected, calculated, expected, message );
	} ;
test.register = function( testFunction ) {
	//	Collect test functions and DOM environment informations for asynchronous execution.
	// Must be used if the library under test is a JavaScript module.
	this.testFunctions.push ( {
		func: testFunction,
		script: document.currentScript
		} ) ;
	} ;
test.run = function ( ) {
	//	Runs the collected test functions. Usually called from a module script.
	this.sectionsProcessed = 0;
	for ( const test of this.testFunctions ) {
		this.currentScript = test.script;
		test.func ( test.script );
		}
	} ;
