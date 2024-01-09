//
//	calculator-lib.js
//

console.log( "Loading calculator-lib.js" );
var calculator = { 
	sum : function ( ...args ) {
		let result = 0;
		for ( const n of args ) result += n ;
		return result;
		} ,
	product : function ( ...args ) {
		let result = 1;
		for ( const n of args ) result *= n ;
		return result;
		} ,
	arithmeticMean : function ( ...args ) {
		let result = 0;
		return this.sum ( ...args ) / args.length ;
		} ,
	geometricMean : function ( ...args ) {
		let result = 1;
		for ( const n of args ) result *= n ** 2 ;
		return Math.pow( result, 1 / args.length );
		} 
	} ;
console.log( "calculator-lib.js has been loaded." );