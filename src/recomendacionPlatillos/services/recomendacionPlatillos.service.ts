// src/asistente/asistente.service.ts
import { Injectable } from '@nestjs/common';
import { ProductoService } from '../../productos/productoService/productos.service';
import { Producto } from '../../productos/productosEntities/producto.entity';

interface AnalisisPregunta {
  // Tipos de comida
  vegetariano: boolean;
  pollo: boolean;
  carne: boolean;
  pescado: boolean;
  cerdo: boolean;
  pasta: boolean;
  ensalada: boolean;
  sopa: boolean;

  // Características
  economico: boolean;
  caro: boolean;
  especialidad: boolean;
  picante: boolean;
  rapido: boolean;
  ligero: boolean;
  pesado: boolean;
  saludable: boolean;

  // Ocasiones
  ninos: boolean;
  compartir: boolean;
  desayuno: boolean;
  comida: boolean;
  cena: boolean;

  // Bebidas
  bebida: boolean;
  cafe: boolean;
  jugo: boolean;
  refresco: boolean;

  // General
  listarTodo: boolean;
  preguntaGenerica: boolean;
}

@Injectable()
export class AsistenteService {
  constructor(private readonly productoService: ProductoService) {}

  async obtenerRecomendacion(pregunta: string) {
    // Obtener todos los productos activos
    const productos = await this.productoService.findAllActive();

    if (!productos || productos.length === 0) {
      return {
        respuesta:
          'Lo siento, actualmente no tenemos productos disponibles. Por favor intenta más tarde. 😔',
        productos: [],
      };
    }

    // Analizar la pregunta
    const analisis = this.analizarPregunta(pregunta);

    // Filtrar y ordenar productos
    const productosFiltrados = this.filtrarProductos(
      productos,
      analisis,
      pregunta,
    );

    // Generar respuesta natural
    const respuesta = this.generarRespuesta(
      productosFiltrados,
      analisis,
      pregunta,
    );

    return {
      respuesta,
      productos: productosFiltrados,
    };
  }

  private analizarPregunta(pregunta: string): AnalisisPregunta {
    const p = pregunta.toLowerCase();

    return {
      // Tipos de comida
      vegetariano:
        /vegetarian[oa]?|veggie|sin carne|plant|verduras|vegetal/i.test(p),
      pollo: /pollo|chicken|ave|alitas|pechuga/i.test(p),
      carne: /carne|res|beef|bistec|hamburguesa|asado/i.test(p),
      pescado:
        /pescado|mariscos|fish|camarón|camarones|atún|salmón|filete de pescado/i.test(
          p,
        ),
      cerdo: /cerdo|puerco|tocino|jamón|costillas/i.test(p),
      pasta: /pasta|espagueti|fettuccine|lasaña|ravioli|tallarines/i.test(p),
      ensalada: /ensalada|salad|verde|lechuga/i.test(p),
      sopa: /sopa|caldo|consomé|crema/i.test(p),

      // Características
      economico:
        /económico|barato|más barato|económica|precio bajo|bajo costo|accesible|económicos/i.test(
          p,
        ),
      caro: /caro|costoso|premium|lujo|exclusivo/i.test(p),
      especialidad:
        /especialidad|mejor|recomend|famoso|estrella|popular|más vendido|signature/i.test(
          p,
        ),
      picante: /picante|chile|spicy|enchilado|ardiente|hot/i.test(p),
      rapido: /rápido|prisa|quick|express|tiempo|apurado|urgente/i.test(p),
      ligero: /ligero|light|liviano|pequeño|poco/i.test(p),
      pesado: /pesado|llenador|abundante|grande|mucho/i.test(p),
      saludable:
        /saludable|healthy|dieta|fitness|bajo en calorías|nutritivo/i.test(p),

      // Ocasiones
      ninos: /niño|niña|pequeño|kid|infantil|children/i.test(p),
      compartir: /compartir|familia|grupo|varios|para todos/i.test(p),
      desayuno: /desayuno|mañana|breakfast/i.test(p),
      comida: /comida|almuerzo|lunch|mediodía/i.test(p),
      cena: /cena|noche|dinner/i.test(p),

      // Bebidas
      bebida: /bebida|tomar|drink|líquido/i.test(p),
      cafe: /café|capuchino|espresso|latte/i.test(p),
      jugo: /jugo|juice|licuado|smoothie/i.test(p),
      refresco: /refresco|soda|gaseosa/i.test(p),

      // General
      listarTodo:
        /todos|todo|qué hay|qué tienen|mostrar|ver todo|menú completo|disponible/i.test(
          p,
        ),
      preguntaGenerica: /hola|hey|buenas|ayuda|recomienda algo/i.test(p),
    };
  }

  private filtrarProductos(
    productos: Producto[],
    analisis: AnalisisPregunta,
    preguntaOriginal: string,
  ): Producto[] {
    let productosFiltrados = [...productos];
    let palabrasClave: string[] = [];

    // Extraer palabras clave de la pregunta
    const palabras = preguntaOriginal.toLowerCase().split(/\s+/);
    palabrasClave = palabras.filter((p) => p.length > 3);

    // Calcular puntuación para cada producto
    const productosConPuntuacion = productosFiltrados.map((producto) => ({
      producto,
      puntuacion: this.calcularPuntuacion(producto, analisis, palabrasClave),
    }));

    // Ordenar por puntuación
    productosConPuntuacion.sort((a, b) => b.puntuacion - a.puntuacion);

    // Filtrar productos con puntuación > 0 o retornar los mejores
    const conPuntuacion = productosConPuntuacion.filter(
      (p) => p.puntuacion > 0,
    );

    if (conPuntuacion.length > 0) {
      productosFiltrados = conPuntuacion.slice(0, 5).map((p) => p.producto);
    } else if (analisis.economico) {
      // Si pregunta por económicos, ordenar por precio
      productosFiltrados = productos
        .sort((a, b) => a.precio - b.precio)
        .slice(0, 5);
    } else if (analisis.caro || analisis.especialidad) {
      // Si pregunta por caros/especialidad, ordenar por precio descendente
      productosFiltrados = productos
        .sort((a, b) => b.precio - a.precio)
        .slice(0, 5);
    } else if (analisis.listarTodo) {
      // Mostrar todos los productos disponibles
      productosFiltrados = productos.slice(0, 10);
    } else {
      // Por defecto, mostrar los primeros 5
      productosFiltrados = productos.slice(0, 5);
    }

    return productosFiltrados;
  }

  private calcularPuntuacion(
    producto: Producto,
    analisis: AnalisisPregunta,
    palabrasClave: string[],
  ): number {
    let puntos = 0;
    const texto =
      `${producto.nombre} ${producto.descripcion || ''} ${producto.subcategoria?.nombre || ''}`.toLowerCase();

    // Puntos por coincidencia de palabras clave directas
    palabrasClave.forEach((palabra) => {
      if (texto.includes(palabra)) {
        puntos += 5;
      }
    });

    // Puntos por categorías
    if (
      analisis.vegetariano &&
      /vegetarian|veggie|verduras|ensalada|vegetal/i.test(texto)
    ) {
      puntos += 10;
    }

    if (analisis.pollo && /pollo|chicken|ave|alitas|pechuga/i.test(texto)) {
      puntos += 10;
    }

    if (analisis.carne && /carne|res|beef|bistec|hamburguesa/i.test(texto)) {
      puntos += 10;
    }

    if (
      analisis.pescado &&
      /pescado|mariscos|fish|camarón|atún|salmón/i.test(texto)
    ) {
      puntos += 10;
    }

    if (analisis.cerdo && /cerdo|puerco|tocino|jamón|costillas/i.test(texto)) {
      puntos += 10;
    }

    if (
      analisis.pasta &&
      /pasta|espagueti|fettuccine|lasaña|tallarines/i.test(texto)
    ) {
      puntos += 10;
    }

    if (analisis.ensalada && /ensalada|salad|verde|lechuga/i.test(texto)) {
      puntos += 10;
    }

    if (analisis.sopa && /sopa|caldo|consomé|crema/i.test(texto)) {
      puntos += 10;
    }

    // Puntos por características
    if (analisis.picante && /picante|chile|enchilado|spicy/i.test(texto)) {
      puntos += 8;
    }

    if (analisis.ligero && /ligero|light|ensalada|saludable/i.test(texto)) {
      puntos += 8;
    }

    if (
      analisis.saludable &&
      /saludable|healthy|ensalada|verduras|light/i.test(texto)
    ) {
      puntos += 8;
    }

    // Puntos por bebidas
    if (analisis.bebida && /bebida|jugo|café|refresco|agua|té/i.test(texto)) {
      puntos += 10;
    }

    if (analisis.cafe && /café|capuchino|espresso|latte/i.test(texto)) {
      puntos += 10;
    }

    if (analisis.jugo && /jugo|juice|licuado|smoothie/i.test(texto)) {
      puntos += 10;
    }

    return puntos;
  }

  private generarRespuesta(
    productos: Producto[],
    analisis: AnalisisPregunta,
    preguntaOriginal: string,
  ): string {
    let respuesta = '';

    // Saludo personalizado basado en el análisis
    if (analisis.vegetariano) {
      respuesta =
        '🌱 ¡Perfecto! Aquí están nuestras deliciosas opciones vegetarianas:\n\n';
    } else if (analisis.economico) {
      respuesta =
        '💰 ¡Excelente elección! Aquí están nuestras mejores opciones económicas:\n\n';
    } else if (analisis.especialidad) {
      respuesta =
        '⭐ ¡Con mucho gusto! Estas son nuestras especialidades de la casa:\n\n';
    } else if (analisis.picante) {
      respuesta =
        '🔥 ¡Para los valientes! Aquí están nuestros platillos picantes:\n\n';
    } else if (analisis.rapido) {
      respuesta = '⏱️ ¡Perfecto! Estos platillos se preparan rápidamente:\n\n';
    } else if (analisis.ligero || analisis.saludable) {
      respuesta = '🥗 ¡Excelente opción saludable! Te recomiendo:\n\n';
    } else if (analisis.pollo) {
      respuesta = '🍗 ¡Aquí están nuestros deliciosos platillos con pollo!\n\n';
    } else if (analisis.carne) {
      respuesta =
        '🥩 ¡Para los amantes de la carne! Aquí están nuestras opciones:\n\n';
    } else if (analisis.pescado) {
      respuesta =
        '🐟 ¡Excelente elección! Nuestros platillos de pescado y mariscos:\n\n';
    } else if (analisis.pasta) {
      respuesta = '🍝 ¡Deliciosas pastas! Aquí están nuestras opciones:\n\n';
    } else if (analisis.ensalada) {
      respuesta = '🥗 ¡Frescas ensaladas! Aquí están nuestras opciones:\n\n';
    } else if (analisis.bebida || analisis.cafe || analisis.jugo) {
      respuesta = '🥤 ¡Aquí están nuestras bebidas disponibles!\n\n';
    } else if (analisis.ninos) {
      respuesta =
        '👶 ¡Perfecto para los pequeños! Estas opciones les encantarán:\n\n';
    } else if (analisis.desayuno) {
      respuesta =
        '🌅 ¡Buenos días! Aquí están nuestras opciones para el desayuno:\n\n';
    } else if (analisis.listarTodo) {
      respuesta = '📋 ¡Aquí está nuestro menú disponible!\n\n';
    } else {
      respuesta =
        '😊 ¡Con gusto te ayudo! Basándome en tu pregunta, te recomiendo:\n\n';
    }

    // Listar productos
    if (productos.length > 0) {
      productos.forEach((producto, index) => {
        respuesta += `${index + 1}. **${producto.nombre}** - $${producto.precio.toFixed(2)}\n`;

        if (producto.descripcion) {
          respuesta += `   📝 ${producto.descripcion}\n`;
        }

        if (producto.subcategoria?.nombre) {
          respuesta += `   🏷️ Categoría: ${producto.subcategoria.nombre}\n`;
        }

        if (
          producto.disponibilidad !== null &&
          producto.disponibilidad !== undefined
        ) {
          if (producto.disponibilidad > 10) {
            respuesta += `   ✅ Disponible\n`;
          } else if (producto.disponibilidad > 0) {
            respuesta += `   ⚠️ Pocas unidades disponibles\n`;
          } else {
            respuesta += `   ❌ Agotado temporalmente\n`;
          }
        }

        respuesta += '\n';
      });

      // Mensaje de cierre personalizado
      if (analisis.economico) {
        respuesta +=
          '💡 Tip: Estos son nuestros platillos con mejor relación calidad-precio.\n\n';
      } else if (analisis.especialidad) {
        respuesta +=
          '💡 Tip: Estos platillos son los favoritos de nuestros clientes.\n\n';
      }

      respuesta +=
        '¿Te gustaría saber más detalles sobre alguno de estos platillos? 😊';
    } else {
      respuesta +=
        '😔 Lo siento, no encontré platillos que coincidan exactamente con tu búsqueda.\n\n';
      respuesta +=
        '¿Podrías ser más específico o preguntar por otro tipo de platillo? Por ejemplo:\n';
      respuesta += '• "¿Qué opciones vegetarianas tienen?"\n';
      respuesta += '• "¿Cuál es el platillo más económico?"\n';
      respuesta += '• "¿Tienen platillos con pollo?"\n';
      respuesta += '• "Mostrar todo el menú"';
    }

    return respuesta;
  }
}
