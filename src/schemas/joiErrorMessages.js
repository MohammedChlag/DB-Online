export const joiErrorMessages = {
	'any.required': 'El campo "{#key}" es obligatorio',
	'string.base': 'El valor de "{#key}" debe ser una cadena',
	'string.empty': 'El campo "{#key}" no debe estar vacío',
	'number.base': 'El valor de "{#key}" debe ser un número',
	'number.max': 'El archivo no debe exceder los 5 MB',
	'number.min': 'El archivo debe tener al menos 1 byte',
	'object.base': 'El valor de "{#key}" debe ser un objeto',
	'any.only': 'Solo se permiten fotos jpeg o png',
	'string.email': 'Correo electrónico inválido',
	'string.pattern.base':
		'Al menos una mayúscula, una minúscula, un número y un caracter especial',
	'string.min': 'El campo "{#key}" debe tener al menos {#limit} caracteres',
	'string.max': 'El campo "{#key}" no debe exceder los {#limit} caracteres',
	'object.unknown': 'No se permiten campos adicionales en este objeto',
};

// any.required: Se aplicará cuando el campo sea requerido y no se haya proporcionado.
// string.base: Se aplicará cuando el valor no sea una cadena.
// string.empty: Se aplicará cuando el valor sea una cadena vacía.
// number.base: Se aplicará cuando el valor no sea un número.
// number.max: Se aplicará cuando el tamaño del archivo exceda el límite.
// number.min: Se aplicará cuando el tamaño del archivo sea menor al límite.
// object.base: Se aplicará cuando el valor no sea un objeto.
// any.only: Se aplicará cuando el archivo no sea jpeg o png.
// string.email: Se aplicará cuando el correo electrónico no sea válido.
// string.pattern.base: Se aplicará cuando la contraseña no cumpla con los requisitos.
// string.min: Se aplicará cuando el valor sea menor al límite.
// string.max: Se aplicará cuando el valor sea mayor al límite.
// object.unknown: Se aplicará cuando se envíen campos adicionales no permitidos.
