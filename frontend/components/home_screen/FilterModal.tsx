import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Animated, PanResponder, ScrollView } from 'react-native';
import { color_scheme, font_name, font_name_bold } from '../../utils/constants/app_constants';
import { global_style } from '../../utils/stylesheets/general_style';
import { Star, Plus, Minus, X } from 'lucide-react-native';

interface FilterState {
  soupType: string;
  distance: number;
  rating: number;
  price: string;
}

export interface FilterModalRef {
  present: () => void;
  dismiss: () => void;
}

const FilterModal = forwardRef<FilterModalRef, {
  onApplyFilters: (filters: FilterState) => void;
}>(({ onApplyFilters }, ref) => {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    soupType: 'Edi Ki kor Soup',
    distance: 2,
    rating: 4,
    price: 'N N N'
  });

  const translateY = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    present: () => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    },
    dismiss: () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: Dimensions.get('window').height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    },
  }));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100) {
        // Dismiss if dragged down more than 100px
        ref.current?.dismiss();
      } else {
        // Snap back to original position
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const soupTypes = [
    'Gbegiri Soup',
    'Ewedu Soup', 
    'Afang Soup',
    'Efor Soup',
    'Draw Soup',
    'Edi Ki kor Soup'
  ];

  const ratings = [1, 2, 3, 4, 5];
  const priceRanges = ['N', 'N N', 'N N N'];

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const adjustDistance = (increment: boolean) => {
    const newDistance = increment ? filters.distance + 1 : Math.max(1, filters.distance - 1);
    updateFilter('distance', newDistance);
  };

  const getWalkingTime = (distance: number) => {
    return `${distance * 7.5} mins walk`;
  };

  const getResultCount = () => {
    return 2;
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    ref.current?.dismiss();
  };

  const clearFilters = () => {
    setFilters({
      soupType: '',
      distance: 2,
      rating: 0,
      price: ''
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={() => ref.current?.dismiss()}
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={() => ref.current?.dismiss()}
        />
        <Animated.View 
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Header with Cancel Button */}
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <View style={styles.headerContent}>
              <Text style={styles.title}>Filter</Text>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => ref.current?.dismiss()}
              >
                <X size={24} color={color_scheme.dark_outline} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Soup Type Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Soup Type</Text>
              <View style={styles.buttonRow}>
                {soupTypes.map((soup) => (
                  <TouchableOpacity
                    key={soup}
                    style={[
                      styles.filterButton,
                      filters.soupType === soup && styles.selectedButton
                    ]}
                    onPress={() => updateFilter('soupType', soup)}
                  >
                    <Text style={[
                      styles.buttonText,
                      filters.soupType === soup && styles.selectedButtonText
                    ]}>
                      {soup}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Distance Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance to me</Text>
              <View style={styles.distanceContainer}>
                <TouchableOpacity
                  style={styles.distanceButton}
                  onPress={() => adjustDistance(false)}
                >
                  <Minus size={16} color={color_scheme.dark_outline} />
                </TouchableOpacity>
                
                <Text style={styles.distanceText}>{filters.distance} Km</Text>
                
                <TouchableOpacity
                  style={styles.distanceButton}
                  onPress={() => adjustDistance(true)}
                >
                  <Plus size={16} color={color_scheme.dark_outline} />
                </TouchableOpacity>
                
                <View style={styles.walkingInfo}>
                  <Text style={styles.walkingText}>{getWalkingTime(filters.distance)}</Text>
                </View>
              </View>
            </View>

            {/* Rating Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rating</Text>
              <View style={styles.buttonRow}>
                {ratings.map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.filterButton,
                      filters.rating === rating && styles.selectedButton
                    ]}
                    onPress={() => updateFilter('rating', rating)}
                  >
                    <Star size={16} color={filters.rating === rating ? color_scheme.light : color_scheme.dark_outline} />
                    <Text style={[
                      styles.buttonText,
                      filters.rating === rating && styles.selectedButtonText
                    ]}>
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price</Text>
              <View style={styles.buttonRow}>
                {priceRanges.map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.filterButton,
                      filters.price === price && styles.selectedButton
                    ]}
                    onPress={() => updateFilter('price', price)}
                  >
                    <Text style={[
                      styles.buttonText,
                      filters.price === price && styles.selectedButtonText
                    ]}>
                      {price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions - Fixed at bottom */}
          <View style={styles.bottomActions}>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearText}>Clear filter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Show {getResultCount()} results</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: color_scheme.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 34,
    height: Dimensions.get('window').height * 0.75,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: color_scheme.placeholder_color,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: font_name_bold,
    color: color_scheme.dark,
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: color_scheme.borderless,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: font_name_bold,
    color: color_scheme.dark,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color_scheme.borderless,
    backgroundColor: color_scheme.light,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  selectedButton: {
    backgroundColor: '#FF4444',
    borderColor: '#FF4444',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: font_name,
    color: color_scheme.dark,
  },
  selectedButtonText: {
    color: color_scheme.light,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  distanceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: color_scheme.borderless,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    fontFamily: font_name_bold,
    color: color_scheme.dark,
    minWidth: 50,
    textAlign: 'center',
  },
  walkingInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  walkingText: {
    fontSize: 14,
    fontFamily: font_name,
    color: color_scheme.dark,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: color_scheme.borderless,
    backgroundColor: color_scheme.light,
  },
  clearText: {
    fontSize: 16,
    fontFamily: font_name,
    color: color_scheme.dark,
  },
  applyButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: font_name_bold,
    color: color_scheme.light,
  },
});

export default FilterModal;