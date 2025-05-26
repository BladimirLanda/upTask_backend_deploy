//UTILS AUTH
import bcrypt from 'bcrypt' //npm i bcrypt + npm i -D @types/bcrypt

/*
bcrypt
bcrypt es una librería para hashear contraseñas.
Hashear significa convertir una contraseña en un valor irreconocible 
e irreversible (una cadena de texto codificada).
Esto se hace para guardar contraseñas de forma segura en una base de datos.

    -Usa un salt (una cadena aleatoria extra) para evitar ataques por tablas 
    precalculadas (rainbow tables).
    -Permite definir la complejidad del hasheo con un número de rondas 
    (entre más rondas, más seguro, pero más tarda).

👉 bcrypt.genSalt(10)
Genera un salt aleatorio.
El número 10 indica cuántas rondas de procesamiento tendrá el algoritmo.
A más rondas → más seguro pero más lento.

👉 bcrypt.hash(password, salt)
Combina el password recibido con ese salt.
Le aplica un algoritmo hash con varias rondas de procesamiento.
Devuelve una cadena irreconocible.

👉 bcrypt.compare(password, hash)
Compara una contraseña en texto plano con una contraseña previamente hasheada
No desencripta el hash (porque bcrypt es un algoritmo de hashing, no de cifrado reversible)
Lo que hace es hashear el enteredPassword internamente con la misma configuración (salt rounds) 
y luego compara el resultado contra storedHash.
✅ Si coinciden → devuelve true
✅ Si no → devuelve false
*/
export const hashPassword = async (password : string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const checkPassword = async (enteredPassword : string, storedHash : string) => {
    return await bcrypt.compare(enteredPassword, storedHash);
} 