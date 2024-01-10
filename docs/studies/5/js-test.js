
const test = {		//	Implements the module test functionality.
	list : [ ] ,			// list of test objects for asynchronous execution
	currentTest : undefined	// points to the currently executed test object.
	} ;
test.register = function( description, testFunction ) {
	//	Collect test functions and DOM environment informations for 
	//	asynchronous execution. Must be used if the library under test 
	//	is a JavaScript module.
	this.list.push ( {
		description : description ,
		func: testFunction,
		script: document.currentScript
	} ) ; } ;
test.check = function ( title, expression = title ) {
	const result = typeof expression === "string" ? eval( expression ) : expression( );
	this.currentTest.script.before( Dom.createElement( "p", { 
		attributes : { class : "test-item" } ,
		properties : { innerHTML : `(${result ? "pass" : "fail"}) ${title}` }
	} ) ) ; }
test.run = function ( ) {
	//	Iterate over the registered test objects and execute the test functions.
	for ( this.currentTest of this.list ) {
		//	Inject the description into the host document
		if ( this.currentTest.description ) this.currentTest.script.before( 
			Dom.createElement( "template", {
			properties : { innerHTML : this.currentTest.description }
			} ).content ) ;
		//	Execute the test function
		this.currentTest.func( );
	} } ;
