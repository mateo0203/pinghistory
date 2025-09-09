import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { ensureAuth } from '../firebase';
import { createPing } from '../src/pings';

export default function ActionScreen() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userUid = await ensureAuth();
        setUid(userUid);
        setIsAuthReady(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        Alert.alert(
          'Authentication Error',
          'Failed to authenticate. Please check your internet connection and try again.'
        );
      }
    };

    initAuth();
  }, []);

  const handleSendPing = async () => {
    if (!isAuthReady || !uid) {
      Alert.alert('Not Ready', 'Authentication is not ready yet. Please wait.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Creating ping...")
      await createPing(uid, message.trim() || undefined);
      console.log("Ping created.")

      
      // Show success message
      Alert.alert(
        'Ping Sent!',
        'Your ping has been successfully sent to the history feed.',
        [{ text: 'OK', onPress: () => setMessage('') }]
      );
    } catch (error) {
      console.error('Error sending ping:', error);
      Alert.alert(
        'Error',
        'Failed to send ping. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthReady) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Send a Ping</Text>
        <Text style={styles.subtitle}>
          Share your location and an optional message with the community
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message (optional)</Text>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="What's happening?"
            multiline
            maxLength={280}
            editable={!isLoading}
          />
          <Text style={styles.characterCount}>
            {message.length}/280 characters
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={handleSendPing}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Send Ping</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            • Your location will be included if permission is granted
          </Text>
          <Text style={styles.infoText}>
            • Pings are visible to everyone
          </Text>
        </View>

        <Link href="/history" asChild>
          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>View Ping History</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  historyButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

