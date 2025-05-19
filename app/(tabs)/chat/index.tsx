import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '../../../constants/theme';
import i18n from '../../../i18n';
import { useAuth } from '../../../hooks/useAuth';
import { useChat } from '../../../hooks/useChat';
import { MessageCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { RootStackParamList } from '../../../types/navigation';

export default function ChatScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const userId = user?.id || '1'; // Default to '1' for demo if no user is logged in
  const { chats, isLoading } = useChat(userId);

  const formatTimestamp = (timestamp: number) => {
    const now = new Date();
    const messageDate = new Date(timestamp);

    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const diffDays = Math.round((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }

    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <MessageCircle size={60} color={theme.colors.neutral[400]} />
      <Text style={styles.emptyStateTitle}>{i18n.t('chat.noConversations')}</Text>
      <Text style={styles.emptyStateText}>{i18n.t('chat.startConversation')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
        <Text style={styles.title}>{i18n.t('chat.conversations')}</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{i18n.t('common.loading')}</Text>
          </View>
        ) : chats.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const lastMessage = item.messages[item.messages.length - 1];
              return (
                <TouchableOpacity
                  style={styles.chatItem}
                  onPress={() => navigation.navigate('ChatDetail', { id: item.id })}
                >
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                    style={styles.avatar}
                  />
                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatName}>Marco Rossi</Text>
                      {lastMessage && (
                        <Text style={styles.chatTime}>
                          {formatTimestamp(lastMessage.timestamp)}
                        </Text>
                      )}
                    </View>

                    <View style={styles.messageRow}>
                      {lastMessage && (
                        <Text
                          style={[styles.chatMessage, lastMessage.read ? {} : styles.unreadMessage]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {lastMessage.content}
                        </Text>
                      )}

                      {item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[600],
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral[800],
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.body,
  },
  chatItem: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.neutral[100],
    ...theme.shadow.small,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  chatName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[900],
  },
  chatTime: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatMessage: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[700],
    flex: 1,
  },
  unreadMessage: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral[900],
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  unreadCount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[100],
  },
});
