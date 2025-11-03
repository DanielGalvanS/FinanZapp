import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';

// Datos de ejemplo
const USER_DATA = {
  name: 'Leon Fernandez',
  email: 'leon@finanzapp.com',
  avatar: '👤',
};

const MENU_SECTIONS = [
  {
    id: 'personal',
    title: 'Información Personal',
    icon: '👤',
    items: [
      { id: 'name', label: 'Nombre', value: 'Leon Fernandez', action: 'edit' },
      { id: 'email', label: 'Email', value: 'leon@finanzapp.com', action: 'view' },
      { id: 'avatar', label: 'Cambiar Avatar', action: 'navigate' },
    ],
  },
  {
    id: 'security',
    title: 'Seguridad',
    icon: '🔐',
    items: [
      { id: 'password', label: 'Cambiar Contraseña', action: 'navigate' },
      { id: '2fa', label: 'Autenticación 2FA', action: 'toggle', value: false },
      { id: 'sessions', label: 'Sesiones Activas', subtitle: '3 dispositivos', action: 'navigate' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: '🔔',
    items: [
      { id: 'push', label: 'Notificaciones Push', action: 'toggle', value: true },
      { id: 'email', label: 'Notificaciones Email', action: 'toggle', value: true },
      { id: 'config', label: 'Configurar por Tipo', action: 'navigate' },
    ],
  },
  {
    id: 'appearance',
    title: 'Apariencia',
    icon: '🎨',
    items: [
      { id: 'theme', label: 'Tema', value: 'Claro', action: 'navigate' },
      { id: 'accent', label: 'Color de Acento', value: '🟢', action: 'navigate' },
    ],
  },
  {
    id: 'region',
    title: 'Región',
    icon: '🌐',
    items: [
      { id: 'language', label: 'Idioma', value: 'Español', action: 'navigate' },
      { id: 'currency', label: 'Moneda', value: 'MXN', action: 'navigate' },
      { id: 'dateFormat', label: 'Formato de Fecha', value: 'DD/MM/YYYY', action: 'navigate' },
      { id: 'timezone', label: 'Zona Horaria', value: 'Ciudad de México', action: 'navigate' },
    ],
  },
  {
    id: 'projects',
    title: 'Proyectos',
    icon: '📁',
    items: [
      { id: 'projects-manage', label: 'Gestionar Proyectos', subtitle: '3 proyectos activos', action: 'navigate' },
      { id: 'categories-manage', label: 'Gestionar Categorías', subtitle: '6 categorías', action: 'navigate' },
    ],
  },
  {
    id: 'invitations',
    title: 'Invitaciones',
    icon: '👥',
    items: [
      { id: 'pending', label: 'Pendientes de Aceptar', badge: '2', action: 'navigate' },
      { id: 'shared', label: 'Proyectos Compartidos', subtitle: '5 proyectos', action: 'navigate' },
    ],
  },
  {
    id: 'data',
    title: 'Data & Privacidad',
    icon: '💾',
    items: [
      { id: 'export', label: 'Exportar Datos', action: 'navigate' },
      { id: 'backup', label: 'Backup Automático', action: 'toggle', value: true },
      { id: 'restore', label: 'Restaurar Backup', action: 'navigate' },
      { id: 'delete', label: 'Borrar Cuenta', danger: true, action: 'navigate' },
    ],
  },
  {
    id: 'help',
    title: 'Ayuda & Soporte',
    icon: '❓',
    items: [
      { id: 'tutorial', label: 'Ver Tutorial', action: 'navigate' },
      { id: 'faq', label: 'Preguntas Frecuentes', action: 'navigate' },
      { id: 'contact', label: 'Contactar Soporte', action: 'navigate' },
      { id: 'terms', label: 'Términos y Condiciones', action: 'navigate' },
      { id: 'privacy', label: 'Política de Privacidad', action: 'navigate' },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [toggleStates, setToggleStates] = React.useState({
    '2fa': false,
    push: true,
    email: true,
    backup: true,
  });

  const handleToggle = (itemId) => {
    setToggleStates(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleItemPress = (item) => {
    console.log('Item pressed:', item);

    // Navigate to specific screens
    if (item.id === 'projects-manage') {
      router.push('/manage-projects');
    } else if (item.id === 'categories-manage') {
      router.push('/manage-categories');
    }
  };

  const handleLogout = () => {
    console.log('Logout pressed');
  };

  const renderMenuItem = (item, isLast) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.menuItem,
          isLast && styles.menuItemLast,
        ]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <Text style={[
            styles.menuItemLabel,
            item.danger && styles.menuItemLabelDanger
          ]}>
            {item.label}
          </Text>
          {item.subtitle && (
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>

        <View style={styles.menuItemRight}>
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}

          {item.value && item.action !== 'toggle' && (
            <Text style={styles.menuItemValue}>{item.value}</Text>
          )}

          {item.action === 'toggle' ? (
            <Switch
              value={toggleStates[item.id]}
              onValueChange={() => handleToggle(item.id)}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.gray300}
            />
          ) : (
            <Text style={styles.menuItemChevron}>›</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{USER_DATA.avatar}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{USER_DATA.name}</Text>
            <Text style={styles.userEmail}>{USER_DATA.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, sectionIndex) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) =>
                renderMenuItem(item, itemIndex === section.items.length - 1)
              )}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>FinanzApp v1.0.0</Text>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuItemLabelDanger: {
    color: COLORS.error,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  menuItemChevron: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  bottomPadding: {
    height: 100,
  },
});
