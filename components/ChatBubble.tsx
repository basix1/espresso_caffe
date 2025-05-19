import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage } from '../types';
import { theme } from '../constants/theme';

interface ChatBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isCurrentUser }) => {
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.text,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.content}
        </Text>
      </View>
      <Text style={[
        styles.timestamp,
        isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
      ]}>
        {formatTime(message.timestamp)}
        {isCurrentUser && message.read && (
          <Text style={styles.readIndicator}> ✓</Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadow.small,
  },
  currentUserBubble: {
    backgroundColor: theme.colors.primary[600],
  },
  otherUserBubble: {
    backgroundColor: theme.colors.neutral[200],
  },
  text: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.body,
  },
  currentUserText: {
    color: theme.colors.neutral[100],
  },
  otherUserText: {
    color: theme.colors.neutral[900],
  },
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: theme.colors.neutral[600],
  },
  otherUserTimestamp: {
    color: theme.colors.neutral[600],
  },
  readIndicator: {
    color: theme.colors.primary[500],
  },
});

export default ChatBubble;