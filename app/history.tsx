import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { listenPings, Ping } from '../src/pings';

export default function HistoryScreen() {
  const [pings, setPings] = useState<Ping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = listenPings((newPings) => {
      setPings(newPings);
      setIsLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid time';
    }
  };

  const formatCoordinates = (coords: { lat: number; lng: number } | null): string => {
    if (!coords) return 'No location';
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  };

  const renderPingItem = ({ item }: { item: Ping }) => (
    <View style={styles.pingItem}>
      <View style={styles.pingHeader}>
        <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
      </View>
      
      {item.message && (
        <Text style={styles.message}>{item.message}</Text>
      )}
      
      <View style={styles.coordsContainer}>
        <Text style={styles.coordsLabel}>Location:</Text>
        <Text style={styles.coords}>{formatCoordinates(item.coords || null)}</Text>
      </View>
      
      <View style={styles.uidContainer}>
        <Text style={styles.uidLabel}>User ID:</Text>
        <Text style={styles.uid}>{item.uid.substring(0, 8)}...</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Pings Yet</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to send a ping!
      </Text>
      <Link href="/" asChild>
        <View style={styles.sendPingButton}>
          <Text style={styles.sendPingButtonText}>Send Your First Ping</Text>
        </View>
      </Link>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading ping history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Pings</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Ping Feed</Text>
        <Text style={styles.headerSubtitle}>
          Real-time updates from the community
        </Text>
      </View>

      <FlatList
        data={pings}
        renderItem={renderPingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => setIsLoading(true)}
      />

      <Link href="/" asChild>
        <View style={styles.fabButton}>
          <Text style={styles.fabButtonText}>+</Text>
        </View>
      </Link>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  pingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  message: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
    lineHeight: 22,
  },
  coordsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  coordsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  coords: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'monospace',
  },
  uidContainer: {
    flexDirection: 'row',
  },
  uidLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  uid: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'monospace',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  sendPingButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sendPingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

