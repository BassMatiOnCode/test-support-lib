/**		
 *		web-components/dom/dom-1.js    2023-12-288    usp
 *		Utility functions for working with objects and elements
 */
export function setAttributes ( element, attributes = { } ) {
	/**	Sets attributes on the target element
	 */
	for ( const [ name, value ] of Object.entries( attributes )) element.setAttribute( name, value );
	return element;
	}
export function follow( object, path ) {
	/**	Returns the object and property at the end of the access path.
	 *	Creates missing objects in the path if required.
	 */
	path = path.split( "." );
	const propertyName = path.pop( ) ;
	for ( const entry of path ) object = object[ entry ] || ( object[ entry ] = { } ) ;  // extising or created member
	return { object : object , property : propertyName };
	}
export function setProperties ( target, properties = { }, { overwrite=true , overrideValues=[undefined, null, "" ], createPath=true } = { } ) {
	/**	Sets properties on the target object
	 */
	for ( const [ name, value ] of Object.entries( properties )) {
		const { object, property } = createPath ? follow( target, name, createPath ) : { object : target, property : name } ;
		if ( overrideValues.includes( object [ property ] ) || overwrite ) object[ property ] = value ;
		}
	return target;
	}
export function createElement( tagName, { attributes={ }, properties={ }, namespace, options } = { } ) {
	/**	Creates an element with optional namespace, and sets 
	 *	attributes and properties.
	 */
	const element = namespace ? document.createElementNS( namespace, tagName, options ) : document .createElement( tagName, options );
	setAttributes( element, attributes );
	setProperties( element, properties );
	return element;
	}
