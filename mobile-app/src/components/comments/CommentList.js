import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import CommentItem from './CommentItem';

export default function CommentList({
  comments = [],
  currentUserId = null,
  onDeleteComment = null,
  onMentionUser = null,
  emptyText = 'No hay comentarios aún',
  ListHeaderComponent = null,
}) {
  const renderComment = ({ item }) => (
    <CommentItem
      comment={item}
      currentUserId={currentUserId}
      onDelete={onDeleteComment}
      onMention={onMentionUser}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[TYPOGRAPHY.body, styles.emptyText]}>
        {emptyText}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  emptyContainer: {
    paddingVertical: SPACING.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
});
