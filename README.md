
# Tetris

This is a Tetris game written in TypeScript with React.

## Logic

### Mostrar la nueva pieza en el tablero

Dado el tablero y la pieza actual, elegida aleatoriamente. Esta debe mostrarse en el tablero.
La pieza actual se representa como un array de arrays de 0 y 1, donde 1 representa una celda ocupada por la pieza.

```javascript
[[0, 1, 1, 0], 
 [0, 1, 0, 0],
 [0, 1, 0, 0],
 [0, 0, 0, 0]]

[[0, 0, 0, 0],
 [0, 1, 1, 1],
 [0, 0, 0, 1],
 [0, 0, 0, 0]]

[[0, 0, 0, 0],
 [0, 0, 1, 0],
 [0, 0, 1, 0],
 [0, 1, 1, 0]]

[[0, 0, 0, 0],
 [1, 0, 0, 0],
 [1, 1, 1, 0],
 [0, 0, 0, 0]]
```

Primero obtener los indices donde hay unos en la pieza actual, por ejemplo, en la pieza 2:

```javascript
[[0, 1, 1, 0],
 [0, 0, 1, 1],
 [0, 0, 0, 0],
 [0, 0, 0, 0]]
```

Los indices son:

```javascript
[[0, 1], [0, 2], [1, 2], [1, 3]]
```

Eliminando los posibles espacios vacios de la parte superior y la izquierda, se obtiene:

```javascript
[[ 1, 1, 0],
 [ 0, 1, 1],
 [ 0, 0, 0],
 [ 0, 0, 0]]
```

```javascript
[[0, 0], [0, 1], [1, 1], [1, 2]]
```

La pieza aparecera en la parte superior del tablero, en el centro.

```javascript
[[0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
```

Las coordenadas para la pieza actual serian:

```javascript
[[PY, (BW/2 - 1 + PX)], [PY, (BW/2 - 1 + PX)], [PY, (BW/2 - 1 + PX)], [PY, (BW/2 - 1 + PX)]]
```

Para las piezas con un ancho de 3, se debe restar 1 a la posición X de la pieza actual, para las piezas con un ancho de 4, se debe restar 2 a la posición X de la pieza actual para que aparezca en el centro del tablero.

Si el ancho de la pieza es igual a 3:

```javascript
[[PY, (BW/2 - 1 + PX - 1)], [PY, (BW/2 - 1 + PX - 1)], [PY, (BW/2 - 1 + PX - 1)], [PY, (BW/2 - 1 + PX - 1)]]
```

Si el ancho de la pieza es igual a 4:

```javascript
[[PY, (BW/2 - 1 + PX - 2)], [PY, (BW/2 - 1 + PX - 2)], [PY, (BW/2 - 1 + PX - 2)], [PY, (BW/2 - 1 + PX - 2)]]
```

Luego, se debe comprobar que no haya ninguna pieza en el tablero en esos indices, si hay alguna, se debe terminar el juego.

En caso no haber ninguna pieza en esos indices, se debe mostrar la pieza en el tablero.

Para esta pieza en cuestión el tablero quedaria de esta forma:

```javascript
[[0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
```

### Mover la pieza de izquierda a derecha

La pieza actual se debe mover de izquierda a derecha en el tablero. Para esto, se debe presionar la flecha izquierda o derecha del teclado para realizar el respectivo desplazamiento.

Suponiendo que la pieza actual se encuentra en la posición:

```javascript
[[0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
```

Siendo las coordenadas de la pieza en el tablero:

```javascript
[[0, 3], [0, 4], [1, 4], [1, 5]]
```

En caso de haber sido presionada la flecha izquierda, la pieza debe desplazarse una posición a la izquierda, siempre y cuando no haya otra pieza o los bordes del tablero en esa posición.

Para comprobar si la pieza se encuentra en un borde o si hay otra pieza en la posición a la que se quiere mover, se debe restar una unidad a PX (Piece X) y comprobar si la posición resultante es válida.

Quedando las coordenadas de la pieza en el tablero:

```javascript
[[0, 2], [0, 3], [1, 3], [1, 4]]
```

Para comprobar si hay una pieza en la posición a la que se quiere mover, se debe comprobar si el valor en la posición resultante es igual a 1.

Para comprobar si la pieza se encuentra en un borde lateral, se debe comprobar si el eje X de la pieza en el tablero son menores a 0.

Para comprobar si la pieza se encuentra en el borde inferior del tablero, se debe comprobar si el eje Y de la pieza en el tablero es mayor a BH (Board Height).

En caso cumplirse alguna de las condiciones anteriores, la pieza no se debe mover a esa posición.

En caso de estar disponible la posición a la que se quiere mover:

Primero se debe eliminar la pieza de la posición en la que se encuentra actualmente:

```javascript
[[0, 3], [0, 4], [1, 4], [1, 5]]
```

Y luego se debe agregar la pieza en la nueva posición:

```javascript
[[0, 2], [0, 3], [1, 3], [1, 4]]
```

Es proceso será el mismo en caso de presionar la flecha derecha del teclado, pero en vez de restar una unidad a PX (Piece X), se le debe sumar una unidad y en vez de comprobar si el eje X de la pieza en el tablero es menor a 0, se debe comprobar si el eje X de la pieza en el tablero es mayor a BW (Board Width).

### Rotar pieza

La pieza actual debe rotar en sentido horario al presionar la flecha arriba del teclado.

Para esto primero se debe realizar una matriz en base a las coordenadas de la pieza actual en el tablero.

Luego, se debe realizar una transpuesta de esa matriz e invertir el orden de las filas.

Suponiendo que la pieza se encuentra en la siguiente posición:

```javascript
[[0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
```

Las coordenadas de la pieza en el tablero serían:

```javascript
[[0, 4], [0, 5], [1, 5], [1, 6]]
```

A partir de esas coordendas se debe generar una matriz de PW x PH (Piece Width x Piece Height) con los valores de la matriz del tablero, en este caso:

```javascript
[[1, 1, 0],
 [0, 1, 1],
 [0, 0, 0]]
```

Las coordenadas de la pieza en la matriz serían:

```javascript
[[0, 0], [0, 1], [1, 1], [1, 2]]
```

Haciendo la matriz transpuesta e invirtiendo el orden de las filas, se obtiene:

```javascript
[[0, 0, 1],
 [0, 1, 1],
 [0, 1, 0]]
```

Cuyas coordenadas serían:

```javascript
[[0, 2], [1, 1], [1, 2], [2, 1]]
```

Para obtener las nuevas coordenadas para la pieza rotada en el tablero, tenemos que restarle a las coordenadas originales de la pieza en el tablero, las coordenadas de la matriz de la pieza original y sumarle las coordenadas de la matriz traspuesta, quedando:

```javascript
[[0, 4], [0, 5], [1, 5], [1, 6]] // Coordenadas originales de la pieza en el tablero
-
[[0, 0], [0, 1], [1, 1], [1, 2]] // Coordenadas de la matriz de la pieza original
+
[[0, 2], [1, 1], [1, 2], [2, 1]] // Coordenadas de la matriz de la pieza original traspuesta e invertida
=
[[0, 6], [1, 5], [1, 6], [2, 5]] // Nuevas coordenadas de la pieza en el tablero
```

Una vez obtenidas las coordenadas de la pieza rotada en el tablero, se debe comprobar que no se salga del tablero y que no haya otra pieza en el lugar donde se quiere rotar.

En caso de que no se pueda rotar la pieza por alguna de las dos razones, se debe dejar la pieza en su posición original.

### Mover la pieza hacia abajo

La pieza actual debe desplazarse hacia abajo automaticamente cada medio segundo.

Debe aplicarse la misma logica del desplazamiento hacia los lados, pero en este caso, se debe sumar 1 a la coordenada Y de la pieza en el tablero.

Si la coordenada donde la pieza quiere posicionarse está ocupada por otra pieza, se debe dejar la pieza en su posición original y generar una nueva pieza.

Al alcanzar el fondo del tablero, la pieza debe quedar fija en su posición y generar una nueva pieza.

### Eliminar filas completas

Cuando una fila se completa, se debe eliminar y desplazar las filas superiores hacia abajo.

Suponiendo que el tablero es de esta forma:

```javascript
[[0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
 [0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [0, 0, 1, 0, 1, 0, 1, 0, 0, 0]]
```

Las filas con indice 16 y 18 deben limpiarse.

### Hacer un hard drop

Cuando se presiona la tecla de espacio, la pieza debe caer hasta el fondo del tablero o hasta que choque con otra pieza.

Dado el tablero:

```javascript
[[0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
 [0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [0, 0, 1, 0, 1, 0, 1, 0, 0, 0]]
```

La posición actual de la pieza en el tablero es:

```javascript
[[0, 4], [0, 5], [1, 5], [1, 6]]
```

Al presionar el espacio se debe restar el valor Y de la posición de la pieza y verificar que no haya colisión con otra pieza o el fondo.

Esto se debe repetir hasta que la pieza choque con otra pieza o el fondo.

PX = Piece X = [[0, 0], [0, 1], [1, 1], [1, 2]] (Piece indices without blank spaces)
                    ^       ^       ^       ^
PY = Piece Y = [[0, 0], [0, 1], [1, 1], [1, 2]] (Piece indices without blank spaces)
                 ^       ^       ^       ^
PH = Piece Height = 2
PW = Piece Width = 3
BW = Board Width = 12
BH = Board Height = 22
N = Number between 0 and 9 = 0
