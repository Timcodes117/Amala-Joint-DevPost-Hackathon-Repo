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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MoreVertical, Send } from 'lucide-react-native';
import { color_scheme, font_name } from '../../utils/constants/app_constants';

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
      text: "I'm here to help you add a new Amala spot so others can discover amazing places to eat. Ready to get started?",
      isBot: true,
      timestamp: new Date(),
      buttons: [
        { id: 'btn1', text: 'Nah, no need', action: 'decline' },
        { id: 'btn2', text: "Yes, let's do it!", action: 'accept' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isBot: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Simulate bot response
      setTimeout(() => {
        handleBotResponse(inputText.trim());
      }, 1000);
    }
  };

  const handleBotResponse = (userMessage: string) => {
    let botResponse = '';
    let buttons: Array<{ id: string; text: string; action: string }> | undefined;

    if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes("let's")) {
      botResponse = "Perfect! Let's start with the basics. What's the name of this Amala spot?";
    } else if (userMessage.toLowerCase().includes('iya moria')) {
      botResponse = 'Great choice! "Iya Moria Spot" sounds like a nice place! 😊 Now, where can people find this spot? Please share the address or nearest landmark.';
    } else if (userMessage.toLowerCase().includes('moria road') || userMessage.toLowerCase().includes('unilag')) {
      botResponse = 'Got it! "13, moria road, UNILAG!" that\'s helpful for people to find it. 📍 Would you like me to help you add a precise location pin on the map?';
      buttons = [
        { id: 'btn3', text: 'Nah, no need', action: 'decline_map' },
        { id: 'btn4', text: "Yes, let's do it!", action: 'accept_map' },
      ];
    } else if (userMessage.toLowerCase().includes('map pin')) {
      botResponse = "Perfect! I've added a map pin for the location. 📌";
      setTimeout(() => {
        const pricingMessage: Message = {
          id: Date.now().toString() + '1',
          text: "Now, let's talk about pricing. How would you describe the price range at this spot?",
          isBot: true,
          timestamp: new Date(),
          buttons: [
            { id: 'btn5', text: 'N Budget friendly', action: 'budget' },
            { id: 'btn6', text: 'NN Moderate', action: 'moderate' },
            { id: 'btn7', text: 'NNN Premium', action: 'premium' },
          ],
        };
        setMessages(prev => [...prev, pricingMessage]);
      }, 1000);
    } else if (userMessage.toLowerCase().includes('budget')) {
      botResponse = 'Noted! 💰 What are the opening hours? For example: "8:00 AM - 10:00 PM" or "24 hours"';
    } else {
      botResponse = "Thanks for that information! I'll help you add this spot to our database.";
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      text: botResponse,
      isBot: true,
      timestamp: new Date(),
      buttons,
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleButtonPress = (action: string, buttonText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: buttonText,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      handleBotResponse(buttonText);
    }, 1000);
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
              style={[
                styles.actionButton,
                button.text.includes('Budget friendly') && styles.selectedButton,
              ]}
              onPress={() => handleButtonPress(button.action, button.text)}
            >
              <Text
                style={[
                  styles.buttonText,
                  button.text.includes('Budget friendly') && styles.selectedButtonText,
                ]}
              >
                {button.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft size={24} color={color_scheme.text_color} />
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
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? color_scheme.light : color_scheme.placeholder_color} />
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
    backgroundColor: '#F5F5F5',
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
  selectedButton: {
    backgroundColor: color_scheme.text_color,
  },
  buttonText: {
    fontSize: 14,
    color: color_scheme.text_color,
    fontFamily: font_name,
  },
  selectedButtonText: {
    color: color_scheme.light,
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
});

export default ChatScreen;