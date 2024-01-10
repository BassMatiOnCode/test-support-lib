import * as Dom from "./dom.js" ;

export function check ( script, title, result,  ){
	if ( result instanceof Function ) result = result( );
	result = result ? "pass" : "fail" ;
	script.before( Dom.createElement( "p", { 
		attributes : {
			class : "test-item" } ,
		properties : { 
			innerHTML : `(${result}) ${title}`  } 
		} ) ) ;
	}

