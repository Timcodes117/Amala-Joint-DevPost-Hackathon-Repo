import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MoreVertical, Send } from 'lucide-react-native';
import { color_scheme, font_name } from '../../utils/constants/app_constants';
import BackButton from '../../components/buttons/back_button';
import { router } from 'expo-router';
import { axiosPost } from '../../utils/api';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  buttons?: Array<{
    id: string;
    text: string;
    action: string;
  }>;
}

interface BotResponse {
  intent: string;
  message: string;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Hey there! Welcome to Amala Joint!',
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: "I'm your friendly Amala Bot! I'm here to help you discover the best Amala spots around you and share everything about Nigerian cuisine. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: 'btn1', text: 'Find Amala spots near me', action: 'find_spots' },
        { id: 'btn2', text: 'Tell me about Amala dishes', action: 'learn_about_amala' },
        { id: 'btn3', text: 'Help me choose a restaurant', action: 'choose_restaurant' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [conversationHistory, setConversationHistory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Function to call backend API
  const callBackendAPI = async (userMessage: string): Promise<BotResponse> => {
    try {
      console.log('Sending message to backend:', userMessage);
      
      const response = await axiosPost('/api/ai/chat', {
        message: userMessage,
        lang: 'en',
        address: '' // You can add user location here if available
      });

      console.log('Backend response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to get response');
      }

      const data = response.data;
      const message = data.message || data.response || 'I received your message but couldn\'t generate a proper response. Please try again.';
      
      return {
        intent: data.intent || 'chat',
        message: message
      };
    } catch (error) {
      console.error('Backend API Error:', error);
      return {
        intent: 'error',
        message: 'Sorry, I encountered an error. Please try again.'
      };
    }
  };

  // Function to update conversation history
  const updateConversationHistory = (userMessage: string, botResponse: string) => {
    const newEntry = `User: ${userMessage}\nBot: ${botResponse}\n\n`;
    setConversationHistory(prev => prev + newEntry);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const userMessage = inputText.trim();
      const newMessage: Message = {
        id: Date.now().toString(),
        text: userMessage,
        isBot: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsLoading(true);
      
      try {
        // Call Backend API
        const botResponse = await callBackendAPI(userMessage);
        
        // Update conversation history
        updateConversationHistory(userMessage, botResponse.message);
        
        // Add bot response to messages
        const botMessage: Message = {
          id: Date.now().toString() + '_bot',
          text: botResponse.message,
          isBot: true,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error handling message:', error);
        Alert.alert('Error', 'Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };


  const handleButtonPress = async (action: string, buttonText: string) => {
    if (isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: buttonText,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Call Backend API
      const botResponse = await callBackendAPI(buttonText);
      
      // Update conversation history
      updateConversationHistory(buttonText, botResponse.message);
      
      // Add bot response to messages
      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        text: botResponse.message,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error handling button press:', error);
      Alert.alert('Error', 'Failed to process button action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderMessage = (message: Message) => (
    <View key={message.id} style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          message.isBot ? styles.botMessage : styles.userMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isBot ? styles.botText : styles.userText,
          ]}
        >
          {message.text}
        </Text>
      </View>
      
      {message.buttons && (
        <View style={styles.buttonContainer}>
          {message.buttons.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={styles.actionButton}
              onPress={() => handleButtonPress(button.action, button.text)}
            >
              <Text style={styles.buttonText}>
                {button.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: color_scheme.light}]} edges={['top', 'left', 'right', 'bottom']}>
      {/* <StatusBar barStyle="dark-content"  /> */}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <BackButton  onTap={()=> router.back()} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Image source={require('../../assets/images/bot.png')} style={styles.botAvatar} />
          <View style={styles.headerText}>
            <Text style={styles.botName}>Amala Bot</Text>
            <Text style={styles.botStatus}>Ask anything</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={24} color={color_scheme.text_color} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Send message..."
            placeholderTextColor={color_scheme.placeholder_color}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Send 
              size={20} 
              color={
                inputText.trim() && !isLoading 
                  ? color_scheme.light 
                  : color_scheme.placeholder_color
              } 
            />
          </TouchableOpacity>
    </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: color_scheme.light,
    borderBottomWidth: 1,
    borderBottomColor: color_scheme.grey_bg,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 12,
  },
  botName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color_scheme.text_color,
    fontFamily: font_name,
  },
  botStatus: {
    fontSize: 14,
    color: color_scheme.placeholder_color,
    fontFamily: font_name,
  },
  menuButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botMessage: {
    backgroundColor: '#E5E5E5',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#FFB6C1',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: font_name,
  },
  botText: {
    color: color_scheme.text_color,
  },
  userText: {
    color: color_scheme.text_color,
  },
  buttonContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color_scheme.grey_bg,
  },
  buttonText: {
    fontSize: 14,
    color: color_scheme.text_color,
    fontFamily: font_name,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: color_scheme.light,
    borderTopWidth: 1,
    borderTopColor: color_scheme.grey_bg,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: font_name,
    color: color_scheme.text_color,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color_scheme.text_color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: color_scheme.grey_bg,
  },
});

export default ChatScreen;