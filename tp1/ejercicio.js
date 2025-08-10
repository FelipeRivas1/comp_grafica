// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)

function index(x, y, width)
{
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
}

function dither(image, factor, algorithm)
{
    for (let y = 0; y < image.height; y++)
    {
        for (let x = 0; x < image.width; x++)
        {
            var indices = index(x, y, image.width);
            var old_pixel = [image.data[indices[0]], image.data[indices[1]], image.data[indices[2]], image.data[indices[3]]];
            var new_pixel = find_closest_palette_color(old_pixel, factor)
            var quant_error = []

            // error
            for (let i = 0; i < 3; i++) {
                quant_error.push(old_pixel[i] - new_pixel[i]);
            }

            // Actualizo la img
            for (let i = 0; i < 3; i++){
                image.data[indices[i]] = new_pixel[i]
            }
            
            // indices
            var i_xm1 = index(x+1, y, image.width)
            var i_xm2 = index(x+2, y, image.width)
            var i_xme2_ym1 = index(x-2, y+1, image.width)
            var i_xme1_ym1 = index(x-1, y+1, image.width)
            var i_x_ym1 = index(x, y+1, image.width)
            var i_xm1_ym1 = index(x+1, y+1, image.width)
            var i_xm2_ym1 = index(x+2, y+1, image.width)
            var i_xme2_ym2 = index(x-2, y+2, image.width)
            var i_xme1_ym2 = index(x-1, y+2, image.width)
            var i_x_ym2 = index(x, y+2, image.width)
            var i_xm1_ym2 = index(x+1, y+2, image.width)
            var i_xm2_ym2 = index(x+2, y+2, image.width)

            if (algorithm === "floyd-steinberg"){
                actualizar_pesos(image, i_xm1, 7/16, quant_error)
                actualizar_pesos(image, i_xme1_ym1, 3/16, quant_error)
                actualizar_pesos(image, i_x_ym1, 5/16, quant_error)
                actualizar_pesos(image, i_xm1_ym1, 1/16, quant_error)

            } else {
                actualizar_pesos(image, i_xm1, 7/48, quant_error)
                actualizar_pesos(image, i_xm2, 5/48, quant_error)
                actualizar_pesos(image, i_xme2_ym1, 3/48, quant_error)
                actualizar_pesos(image, i_xme1_ym1, 5/48, quant_error)
                actualizar_pesos(image, i_x_ym1, 7/48, quant_error)
                actualizar_pesos(image, i_xm1_ym1, 5/48, quant_error)
                actualizar_pesos(image, i_xm2_ym1, 3/48, quant_error)
                actualizar_pesos(image, i_xme2_ym2, 1/48, quant_error)
                actualizar_pesos(image, i_xme1_ym2, 3/48, quant_error)
                actualizar_pesos(image, i_x_ym2, 5/48, quant_error)
                actualizar_pesos(image, i_xm1_ym2, 3/48, quant_error)
                actualizar_pesos(image, i_xm2_ym2, 1/48, quant_error)

            }
        }
    }
}

function actualizar_pesos(image, indices, multiplicador, quant_error){
    for (let i = 0; i < 3; i++){
        image.data[indices[i]] = image.data[indices[i]] + quant_error[i] * multiplicador
    }

}

function find_closest_palette_color(pixel, factor)
{
    var r = pixel[0];
    var g = pixel[1];
    var b = pixel[2];

    let intensidad = [];
    for (let i = 0; i <= factor; i++){
        intensidad.push(Math.ceil((i/factor) * 255));
    }
    var new_r = 1e10;
    var new_g = 1e10;
    var new_b = 1e10;
    var lowest_value_r = 1e10;
    var lowest_value_g = 1e10;
    var lowest_value_b = 1e10;


    for (n in intensidad){
        if(Math.abs(r - intensidad[n]) < lowest_value_r){
            lowest_value_r = Math.abs(r - intensidad[n]);
            new_r = intensidad[n];
        }
        
        if(Math.abs(g - intensidad[n]) < lowest_value_g){
            lowest_value_g = Math.abs(g - intensidad[n]);
            new_g = intensidad[n];
        }

        if(Math.abs(b - intensidad[n]) <  lowest_value_b){
            lowest_value_b = Math.abs(b - intensidad[n])
            new_b = intensidad[n];
        }
    }
    let new_pixel = [new_r, new_g, new_b, pixel[3]];
    return new_pixel
}


// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA,imageB,result){
    for (let y = 0; y < imageA.height; y++)
    {
        for (let x = 0; x < imageA.width; x++)
        { 
            var indices = index(x, y, imageA.width)

            var pixel_A = [imageA.data[indices[0]], imageA.data[indices[1]], imageA.data[indices[2]], imageA.data[indices[3]]];
            var pixel_B = [imageB.data[indices[0]], imageB.data[indices[1]], imageB.data[indices[2]], imageB.data[indices[3]]];
            
            result.data[indices[0]] = pixel_A[0] - pixel_B[0] //R
            result.data[indices[1]] = pixel_A[1] - pixel_B[1] //G
            result.data[indices[2]] = pixel_A[2] - pixel_B[2] //B

        }
    }
}

