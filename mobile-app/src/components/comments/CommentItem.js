import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ICON_SIZE } from '../../constants';
import { Avatar } from '../ui';
import { formatTime } from '../../utils/formatters';

export default function CommentItem({
  comment,
  currentUserId = null,
  onDelete = null,
  onMention = null,
}) {
  const isOwn = currentUserId && comment.userId === currentUserId;

  const handleMention = () => {
    if (onMention && !isOwn) {
      onMention(comment.user);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMention} activeOpacity={0.7} disabled={isOwn}>
        <Avatar
          name={comment.user.name}
          image={comment.user.avatar}
          size={36}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.bubble}>
          <View style={styles.header}>
            <Text style={[TYPOGRAPHY.bodyBold, styles.userName]}>
              {comment.user.name}
            </Text>
            <Text style={[TYPOGRAPHY.tiny, styles.time]}>
              {comment.createdAt ? formatTime(comment.createdAt) : comment.time}
            </Text>
          </View>

          <Text style={[TYPOGRAPHY.body, styles.text]}>
            {comment.text}
          </Text>

          {comment.edited && (
            <Text style={[TYPOGRAPHY.tiny, styles.editedLabel]}>
              (editado)
            </Text>
          )}
        </View>

        {isOwn && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(comment)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={ICON_SIZE.xs} color={COLORS.error} />
            <Text style={[TYPOGRAPHY.tiny, styles.deleteText]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  bubble: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  userName: {
    fontSize: 14,
  },
  time: {
    color: COLORS.textSecondary,
  },
  text: {
    lineHeight: 20,
  },
  editedLabel: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  deleteText: {
    color: COLORS.error,
  },
});
