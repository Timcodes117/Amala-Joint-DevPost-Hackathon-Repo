import React from 'react'
import { useAppContext } from '../../contexts/app';
import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

function Notification() {

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Mailbox Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.mailboxContainer}>
            <View style={styles.mailboxPost} />
            <View style={styles.mailbox}>
              <View style={styles.mailboxSlit} />
              <View style={styles.mailboxHandle} />
              <View style={styles.mailboxDetails}>
                <View style={styles.mailboxDetail} />
                <View style={styles.mailboxDetail} />
              </View>
            </View>
            <View style={styles.mailboxFlag}>
              <View style={styles.flagPole} />
            </View>
          </View>
          <View style={styles.backgroundShape} />
        </View>

        {/* Text Content */}
        <Text style={styles.mainText}>No notifications yet!</Text>
        <Text style={styles.subText}>Your notifications will appear here once you've received them</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF8F8',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  mailboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  mailboxPost: {
    width: 8,
    height: 60,
    backgroundColor: '#8B4513',
    borderRadius: 4,
  },
  mailbox: {
    width: 80,
    height: 50,
    backgroundColor: '#DC143C',
    borderRadius: 8,
    marginTop: -10,
    position: 'relative',
  },
  mailboxSlit: {
    position: 'absolute',
    top: 15,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  mailboxHandle: {
    position: 'absolute',
    top: 20,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  mailboxDetails: {
    position: 'absolute',
    bottom: 8,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mailboxDetail: {
    width: 12,
    height: 4,
    backgroundColor: '#FF8C00',
    borderRadius: 2,
  },
  mailboxFlag: {
    position: 'absolute',
    top: -5,
    right: -15,
    zIndex: 3,
  },
  flagPole: {
    width: 2,
    height: 20,
    backgroundColor: '#FFD700',
    borderRadius: 1,
  },
  backgroundShape: {
    position: 'absolute',
    width: 200,
    height: 150,
    backgroundColor: '#FFE4E1',
    borderRadius: 100,
    opacity: 0.6,
    zIndex: 1,
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default Notification;