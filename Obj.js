function readOBJ ( str_obj ) {
	var str_obj = str_obj.replace( "\r", '' );
	var arr_rows = str_obj.split( "\n" );
	var length = arr_rows.length;

    var objects = {};
	var vertices = [];
	var texCoords = [];
	var faces = [];
	var normals = [];

    //lets do a pass and enumerate all the objects and stuff
    var cur_obj;
    for (i = 0; i < length; i++){
        var row = arr_rows[i];
        var str_val = row.substr(0,2);
        if(str_val == 'o '){
            cur_obj = new Object();
            cur_obj.numVertices = 0;
            cur_obj.numNormals = 0;
            cur_obj.numUVs = 0;
            cur_obj.name = row.substr(2,row.length);
            objects[cur_obj.name] = cur_obj;
        }
        if(cur_obj && str_val == 'v '){
            cur_obj.numVertices++;
        }
        if(cur_obj && str_val == 'vn'){
            cur_obj.numNormals++;
        }
        if(cur_obj && str_val == 'vt'){
            cur_obj.numUVs++;
        }
    }
    for(obj in objects){
        cur_obj = objects[obj];
        cur_obj.vertices = new Float32Array(cur_obj.numVertices*3);
        if(cur_obj.numNormals){
            cur_obj.normals = new Float32Array(cur_obj.numNormals*3);
        }
        if(cur_obj.numUVs){
            cur_obj.UVs = new Float32Array(cur_obj.numUVs*2);
        }
    }

    cur_obj = undefined;
    var ivert = 0;
    var iuv = 0;
    var inormal = 0;
    for (i = 0; i < length; i++) {

    }
	
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
