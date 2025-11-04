# 🎨 Guía de Estilo Visual - FinanceApp

Esta guía define el lenguaje visual de la aplicación basado en referencias de diseño moderno de apps financieras.

## 🌈 Paleta de Colores

### Colores Principales
- **Primary (Amarillo Neón)**: `#C8FF00` - Usado para CTAs principales, destacados y elementos interactivos
- **Black**: `#000000` - Texto principal, elementos de alto contraste
- **White**: `#FFFFFF` - Backgrounds principales, texto inverso

### Grises (Jerarquía Visual)
- **Gray 50-100**: Backgrounds secundarios, áreas sutiles
- **Gray 200-300**: Borders, divisores, estados deshabilitados
- **Gray 500-700**: Texto secundario, iconos
- **Gray 800-900**: Texto terciario, elementos oscuros

### Colores de Estado
- **Success**: `#00C853` - Verde vibrante para operaciones exitosas
- **Error**: `#FF3B30` - Rojo para errores y eliminaciones
- **Warning**: `#FFB300` - Amarillo/naranja para advertencias
- **Info**: `#2196F3` - Azul para información

### Colores de Categorías
- **Comida**: `#FF6B6B` (Rojo coral)
- **Transporte**: `#4ECDC4` (Turquesa)
- **Entretenimiento**: `#95E1D3` (Menta)
- **Compras**: `#F38181` (Rosa salmón)
- **Salud**: `#A8E6CF` (Verde menta)
- **Educación**: `#FFD3B6` (Durazno)

## 📐 Principios de Diseño

### 1. Minimalismo Vibrante
- Combinar espacios amplios y limpios con acentos de color vibrante
- Usar el amarillo neón (`#C8FF00`) estratégicamente, no en exceso
- Mantener backgrounds principalmente blancos con grises sutiles

### 2. Jerarquía Clara
```
- Título Principal: Bold, 32-40px, Negro
- Subtítulos: SemiBold, 20-24px, Negro
- Cuerpo: Regular/Medium, 14-16px, Gray 700
- Caption: Regular, 12-13px, Gray 500
```

### 3. Espaciado y Respiración
- Padding interno de cards: 16-24px
- Margin entre secciones: 24-32px
- Border radius para cards: 16-24px
- Border radius para botones: 12-16px
- Bottom tab bar padding: Safe area + 8px

### 4. Sombras Sutiles
```javascript
// Sombra ligera (cards)
shadowColor: COLORS.shadow,
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 1,
shadowRadius: 8,
elevation: 2,

// Sombra media (modales)
shadowColor: COLORS.shadowMedium,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 1,
shadowRadius: 12,
elevation: 4,

// Sombra pronunciada (floating buttons)
shadowColor: COLORS.primary,
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.3,
shadowRadius: 16,
elevation: 8,
```

## 🎯 Componentes de Referencia

### Cards
```javascript
// Card estándar (Imagen 2 - minimalista)
{
  backgroundColor: COLORS.white,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: COLORS.border,
  padding: 16,
}

// Card destacado (Imagen 1 - vibrante)
{
  backgroundColor: COLORS.primary,
  borderRadius: 24,
  padding: 24,
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 8,
}

// Card oscuro (Imagen 1 - spending card)
{
  backgroundColor: COLORS.darkCard,
  borderRadius: 20,
  padding: 20,
}
```

### Botones
```javascript
// Botón primario
{
  backgroundColor: COLORS.black,
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 16,
  alignItems: 'center',
}

// Botón secundario
{
  backgroundColor: COLORS.white,
  borderWidth: 2,
  borderColor: COLORS.border,
  paddingVertical: 14,
  paddingHorizontal: 22,
  borderRadius: 16,
}

// Botón de acento (primary action)
{
  backgroundColor: COLORS.primary,
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 16,
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
}
```

### Bottom Navigation
```javascript
// Estilo de Imagen 1 (pills con fondo)
{
  container: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: COLORS.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  inactiveTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  }
}
```

### Iconos
```javascript
// Tamaños estándar
- Small: 16px
- Medium: 20-24px
- Large: 28-32px
- Extra Large: 40-48px

// Colores
- Activo: COLORS.text (negro)
- Inactivo: COLORS.textSecondary (gray)
- Con background: Usar color de categoría
```

## 💡 Tips de Implementación

### 1. Balance de Color
- **80%** Blancos y grises (backgrounds, espacios)
- **15%** Negros (texto, iconos, elementos principales)
- **5%** Amarillo neón (CTAs, highlights, elementos importantes)

### 2. Contraste y Legibilidad
- Nunca poner texto negro sobre amarillo neón
- Siempre usar negro sobre amarillo para CTAs
- Mantener ratio de contraste WCAG AA (4.5:1 mínimo)

### 3. Estados Interactivos
```javascript
// Pressed state
activeOpacity: 0.7

// Disabled state
opacity: 0.5

// Focus/Selected state
borderColor: COLORS.primary,
borderWidth: 2
```

### 4. Transiciones y Animaciones
- Usar animaciones sutiles y rápidas (200-300ms)
- Preferir transforms sobre layout animations
- Ease-out para entradas, ease-in para salidas

## 📱 Inspiración de las Referencias

### De Imagen 1 (Estilo Vibrante):
- ✅ Amarillo neón como color primario
- ✅ Cards con colores de fondo (negro, amarillo)
- ✅ Iconos coloridos para categorías
- ✅ Bottom navigation con pills
- ✅ Tipografía bold y llamativa

### De Imagen 2 (Estilo Minimalista):
- ✅ Backgrounds blancos y limpios
- ✅ Espaciado generoso
- ✅ Borders sutiles
- ✅ Jerarquía tipográfica clara
- ✅ Iconos simples y monocromáticos

## 🚀 Próximos Pasos

1. Implementar sistema de sombras consistente
2. Crear componentes reutilizables con estos estilos
3. Agregar modo oscuro (usando darkCard y darkBackground)
4. Implementar animaciones micro-interacciones
5. Crear biblioteca de componentes documentada
