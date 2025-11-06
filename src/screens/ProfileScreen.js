import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  ICON_SIZE,
} from '../constants';
import { ProfileHeader, MenuSection } from '../components/profile';

// Datos de ejemplo
const USER_DATA = {
  name: 'Leon Fernandez',
  email: 'leon@finanzapp.com',
};

const MENU_SECTIONS = [
  {
    id: 'personal',
    title: 'Información Personal',
    icon: 'person-circle-outline',
    items: [
      { id: 'name', label: 'Nombre', value: 'Leon Fernandez', action: 'edit' },
      { id: 'email', label: 'Email', value: 'leon@finanzapp.com', action: 'view' },
      { id: 'avatar', label: 'Cambiar Avatar', action: 'navigate' },
    ],
  },
  {
    id: 'security',
    title: 'Seguridad',
    icon: 'shield-checkmark-outline',
    items: [
      { id: 'password', label: 'Cambiar Contraseña', action: 'navigate' },
      { id: '2fa', label: 'Autenticación 2FA', action: 'toggle', value: false },
      { id: 'sessions', label: 'Sesiones Activas', subtitle: '3 dispositivos', action: 'navigate' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: 'notifications-outline',
    items: [
      { id: 'push', label: 'Notificaciones Push', action: 'toggle', value: true },
      { id: 'email', label: 'Notificaciones Email', action: 'toggle', value: true },
      { id: 'config', label: 'Configurar por Tipo', action: 'navigate' },
    ],
  },
  {
    id: 'appearance',
    title: 'Apariencia',
    icon: 'color-palette-outline',
    items: [
      { id: 'theme', label: 'Tema', value: 'Claro', action: 'navigate' },
      { id: 'accent', label: 'Color de Acento', value: '#1c1c1c', action: 'navigate' },
    ],
  },
  {
    id: 'region',
    title: 'Región',
    icon: 'globe-outline',
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
    icon: 'folder-outline',
    items: [
      { id: 'projects-manage', label: 'Gestionar Proyectos', subtitle: '3 proyectos activos', action: 'navigate' },
      { id: 'categories-manage', label: 'Gestionar Categorías', subtitle: '6 categorías', action: 'navigate' },
    ],
  },
  {
    id: 'invitations',
    title: 'Invitaciones',
    icon: 'people-outline',
    items: [
      { id: 'pending', label: 'Pendientes de Aceptar', badge: '2', action: 'navigate' },
      { id: 'shared', label: 'Proyectos Compartidos', subtitle: '5 proyectos', action: 'navigate' },
    ],
  },
  {
    id: 'data',
    title: 'Data & Privacidad',
    icon: 'server-outline',
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
    icon: 'help-circle-outline',
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={TYPOGRAPHY.h2}>Perfil</Text>
        </View>

        {/* User Profile Header */}
        <ProfileHeader
          name={USER_DATA.name}
          email={USER_DATA.email}
          onEditPress={() => console.log('Edit profile')}
        />

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <MenuSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            items={section.items}
            toggleStates={toggleStates}
            onToggle={handleToggle}
            onItemPress={handleItemPress}
          />
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={ICON_SIZE.sm} color={COLORS.error} />
          <Text style={[TYPOGRAPHY.bodyBold, styles.logoutText]}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={[TYPOGRAPHY.caption, styles.versionText]}>FinanzApp v1.0.0</Text>

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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.error,
    gap: SPACING.sm,
  },
  logoutText: {
    color: COLORS.error,
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  bottomPadding: {
    height: 100,
  },
});
