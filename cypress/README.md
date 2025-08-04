# Tests E2E con Cypress

Este directorio contiene los tests end-to-end (E2E) de la aplicación usando Cypress.

## Estructura

```
cypress/
├── e2e/                    # Tests E2E
│   ├── home.cy.ts         # Tests de la página principal
│   ├── search.cy.ts       # Tests de búsqueda de productos
│   └── product-detail.cy.ts # Tests de detalle de producto
├── fixtures/              # Datos de prueba
│   └── products.json      # Datos de productos para los tests
├── support/               # Archivos de soporte
│   ├── commands.ts        # Comandos personalizados
│   └── e2e.ts            # Configuración de soporte
└── README.md             # Esta documentación
```

## Comandos disponibles

### Ejecutar tests E2E
```bash
# Ejecutar todos los tests E2E en modo headless
npm run test:e2e

# Abrir Cypress Test Runner (interfaz gráfica)
npm run test:e2e:open

# Ejecutar Cypress directamente
npm run cypress:run
npm run cypress:open
```

### Ejecutar tests específicos
```bash
# Ejecutar solo tests de la página principal
npx cypress run --spec "cypress/e2e/home.cy.ts"

# Ejecutar solo tests de búsqueda
npx cypress run --spec "cypress/e2e/search.cy.ts"
```

## Configuración

- **Base URL**: `http://localhost:5173` (configurado en `cypress.config.ts`)
- **Viewport**: 1280x720 por defecto
- **Timeouts**: 10 segundos para comandos y requests

## Tests incluidos

### 1. Página Principal (`home.cy.ts`)
- Carga correcta de la página
- Visualización del banner
- Funcionalidad de la barra de búsqueda
- Navegación a página de productos
- Responsive design

### 2. Búsqueda de Productos (`search.cy.ts`)
- Búsqueda exitosa con resultados
- Búsqueda sin resultados
- Estados de carga (spinner)
- Manejo de errores de API
- Actualización del breadcrumb
- Búsqueda con Enter
- Limpieza de búsqueda

### 3. Detalle de Producto (`product-detail.cy.ts`)
- Carga del detalle del producto
- Información del vendedor
- Descripción del producto
- Estados de carga
- Manejo de productos no encontrados
- Errores de red
- Navegación desde lista de productos
- Actualización del breadcrumb
- Responsive design

## Comandos personalizados

### `cy.searchProducts(searchTerm)`
Busca productos usando el término especificado.

### `cy.waitForPageLoad()`
Espera a que la página termine de cargar (spinner desaparece).

### `cy.checkElementVisible(selector)`
Verifica que un elemento sea visible y clickeable.

## Datos de prueba

Los datos de prueba están en `cypress/fixtures/products.json` e incluyen:
- Resultados de búsqueda con productos de ejemplo
- Detalle completo de un producto
- Respuestas vacías para casos de no resultados

## Interceptación de API

Los tests interceptan las llamadas a la API para:
- Mockear respuestas consistentes
- Simular diferentes estados (carga, error, sin resultados)
- Controlar el timing de las respuestas


## Troubleshooting

### Problemas comunes

1. **Tests fallan porque la app no está corriendo**
   - Asegúrate de que la aplicación esté corriendo en `http://localhost:5173`
   - Ejecuta `npm start` en el directorio client

2. **Tests fallan por timeouts**
   - Verifica que la API esté respondiendo correctamente
   - Ajusta los timeouts en `cypress.config.ts` si es necesario

3. **Elementos no encontrados**
   - Verifica que los `data-testid` estén presentes en los componentes
   - Asegúrate de que la aplicación esté renderizando correctamente

### Debugging

Para debuggear tests:

```bash
# Ejecutar con interfaz gráfica
npm run test:e2e:open

# Ejecutar con logs detallados
DEBUG=cypress:* npm run test:e2e
``` 