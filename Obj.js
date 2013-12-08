function readOBJ ( str_obj ) {
	var str_obj = str_obj.replace( "\r", '' );
	var arr_rows = str_obj.split( "\n" );
	var length = arr_rows.length;
	
	var vertices = [];
	var texCoords = [];
	var faces = [];
	var normals = [];

	
	for ( i = 0; i < length; i++ ) {
		var str_row = arr_rows[ i ];
		if ( str_row === undefined ) continue;
		if ( str_row.length === 0 ) continue;
		
		var str_val = str_row.substr( 0, 2 );

		if ( str_val == 'v ' ) {
			var arr_cells = str_row.split( ' ' );
			vertices.push( [
			    arr_cells[ 1 ],
		        arr_cells[ 2 ],
			    arr_cells[ 3 ]
			] );
		}
		
		/** Processing UV coordinates */
		if ( str_val === 'vt' ) {
			var arr_cells = str_row.split( ' ' );
			texCoords.push( [
			arr_cells[ 1 ] //U
			,	arr_cells[ 2 ] //V
			] );
		}
		/** Processing */
		if ( str_val == 'f ' ) {
			
			var face = [];
			var normal = [];
			
			var arr_cells = str_row.split( ' ' );
			arr_int_vertices = [];
			for ( j in arr_cells ) {
				var int_vertex;
				var int_uv;
				
				if ( j == 0 ) continue;
				
				int_index_of_slash = arr_cells[ j ].indexOf( '/' );

				if ( int_index_of_slash == -1 ) {
					int_vertex = arr_cells[ j ] * 1;
				} else {
					var arr_mixed = arr_cells[ j ].split( '/' );
					int_vertex = arr_mixed[ 0 ];
					int_uv = arr_mixed[ 1 ];
				}
		
				//face.push( int_vertex - 1 );
				faces.push( int_vertex - 1);
				normal.push( int_uv - 1 );
			}
			
			//faces.push( face ); 
			normals.push( normal ); 
		}
		/**/
	}
    return { 'vertices' : vertices,	'indices' : faces };
    //return { 'vertices' : vertices,	'indices' : faces,	'texture' : normals,	'texCoords' : texCoords };
}
