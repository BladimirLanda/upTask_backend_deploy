//UTILS JSON WEB TOKEN
import jwt from 'jsonwebtoken' //npm i jsonwebtoken + npm i -D @types/jsonwebtoken

/*
JSON Web Token (JWT)
Un JSON Web Token (JWT) es un token seguro y compacto que se usa para transmitir 
información entre dos partes (por ejemplo, entre un frontend y un backend) de 
forma segura y verificable.

👉 Se usa principalmente para autenticación.
Cuando un usuario inicia sesión, el servidor genera un JWT, se lo envía al 
cliente, y ese token se usa en las siguientes peticiones para probar que 
ese usuario está autenticado.

📌 ¿Cómo está compuesto un JWT?
Un JWT consta de 3 partes separadas por puntos .: xxxxx.yyyyy.zzzzz

1️⃣ Header (Encabezado)
Indica el tipo de token y el algoritmo de firma.
{
  "alg": "HS256",
  "typ": "JWT"
}

2️⃣ Payload (Carga útil)
Contiene los datos que se desean transmitir, llamados claims (pueden ser datos 
de usuario, fecha de expiración, permisos, etc).
{
  "userId": "abc123",
  "role": "admin",
  "iat": 1717888000 //indica cuándo se generó el token.
  "exp": 1718888000 //indica la expiración del token
}
NOTA: ⚠️ Aunque está codificado en Base64, no está cifrado.
Se puede decodificar fácil, por eso nunca se deben guardar contraseñas o 
datos ultra sensibles ahí.


3️⃣ Signature (Firma)
Sirve para verificar que el token no ha sido alterado. Se genera combinando:
    -el header,
    -el payload, y
    -una clave secreta del servidor.
Así se asegura que si alguien manipula el token, la firma ya no coincide.

📌 ¿Cómo funciona en un flujo típico?
1️⃣ El usuario inicia sesión (envía email y password).
2️⃣ Si es correcto, el servidor genera un JWT y lo devuelve.
3️⃣ El cliente guarda ese token (usualmente en localStorage, sessionStorage o una cookie).
4️⃣ En cada petición siguiente, el cliente manda el token en los headers:
    'Authorization: Bearer eyJhbGciOi...'
5️⃣ El backend verifica el token y si es válido, permite la acción.

https://jwt.io/
*/

//Type
type UserPayload = {
    id: string
}

export const generateJWT = (payload : UserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    
    return token;
}


