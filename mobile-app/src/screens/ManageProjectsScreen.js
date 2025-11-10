import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Datos de ejemplo - En producción vendrían del estado global
const INITIAL_PROJECTS = [
  { id: 1, name: 'Personal', expenseCount: 45, totalAmount: 15420.50, isArchived: false },
  { id: 2, name: 'Negocio', expenseCount: 32, totalAmount: 28950.00, isArchived: false },
  { id: 3, name: 'Renta Depa', expenseCount: 12, totalAmount: 9600.00, isArchived: false },
];

export default function ManageProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectName, setProjectName] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const handleBack = () => {
    router.back();
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setProjectName('');
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setShowModal(true);
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el proyecto');
      return;
    }

    if (editingProject) {
      // Editar proyecto existente
      setProjects(prev => prev.map(p =>
        p.id === editingProject.id ? { ...p, name: projectName } : p
      ));
      Alert.alert('Éxito', 'Proyecto actualizado correctamente');
    } else {
      // Crear nuevo proyecto
      const newProject = {
        id: Math.max(...projects.map(p => p.id)) + 1,
        name: projectName,
        expenseCount: 0,
        totalAmount: 0,
        isArchived: false,
      };
      setProjects(prev => [...prev, newProject]);
      Alert.alert('Éxito', 'Proyecto creado correctamente');
    }

    setShowModal(false);
    setProjectName('');
    setEditingProject(null);
  };

  const handleArchiveProject = (project) => {
    Alert.alert(
      'Archivar Proyecto',
      `¿Estás seguro de que deseas archivar "${project.name}"? Los gastos asociados se mantendrán pero el proyecto no estará disponible para nuevos gastos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Archivar',
          style: 'destructive',
          onPress: () => {
            setProjects(prev => prev.map(p =>
              p.id === project.id ? { ...p, isArchived: true } : p
            ));
            Alert.alert('Éxito', 'Proyecto archivado correctamente');
          },
        },
      ]
    );
  };

  const handleDeleteProject = (project) => {
    if (project.expenseCount > 0) {
      Alert.alert(
        'No se puede eliminar',
        `Este proyecto tiene ${project.expenseCount} gastos asociados. Debes archivar el proyecto en lugar de eliminarlo.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Eliminar Proyecto',
      `¿Estás seguro de que deseas eliminar "${project.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProjects(prev => prev.filter(p => p.id !== project.id));
            Alert.alert('Éxito', 'Proyecto eliminado correctamente');
          },
        },
      ]
    );
  };

  const handleRestoreProject = (project) => {
    setProjects(prev => prev.map(p =>
      p.id === project.id ? { ...p, isArchived: false } : p
    ));
    Alert.alert('Éxito', 'Proyecto restaurado correctamente');
  };

  const activeProjects = projects.filter(p => !p.isArchived);
  const archivedProjects = projects.filter(p => p.isArchived);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestionar Proyectos</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateProject}>
          <Text style={styles.createButtonIcon}>+</Text>
          <Text style={styles.createButtonText}>Crear Nuevo Proyecto</Text>
        </TouchableOpacity>

        {/* Active Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proyectos Activos ({activeProjects.length})</Text>

          {activeProjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateText}>No tienes proyectos activos</Text>
              <Text style={styles.emptyStateSubtext}>Crea uno para organizar tus gastos</Text>
            </View>
          ) : (
            activeProjects.map((project) => (
              <View key={project.id} style={styles.projectCard}>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <View style={styles.projectStats}>
                    <Text style={styles.projectStat}>
                      {project.expenseCount} {project.expenseCount === 1 ? 'gasto' : 'gastos'}
                    </Text>
                    <Text style={styles.projectDivider}>•</Text>
                    <Text style={styles.projectAmount}>{formatCurrency(project.totalAmount)}</Text>
                  </View>
                </View>

                <View style={styles.projectActions}>
                  <TouchableOpacity
                    style={styles.projectActionButton}
                    onPress={() => handleEditProject(project)}
                  >
                    <Ionicons name="create-outline" size={18} color={COLORS.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.projectActionButton}
                    onPress={() => handleArchiveProject(project)}
                  >
                    <Ionicons name="archive-outline" size={18} color={COLORS.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.projectActionButton}
                    onPress={() => handleDeleteProject(project)}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Archived Projects */}
        {archivedProjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proyectos Archivados ({archivedProjects.length})</Text>

            {archivedProjects.map((project) => (
              <View key={project.id} style={[styles.projectCard, styles.projectCardArchived]}>
                <View style={styles.projectInfo}>
                  <Text style={[styles.projectName, styles.projectNameArchived]}>
                    {project.name}
                  </Text>
                  <View style={styles.projectStats}>
                    <Text style={styles.projectStat}>
                      {project.expenseCount} {project.expenseCount === 1 ? 'gasto' : 'gastos'}
                    </Text>
                    <Text style={styles.projectDivider}>•</Text>
                    <Text style={styles.projectAmount}>{formatCurrency(project.totalAmount)}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.projectActionButton, styles.restoreButton]}
                  onPress={() => handleRestoreProject(project)}
                >
                  <Text style={styles.restoreButtonText}>Restaurar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </Text>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>Nombre del Proyecto</Text>
              <TextInput
                style={styles.modalInput}
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Ej: Vacaciones, Casa nueva..."
                placeholderTextColor={COLORS.textSecondary}
                autoFocus
                maxLength={50}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowModal(false);
                  setProjectName('');
                  setEditingProject(null);
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  !projectName.trim() && styles.modalSaveButtonDisabled,
                ]}
                onPress={handleSaveProject}
                disabled={!projectName.trim()}
              >
                <Text style={styles.modalSaveButtonText}>
                  {editingProject ? 'Guardar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: COLORS.text,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonIcon: {
    fontSize: 24,
    color: COLORS.background,
    marginRight: 8,
    fontWeight: 'bold',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  projectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: 16,
    marginBottom: 12,
  },
  projectCardArchived: {
    backgroundColor: COLORS.gray50,
    opacity: 0.8,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  projectNameArchived: {
    color: COLORS.textSecondary,
  },
  projectStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectStat: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  projectDivider: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  projectAmount: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  projectActions: {
    flexDirection: 'row',
    gap: 8,
  },
  projectActionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectActionIcon: {
    fontSize: 18,
  },
  restoreButton: {
    paddingHorizontal: 12,
    width: 'auto',
    backgroundColor: COLORS.primary,
  },
  restoreButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.black,
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
  },
  modalInputContainer: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: COLORS.gray50,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
});
