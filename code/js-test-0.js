//
//		js-test-0.js	2023-08-27    usp
//

// Depends on 
//		dom-helper-0.js

const test = { 
	module : {
		parent : undefined ,			// Points to the parent test module in a hierachical structure
		containter : undefined ,		// Points to the module test container element, usually the document body.
		summary : undefined ,		// Reference to the module test summary container
		sectionsProcessed : 0 ,		// Counters
		sectionsSucceeded : 0 ,
		sectionsFailed : 0 ,
		testsPerformed : 0 ,
		testsSucceeded : 0 ,
		testsFailed : 0 ,
		} ,
	section : {
		container : undefined ,		// Points to the current section container
		summary : undefined ,		// Points to the section summary container
		testsPerformed : 0 ,			// Counters
		testsSucceeded : 0 ,
		testsFailed : 0 ,
		} ,
	currentTest : undefined ,		// Points to the current test container
	}
test.incrementText = function ( target, member ) {
	let result;
	if ( target[ member ] !== undefined ) result = target[ member ] = + target[ member ] + 1 ;
	else target.setAtttribute( member, result = + target.getAttribute( member ) + 1 );
	return result;
	}
test.initModule = function ( ) {
	//	Creates the module test summary above the current script
	//	- - -
	console.log( "initModule()" );
	// Create the module test summary elements
	const template = document.createElement( "TEMPLATE" );
	template.innerHTML = '<div class="module test-summary">\r\n'
		+ '<p id="status">Status:		<span>undefined</span></p>\r\n'
		+ '<p id="sections-processed">Sections processed:	<span>0<span></p>\r\n'
		+ '<p id="sections-succeeded">Sections succeeded:	<span>0<span></p>\r\n'
		+ '<p id="sections-failed">Sections failed:	<span>0<span></p>\r\n'
		+ '<p id="tests-performed">Tests performed:	<span>0<span></p>\r\n'
		+ '<p id="tests-succeeded">Tests succeeded:	<span>0<span></p>\r\n'
		+ '<p id="tests-failed">Tests failed:		<span>0<span></p>\r\n'
		+ '</div>\r\n' ;
	document.currentScript.before( ...template.content.childNodes );
	// Store element references.
	this.module.container = document.body ;
	this.module.summary = document.currentScript.previousElementSibling ;
	}
test.initSection = function ( ) {
	//	Initializes an existing test section. Creates the section 
	//	summary container above the current script.
	//	- - -
	console.log( "initSection()" );
	// Add section summary
	let template = document.createElement( "TEMPLATE" );
	template.innerHTML = '<div class="section test-summary">\r\n'
		+ '<p  id="status">Status:		<span>undefined</span></p>\r\n'
		+ '<p id="tests-performed">Tests performed:	<span>0<span></p>\r\n'
		+ '<p id="tests-succeeded">Tests succeeded:	<span>0<span></p>\r\n'
		+ '<p id="tests-failed">Tests failed:		<span>0<span></p>\r\n'
		+ '</div>\r\n' ;
	document.currentScript.before( ...template.content.childNodes );
	document.currentScript.parentElement.classList.add( "test-section" );
	// Store references to HTML elements
	this.section.summary = document.currentScript.previousElementSibling ;
	this.section.container = document.currentScript.parentNode ;
	// Count the section
	this.module.summary.querySelector( "#sections-processed > span" ).innerText = ++ this.module.sectionsProcessed;
	// Add section counter to section title. Assumes that
	// the secton title element immediately precedes the section container element.
	template.innerHTML = `<span class="section-number">${this.module.sectionsProcessed} </span>` ;
	this.section.container.previousElementSibling.prepend( ...template.content.childNodes );
	// Reset section test counters
	this.section.testsPerformed = 0;
	this.section.testsSucceeded = 0;
	this.section.testsFailed = 0;
	}	// initSection()
test.createTestContainer = function ( title, description, success, calculated, expected, message ) {	
	//	Creates the test DIV container, filled with result-independent entries.
	//	- - -
	const statusText = success ? "success" : "fail" ;
	this.section.testsPerformed += 1;
	this.module.testsPerformed += 1;
	// Create the test container element.
	const template = document.createElement( "TEMPLATE" );
	template.innerHTML = `<div class="test">\r\n`
		+ `<p>${this.module.sectionsProcessed}.${this.section.testsPerformed} ${title}</p>\r\n`
		+ (description ? `<p>${description}</p>\r\n` : ``)
		+ `<p id="result">Result:\t<span>${statusText}</span></p>\r\n`
		+ `<\div>\r\n` ;
	document.currentScript.before( ...template.content.childNodes );
	const testContainer = document.currentScript.previousElementSibling ;
	// Set test status
	testContainer.setAttribute( "test-status", statusText );
	// Update test counter GUI elements
	this.section.summary.querySelector( "#tests-performed > span" ).innerText = this.section.testsPerformed ;
	this.module.summary.querySelector( "#tests-performed > span" ).innerText = this.module.testsPerformed ;
	if ( success ) {
		// Update success counters and GUI elements
		this.section.summary.querySelector( "#tests-succeeded > span" ).innerText = ++ this.section.testsSucceeded ;
		this.module.summary.querySelector( "#tests-succeeded > span" ).innerText = ++ this.module.testsSucceeded ;
		}
	else { 
		// Append failure detail elements
		const template = document.createElement( "TEMPLATE" );
		template.innerHTML = `<p>Expected:\t<span>${expected}</span></p>\r\n` 
			+ `<p>Calculated:\t<span>${calculated}</span></p>\r\n`
			+ ( message ? `<p>${message}</p>\r\n` : '' );
		testContainer.append( ...template.content.childNodes );
		// Update fail counters
		this.section.summary.querySelector( "#tests-failed > span" ).innerText = ++ this.section.testsFailed ;
		this.module.summary.querySelector( "#tests-failed > span" ).innerText = ++ this.module.testsFailed ;
		// Update failure status information
		if ( this.section.testsFailed === 1 ) {
			// Section failed
			this.section.summary.setAttribute( "test-status", statusText );
			this.section.summary.querySelector( "#status > span" ).innerText = statusText;
			this.module.summary.querySelector( "#sections-failed > span" ).innerText = ++ this.module.sectionsFailed ;
			if ( this.module.sectionsFailed === 1 ) {
				// Module failed
				this.module.summary.setAttribute( "test-status", statusText );
				this.module.summary.querySelector( "#status > span" ).innerText = statusText;
				}
			}
		}
	}
test.checkEqual = function ( title, description, calculated, expected, message ) {
	// Create test container
	this.createTestContainer( title, description, calculated === expected, calculated, expected, message );
	}
test.updateSectionStatus = function ( ) {
	//	Sets section status to success and updates sections success counter if no errors occured. 
	//	Must be called after the last test in the section.
	if ( this.section.testsFailed == 0 ) {
		this.section.summary.setAttribute( "test-status", "success" );
		this.section.summary.querySelector( "#status > span" ).innerText = "success" ;
		this.module.summary.querySelector( "#sections-succeeded > span" ).innerText = ++ this.module.sectionsSucceeded ;
	}	}
test.updateModuleStatus = function ( ) {
	//	Sets Module status to success if no errors occured. 
	//	Must be called after the last section in the document..
	if ( this.module.testsFailed == 0 ) {
		this.module.summary.setAttribute( "test-status", "success" );
		this.module.summary.querySelector( "#status > span" ).innerText = "success" ;
	}	}

