//
//		js-test-0.js	2023-08-27    usp
//
const dummyParentTest = {			// Test object for a test root document, contains only null-functions.
	updateModuleStatus : ( ) => { return } ,
	closeSection : ( ) => { return } ,
	closeModule : ( ) => { return } ,
	} ;
const test = { 	
	parentTest : dummyParentTest ,	// must be an object to make "this" bind to the correct object
	sectionsProcessed : 0 ,		// Counters
	testsProcessed : 0 ,
	verboseStatus : ( status ) => { return status ? "success" : "fail" ; } ,  // Returns a string for the boolean status values.
	}
test.incrementTextProperty = function ( target, member ) {
	if ( target ) return ( target[ member ] = + ( target[ member ] || 0 ) + 1 );
	}
test.initModule = function ( addModuleSummary = true ) {
	//	Creates the module test summary above the current script
	//	- - -
	console.log( "initModule()" );
	// Create the module test summary elements
	let s = '<div class="module test-summary">\r\n'
		+ '<p class="status">Status:		<span>undefined</span></p>\r\n' ;
	if ( addModuleSummary ) 
		s += '<p class="modulesProcessed">Modules processed:	<span>0</span></p>\r\n'
		+ '<p class="modulesSucceeded">Modules succeeded:	<span>0</span></p>\r\n'
		+ '<p class="modulesFailed">Modules failed:	<span>0</span></p>\r\n'
		;
	s += '<p class="sectionsProcessed">Sections processed:	<span>0<span></p>\r\n'
		+ '<p class="sectionsSucceeded">Sections succeeded:	<span>0<span></p>\r\n'
		+ '<p class="sectionsFailed">Sections failed:	<span>0<span></p>\r\n'
		+ '<p class="testsPerformed">Tests performed:	<span>0<span></p>\r\n'
		+ '<p class="testsSucceeded">Tests succeeded:	<span>0<span></p>\r\n'
		+ '<p class="testsFailed">Tests failed:		<span>0<span></p>\r\n'
		+ '</div>\r\n' ;
	const template = document.createElement( "TEMPLATE" );
	template.innerHTML = s ;
	document.currentScript.before( ...template.content.childNodes );
	document.body.classList.add( "module", "test-container" );
	// Increment module counters
	let documentWindow = window ;
	while ( documentWindow )  {
		// Increment module counter
		const summary = documentWindow.document.querySelector( ".module.test-summary" );
		if ( summary ) this.incrementSummaryCounter( summary, "modulesProcessed" );
		// Ascend
		documentWindow = documentWindow.frameElement && documentWindow.parent ;
		}
	} ;
test.initSection = function ( ) {
	//	Initializes an existing test section. Creates the section 
	//	summary container above the current script.
	//	- - -
	console.log( "initSection()" );
	this.sectionsProcessed += 1;
	// Add section summary to the document
	let template = document.createElement( "TEMPLATE" );
	template.innerHTML = '<div class="section test-summary">\r\n'
		+ '<p  class="status">Status:		<span>undefined</span></p>\r\n'
		+ '<p class="testsPerformed">Tests performed:	<span>0<span></p>\r\n'
		+ '<p class="testsSucceeded">Tests succeeded:	<span>0<span></p>\r\n'
		+ '<p class="testsFailed">Tests failed:		<span>0<span></p>\r\n'
		+ '</div>\r\n' ;
	document.currentScript.before( ...template.content.childNodes );
	// REQ: A section test summary must have a section test-container parent.
	let container = document.currentScript.parentElement;
	container.classList.add( "section", "test-container" );
	// Add section counter to section title. 
	// REQ: A secton title element immediately precedes the section container element.
	template.innerHTML = `<span class="section-number">${this.sectionsProcessed} </span>` ;
	container.previousElementSibling.prepend( ...template.content.childNodes );
	// Update section counters
	let parentWindow = window ;
	while ( container ) {
		// Increment the sections counter
		let summary = container.querySelector( ".test-summary" );
		if ( summary ) this.incrementSummaryCounter( summary, "sectionsProcessed" );
		// Ascend to next parent test container in the same document
		container = container.parentElement.closest( ".test-container" );
		if ( ! container && parentWindow.frameElement ) {
			// Ascend to parent document iframe container
			container = parentWindow.frameElement.closest( ".test-container" );
			parentWindow = parentWindow.parent;
	}	}	}	// initSection( )
test.incrementSummaryCounter = function ( summary, key, value = 1 ) {
	//	The counter value is in the span in a parent with a matching classname attribute.
	//	If the counter does not exist, the function returns undefined. No exceptions thrown.
	const element = summary.querySelector( `.${key} > span` );
	if ( element ) return element.innerText = + element.innerText + value;
	} ;
test.getSummaryCounter = function ( summary, key )  {
	//	Returns the numeric (!) value of a summary counter or undefined if that counter does not exist.
	const e = summary.querySelector( `.${key} > span` );
	if ( e ) return + e.innerText ;
	} ;
test.setSummaryValue = function ( summary, key, value ) {
	// Set a summary entry value. No exceptions are thrown, even if the specified value does not exist.
	// - - -
	const element = summary.querySelector( `.${key} > span` );
	if ( element ) element.innerText = value ;
	return value;
	} ;
test.updateStatus = function ( container, success ) {
	//	Updates the test status and all parent container summaries up to the test root document.
	//	Container : The test result container
	//	Success : true if the test succeeded.
	//	- - -
	let data = { 
			// Status and counter information
			status : success ? "success" : "fail" ,
			counters : { 
				// TODO: Can fail counters be omitted?
				testsPerformed : 1 ,
				testsFailed : success ? 0 : 1 ,
				testsSucceeded : success ? 1 : 0 ,
				sectionsFailed : 0 ,
				modulesFailed : 0
			}	} ;
	container.setAttribute( "test-status", data.status );
	// Ascend to next parent test container
	let parentWindow = window ;
	while ( true ) {
		container = container.parentElement.closest( ".test-container" );
		// Ascend to parent document iframe test container
		if ( ! container && parentWindow.frameElement ) {
			container = parentWindow.frameElement.closest( ".test-container" );
			parentWindow = parentWindow.parent;
			}
		// Done?
		if ( ! container ) break;
		// Update container status
		let summary = container.querySelector( ".test-summary" );
		if ( summary ) {
			// change summary status on first failed test
			// REQ: All summary structures must have a "testsFailed" counter.
			if ( data.status === "fail" && this.getSummaryCounter( summary, "testsFailed" ) === 0 ) {
				summary.setAttribute( "test-status", "fail" );
				summary.querySelector( ".status > span" ).innerText = "fail" ;
				if ( summary.classList.contains( "section" )) data.counters.sectionsFailed += 1 ;
				else if ( summary.classList.contains( "module" )) data.counters.modulesFailed += 1;
				}
			// update counters
			for (const [key, value] of Object.entries( data.counters )) 
				this.incrementSummaryCounter( summary, key, value );
		}	}	
	} ;
test.createTestContainer = function ( title, description, success, calculated, expected, message ) {	
	//	Creates the test DIV container, filled with result-independent entries.
	//	- - -
	this.testsProcessed += 1;
	const template = document.createElement( "TEMPLATE" );
	template.innerHTML = `<div class="test">\r\n`
		+ `<p>${this.sectionsProcessed}.${this.testsProcessed} ${title}</p>\r\n`
		+ (description ? `<p>${description}</p>\r\n` : ``)
		+ `<p id="result">Result:\t<span></span></p>\r\n`
		+ `<\div>\r\n` ;
	document.currentScript.before( ...template.content.childNodes );
	this.updateStatus( document.currentScript.previousElementSibling, success ) ;
	}
test.checkEqual = function ( title, description, calculated, expected, message ) {
	// Create test container
	this.createTestContainer( title, description, calculated === expected, calculated, expected, message );
	} ;
test.closeSection = function ( ) {
	//	Sets the test section status to success and updates parent section success counters if no errors occured. 
	//	Must be called after the last test in the section.
	let container = document.currentScript.closest( "div.section.test-container" );
	let summary = container.querySelector( ".test-container > .test-summary" );
	if ( summary.getAttribute( "test-status" ) === "fail" ) return ;
	summary.setAttribute( "test-status", "success" );
	this.setSummaryValue( summary, "status", "success" );
	let parentWindow = window;
	while ( container ) {
		this.incrementSummaryCounter( summary, "sectionsSucceeded" );
		container = container.parentElement.closest( ".test-container" );
		if ( ! container && parentWindow.frameElement ) {
			container = parentWindow.frameElement.closest( ".test-container" );
			parentWindow = parentWindow.parent;
			}
		summary = container && container.querySelector( ".test-container > .test-summary" );
		}
	} ;
test.closeModule = function ( ) {
	//	Sets Module status to success if no errors occured. 
	//	Must be called after the last section in the document..
	console.log( "closeModule(): " + document.location.href );
	let documentWindow = window;
	while ( documentWindow ) {
		const summary = documentWindow.document.body.querySelector( "div.module.test-summary" );
		if ( summary ) {
			if ( summary.querySelector( ".testsFailed > span" ).innerText === "0" ) {
				this.incrementSummaryCounter( summary, "modulesSucceeded" );
				summary.setAttribute( "test-status", "success" );
				summary.querySelector( ".status > span" ).innerText = "success" ;
			}	}
		documentWindow = documentWindow.frameElement && documentWindow.parent ;
		}
	}

console.log( "js-test loaded into " + document.location );
window.test = test;