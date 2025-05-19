import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { theme, globalStyles } from '../../../constants/theme';
import i18n from '../../../i18n';
import { useAuth } from '../../../hooks/useAuth';
import { useChat } from '../../../hooks/useChat';
import ChatBubble from '../../../components/ChatBubble';
import { ArrowLeft, Send, Coffee } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { RootStackParamList } from '../../../types/navigation';

// Tipizza il parametro della route
const route = useRoute<RouteProp<RootStackParamList, 'ChatDetail'>>();
const ChatDetailScreen = () => {
  const navigation = useNavigation();
  const { id } = route.params;
  const { user } = useAuth();
  const userId = user?.id || '1';
  const { getChatById, sendMessage, markMessagesAsRead } = useChat(userId);

  const [message, setMessage] = useState('');
  const chat = getChatById(id);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    if (chat) {
      markMessagesAsRead(chat.id);
    }
  }, [chat?.id]);

  useEffect(() => {
    if (chat?.messages.length && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chat?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const otherParticipantId = chat?.participants.find(pid => pid !== userId);

    if (otherParticipantId) {
      await sendMessage(otherParticipantId, message.trim());
      setMessage('');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!chat) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.neutral[900]} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{i18n.t('chat.conversations')}</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{i18n.t('common.somethingWentWrong')}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.neutral[900]} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Marco Rossi</Text>
            <TouchableOpacity style={styles.coffeeButton}>
              <Coffee size={20} color={theme.colors.neutral[100]} />
            </TouchableOpacity>
          </View>

          {chat.messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>{i18n.t('chat.noMessages')}</Text>
              <Text style={styles.emptyText}>{i18n.t('chat.startConversation')}</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={chat.messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ChatBubble message={item} isCurrentUser={item.senderId === userId} />
              )}
              contentContainerStyle={styles.messageList}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={i18n.t('chat.typeMessage')}
              placeholderTextColor={theme.colors.neutral[500]}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send size={20} color={theme.colors.neutral[100]} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  backButton: { padding: theme.spacing.xs },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[900],
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  coffeeButton: {
    backgroundColor: theme.colors.primary[600],
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.body,
  },
  messageList: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[200],
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    maxHeight: 100,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[900],
  },
  sendButton: {
    backgroundColor: theme.colors.primary[600],
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.neutral[400],
  },
});