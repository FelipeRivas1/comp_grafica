// Esta función construye una matriz de transfromación de 3x3 en coordenadas homogéneas 
// utilizando los parámetros de posición, rotación y escala. La estructura de datos a 
// devolver es un arreglo 1D con 9 valores en orden "column-major". Es decir, para un 
// arreglo A[] de 0 a 8, cada posición corresponderá a la siguiente matriz:
//
// | A[0] A[3] A[6] |
// | A[1] A[4] A[7] |
// | A[2] A[5] A[8] |
// 
// Se deberá aplicar primero la escala, luego la rotación y finalmente la traslación. 
// Las rotaciones vienen expresadas en grados. 
function BuildTransform( positionX, positionY, rotation, scale )
{
	var rad = Math.PI / 180;
	rotation = rotation * rad;

	var S = Array(scale, 0, 0, 0, scale, 0, 0, 0, 1);

	var R = Array(Math.cos(rotation),Math.sin(rotation), 0, -1 * Math.sin(rotation), Math.cos(rotation), 0, 0, 0, 1)
	
	var T = Array(1, 0, 0, 0, 1, 0, positionX, positionY, 1); 

	var TxS = ComposeTransforms(T, S);
	var TxSxR = ComposeTransforms(TxS, R);

	return TxSxR;
}

// Esta función retorna una matriz que resulta de la composición de trasn1 y trans2. Ambas 
// matrices vienen como un arreglo 1D expresado en orden "column-major", y se deberá 
// retornar también una matriz en orden "column-major". La composición debe aplicar 
// primero trans1 y luego trans2. 
function ComposeTransforms(trans1, trans2)
{
	matriz_res = Array(0,0,0,0,0,0,0,0,0);

	// trans1 * trans2 = trans3 --> trnas3[i,j] = SUM(trans1[i,k] * trans2[k,j]) para todo k < 3

	for ( let i = 0; i < 3; i++){
		for (let j = 0; j < 3; j++){
			let suma = 0
			for(let k = 0; k < 3; k ++){

				let trans1_ik = trans1[k * 3 + i] 
				let trans2_kj = trans2[j * 3 + k]
				suma += trans1_ik * trans2_kj 
			}

			matriz_res[j * 3 + i] = suma;
		}
	}
	
	return matriz_res;
	
}


