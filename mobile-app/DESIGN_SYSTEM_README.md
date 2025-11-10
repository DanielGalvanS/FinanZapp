# 🎨 Sistema de Diseño - FinanceApp

Sistema de diseño completo basado en referencias de apps financieras modernas, combinando elementos vibrantes con minimalismo profesional.

## 📚 Tabla de Contenidos
1. [Paleta de Colores](#paleta-de-colores)
2. [Constantes de Estilo](#constantes-de-estilo)
3. [Componentes Comunes](#componentes-comunes)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Guía de Implementación](#guía-de-implementación)

---

## 🎨 Paleta de Colores

### Importación
```javascript
import { COLORS } from '../constants/colors';
// o
import { COLORS } from '../constants';
```

### Colores Principales
```javascript
COLORS.primary         // #C8FF00 - Amarillo neón vibrante
COLORS.black           // #000000 - Negro puro
COLORS.white           // #FFFFFF - Blanco puro
```

### Nuevos Colores Agregados
```javascript
// Alpha variants del primary
COLORS.primaryAlpha10  // rgba(200, 255, 0, 0.1)
COLORS.primaryAlpha20  // rgba(200, 255, 0, 0.2)
COLORS.primaryAlpha30  // rgba(200, 255, 0, 0.3)

// Dark elements
COLORS.darkCard        // #1A1A1A - Para cards oscuros
COLORS.darkBackground  // #0D0D0D - Para backgrounds oscuros

// Shadows & Overlays
COLORS.shadow          // rgba(0, 0, 0, 0.08)
COLORS.shadowMedium    // rgba(0, 0, 0, 0.12)
COLORS.shadowDark      // rgba(0, 0, 0, 0.16)
COLORS.overlay         // rgba(0, 0, 0, 0.5)
COLORS.overlayLight    // rgba(0, 0, 0, 0.3)

// Category colors
COLORS.categoryFood           // #FF6B6B
COLORS.categoryTransport      // #4ECDC4
COLORS.categoryEntertainment  // #95E1D3
COLORS.categoryShopping       // #F38181
COLORS.categoryHealth         // #A8E6CF
COLORS.categoryEducation      // #FFD3B6

// Chart colors
COLORS.chartOrange    // #FF9F40
COLORS.chartGreen     // #4ADE80
COLORS.chartBlue      // #60A5FA
COLORS.chartPurple    // #A78BFA
COLORS.chartPink      // #F472B6
COLORS.chartYellow    // #FBBF24
```

---

## 📐 Constantes de Estilo

### Importación
```javascript
import {
  RADIUS,
  SPACING,
  FONT_SIZE,
  SHADOWS,
  CARD_STYLES,
  BUTTON_STYLES,
  TYPOGRAPHY,
  ICON_SIZE,
  LAYOUT
} from '../constants/styling';
// o
import { RADIUS, SPACING, ... } from '../constants';
```

### Border Radius
```javascript
RADIUS.xs    // 8px
RADIUS.sm    // 12px
RADIUS.md    // 16px  - Más común
RADIUS.lg    // 20px
RADIUS.xl    // 24px
RADIUS.xxl   // 32px
RADIUS.round // 999px - Pills y círculos
```

### Spacing
```javascript
SPACING.xs    // 4px
SPACING.sm    // 8px
SPACING.md    // 12px
SPACING.lg    // 16px  - Padding interno común
SPACING.xl    // 20px  - Padding horizontal de pantalla
SPACING.xxl   // 24px  - Margin entre secciones
SPACING.xxxl  // 32px
SPACING.huge  // 40px
```

### Font Sizes
```javascript
FONT_SIZE.xs    // 11px - Tiny text
FONT_SIZE.sm    // 13px - Captions
FONT_SIZE.md    // 15px - Body text
FONT_SIZE.lg    // 18px - Subtítulos
FONT_SIZE.xl    // 24px - Títulos de sección
FONT_SIZE.xxl   // 32px - Títulos principales
FONT_SIZE.xxxl  // 40px - Hero text
FONT_SIZE.huge  // 48px - Montos grandes
```

### Shadows
```javascript
// Sin sombra
SHADOWS.none

// Sombra ligera - Para cards estándar
SHADOWS.sm
/*
{
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 2,
}
*/

// Sombra media - Para modales
SHADOWS.md

// Sombra pronunciada - Para FABs
SHADOWS.lg

// Sombra con color primario - Para CTAs
SHADOWS.primary
SHADOWS.primaryLarge
```

### Icon Sizes
```javascript
ICON_SIZE.xs   // 16px
ICON_SIZE.sm   // 20px
ICON_SIZE.md   // 24px - Más común
ICON_SIZE.lg   // 28px
ICON_SIZE.xl   // 32px
ICON_SIZE.xxl  // 40px
ICON_SIZE.xxxl // 48px
```

---

## 🧩 Componentes Comunes

### Card Styles

#### 1. Card Minimal (Estilo Imagen 2)
```javascript
import { CARD_STYLES } from '../constants';

<View style={CARD_STYLES.minimal}>
  {/* Contenido */}
</View>

// Resultado:
// - Background blanco
// - Border sutil
// - Border radius 16px
// - Padding 16px
```

#### 2. Card Elevated
```javascript
<View style={CARD_STYLES.elevated}>
  {/* Contenido */}
</View>

// Resultado:
// - Background blanco
// - Sombra suave
// - Border radius 20px
// - Padding 20px
```

#### 3. Card Primary (Estilo Imagen 1 - Amarillo)
```javascript
<View style={CARD_STYLES.primary}>
  {/* Contenido */}
</View>

// Resultado:
// - Background amarillo neón
// - Sombra con color primario
// - Border radius 24px
// - Padding 24px
```

#### 4. Card Dark (Estilo Imagen 1 - Spending)
```javascript
<View style={CARD_STYLES.dark}>
  {/* Contenido */}
</View>

// Resultado:
// - Background negro (#1A1A1A)
// - Border radius 20px
// - Padding 20px
```

### Button Styles

#### 1. Botón Primary (Negro)
```javascript
import { BUTTON_STYLES, TYPOGRAPHY, COLORS } from '../constants';

<TouchableOpacity style={BUTTON_STYLES.primary}>
  <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white }]}>
    Continuar
  </Text>
</TouchableOpacity>
```

#### 2. Botón Accent (Amarillo con sombra)
```javascript
<TouchableOpacity style={BUTTON_STYLES.accent}>
  <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.black }]}>
    Guardar Gasto
  </Text>
</TouchableOpacity>
```

#### 3. Botón Secondary (Outline)
```javascript
<TouchableOpacity style={BUTTON_STYLES.secondary}>
  <Text style={TYPOGRAPHY.bodyBold}>
    Cancelar
  </Text>
</TouchableOpacity>
```

#### 4. Pills (Bottom Navigation - Estilo Imagen 1)
```javascript
// Inactivo
<TouchableOpacity style={BUTTON_STYLES.pill}>
  <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
    Home
  </Text>
</TouchableOpacity>

// Activo
<TouchableOpacity style={BUTTON_STYLES.pillActive}>
  <Text style={[TYPOGRAPHY.captionBold, { color: COLORS.white }]}>
    Home
  </Text>
</TouchableOpacity>
```

### Typography

```javascript
import { TYPOGRAPHY } from '../constants';

// Título principal
<Text style={TYPOGRAPHY.h1}>Mi Balance</Text>

// Subtítulo
<Text style={TYPOGRAPHY.h3}>Gastos del Mes</Text>

// Texto normal
<Text style={TYPOGRAPHY.body}>Descripción del gasto</Text>

// Texto secundario
<Text style={TYPOGRAPHY.caption}>Hace 2 horas</Text>
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Card de Balance (Estilo Imagen 1)
```javascript
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, CARD_STYLES, TYPOGRAPHY, SPACING } from '../constants';

export default function BalanceCard() {
  return (
    <View style={CARD_STYLES.primary}>
      <Text style={[TYPOGRAPHY.caption, { color: COLORS.black, opacity: 0.7 }]}>
        Balance Total
      </Text>
      <Text style={[TYPOGRAPHY.h1, { color: COLORS.black, marginTop: SPACING.sm }]}>
        $651,972.00
      </Text>
      <Text style={[TYPOGRAPHY.caption, { color: COLORS.black, opacity: 0.7, marginTop: SPACING.xs }]}>
        MXN
      </Text>
    </View>
  );
}
```

### Ejemplo 2: Card Minimal de Transacción (Estilo Imagen 2)
```javascript
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  CARD_STYLES,
  TYPOGRAPHY,
  SPACING,
  ICON_SIZE,
  LAYOUT
} from '../constants';

export default function TransactionCard({ transaction }) {
  return (
    <TouchableOpacity style={CARD_STYLES.minimal}>
      <View style={LAYOUT.rowBetween}>
        <View style={LAYOUT.row}>
          <View style={[styles.iconContainer, { backgroundColor: transaction.color + '20' }]}>
            <Ionicons
              name={transaction.icon}
              size={ICON_SIZE.md}
              color={transaction.color}
            />
          </View>
          <View style={{ marginLeft: SPACING.md }}>
            <Text style={TYPOGRAPHY.bodyBold}>{transaction.name}</Text>
            <Text style={TYPOGRAPHY.caption}>{transaction.category}</Text>
          </View>
        </View>
        <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.error }]}>
          -${transaction.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Ejemplo 3: Botón de Acción Principal
```javascript
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BUTTON_STYLES,
  TYPOGRAPHY,
  COLORS,
  SPACING,
  ICON_SIZE,
  LAYOUT
} from '../constants';

export default function PrimaryButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity
      style={BUTTON_STYLES.accent}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[LAYOUT.row, { gap: SPACING.sm }]}>
        {icon && (
          <Ionicons name={icon} size={ICON_SIZE.sm} color={COLORS.black} />
        )}
        <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.black }]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
```

---

## 🚀 Guía de Implementación

### 1. Migración de Componentes Existentes

#### Antes:
```javascript
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
```

#### Después:
```javascript
import { CARD_STYLES } from '../constants';

// Usar directamente
<View style={CARD_STYLES.minimal}>

// O combinar con estilos propios
<View style={[CARD_STYLES.minimal, styles.customStyle]}>
```

### 2. Uso de Typography

#### Antes:
```javascript
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
});
```

#### Después:
```javascript
import { TYPOGRAPHY } from '../constants';

<Text style={TYPOGRAPHY.h2}>Mi Título</Text>
```

### 3. Uso de Shadows

#### Antes:
```javascript
const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
});
```

#### Después:
```javascript
import { SHADOWS } from '../constants';

<View style={[styles.card, SHADOWS.sm]}>
```

### 4. Iconos con Tamaños Consistentes

#### Antes:
```javascript
<Ionicons name="home-outline" size={24} color="#6B7280" />
```

#### Después:
```javascript
import { ICON_SIZE, COLORS } from '../constants';

<Ionicons
  name="home-outline"
  size={ICON_SIZE.md}
  color={COLORS.textSecondary}
/>
```

---

## ✨ Mejores Prácticas

### 1. **Consistencia de Color**
- Usar siempre `COLORS.text` para texto principal
- Usar `COLORS.textSecondary` para texto secundario
- Usar `COLORS.primary` solo para CTAs y highlights importantes

### 2. **Jerarquía Visual**
- H1 para títulos principales de pantalla
- H3 para títulos de sección
- Body para contenido
- Caption para metadata

### 3. **Espaciado**
- `SPACING.xl` (20px) para padding horizontal de pantallas
- `SPACING.xxl` (24px) para separación entre secciones
- `SPACING.lg` (16px) para padding interno de cards

### 4. **Border Radius**
- `RADIUS.md` (16px) para la mayoría de cards y botones
- `RADIUS.xl` (24px) para cards destacados
- `RADIUS.round` para pills y avatares

### 5. **Sombras**
- `SHADOWS.sm` para cards normales
- `SHADOWS.primary` para botones de acción principal
- No abusar de las sombras - usar con moderación

---

## 📖 Recursos Adicionales

- **STYLE_GUIDE.md**: Guía completa de estilo visual
- **/src/constants/colors.js**: Definición de toda la paleta
- **/src/constants/styling.js**: Todas las constantes de estilo
- **/src/constants/index.js**: Exportaciones centralizadas

---

## 🎯 Próximos Pasos

1. ✅ Sistema de colores implementado
2. ✅ Constantes de estilo creadas
3. ✅ Guía de estilo documentada
4. ⏳ Migrar componentes existentes
5. ⏳ Crear biblioteca de componentes reutilizables
6. ⏳ Implementar modo oscuro
7. ⏳ Agregar animaciones micro-interacciones

---

**¡Tu sistema de diseño está listo para usar!** 🎉

Ahora puedes crear interfaces consistentes, profesionales y modernas usando estas constantes en toda tu aplicación.
