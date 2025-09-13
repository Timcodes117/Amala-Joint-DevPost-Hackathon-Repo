import React, { useRef, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { 
  Plus, 
  Grid3X3, 
  Settings, 
  Store,
  Sparkles 
} from 'lucide-react-native';
import { color_scheme } from '../../utils/constants/app_constants';

interface SpeedDialAction {
  id: string;
  icon: React.ReactNode;
  onPress: () => void;
  label?: string;
}

interface SpeedDialFABProps {
  actions: SpeedDialAction[];
  mainIcon?: React.ReactNode;
  mainColor?: string;
  secondaryColor?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SpeedDialFAB: React.FC<SpeedDialFABProps> = ({
  actions,
  mainIcon,
  mainColor = color_scheme.button_color,
  secondaryColor = color_scheme.dark,
  size = 'medium',
  disabled = false,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Animation values
  const mainScaleAnim = useRef(new Animated.Value(1)).current;
  const mainOpacityAnim = useRef(new Animated.Value(1)).current;
  const mainRotationAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  
  // Secondary buttons animations
  const secondaryAnims = useRef(
    actions.map(() => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
    }))
  ).current;

  // Size configurations
  const sizeConfig = {
    small: { mainSize: 48, secondarySize: 40, iconSize: 20, secondaryIconSize: 18 },
    medium: { mainSize: 56, secondarySize: 48, iconSize: 24, secondaryIconSize: 20 },
    large: { mainSize: 64, secondarySize: 56, iconSize: 28, secondaryIconSize: 22 },
  };

  const currentSize = sizeConfig[size];
  const verticalSpacing = 60; // Vertical distance between buttons

  // Calculate positions for secondary buttons in straight vertical alignment
  const getSecondaryButtonPosition = (index: number) => {
    return {
      x: 0, // No horizontal offset - keep buttons aligned
      y: -(index * verticalSpacing + verticalSpacing), // Move up for each button
    };
  };

  // Open animation
  const openSpeedDial = () => {
    if (disabled) return;
    
    setIsOpen(true);
    
    // Main button animations
    Animated.parallel([
      Animated.spring(mainScaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(mainRotationAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Secondary buttons animations with stagger
    const animations = secondaryAnims.map((anim, index) => {
      const position = getSecondaryButtonPosition(index);
      
      return Animated.parallel([
        Animated.spring(anim.scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
          delay: index * 50, // Stagger effect
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 200,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: position.y,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
          delay: index * 50,
        }),
        Animated.spring(anim.translateX, {
          toValue: position.x,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
          delay: index * 50,
        }),
      ]);
    });

    Animated.parallel(animations).start();
  };

  // Close animation
  const closeSpeedDial = () => {
    setIsOpen(false);
    
    // Main button animations
    Animated.parallel([
      Animated.spring(mainScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(mainRotationAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Ensure rotation is exactly 0 after animation completes
      mainRotationAnim.setValue(0);
    });

    // Secondary buttons animations
    const animations = secondaryAnims.map((anim, index) => {
      return Animated.parallel([
        Animated.spring(anim.scale, {
          toValue: 0,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
          delay: index * 30,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 150,
          delay: index * 30,
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
          delay: index * 30,
        }),
        Animated.spring(anim.translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
          delay: index * 30,
        }),
      ]);
    });

    Animated.parallel(animations).start();
  };

  // Toggle speed dial
  const toggleSpeedDial = () => {
    if (isOpen) {
      closeSpeedDial();
    } else {
      openSpeedDial();
    }
  };

  // Handle secondary action press
  const handleSecondaryAction = (action: SpeedDialAction) => {
    closeSpeedDial();
    setTimeout(() => {
      action.onPress();
    }, 200);
  };

  // Main button press animations
  const handleMainPressIn = () => {
    Animated.spring(mainScaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handleMainPressOut = () => {
    Animated.spring(mainScaleAnim, {
      toValue: isOpen ? 0.9 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  // Rotation interpolation
  const rotation = mainRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  // Debug rotation value
  React.useEffect(() => {
    const listener = mainRotationAnim.addListener(({ value }) => {
      console.log('Rotation value:', value);
    });
    return () => mainRotationAnim.removeListener(listener);
  }, []);

  // Overlay opacity
  const overlayOpacity = overlayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Overlay */}
      {isOpen && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeSpeedDial}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Secondary Action Buttons */}
      {actions.map((action, index) => {
        const position = getSecondaryButtonPosition(index);
        const anim = secondaryAnims[index];
        
        return (
          <Animated.View
            key={action.id}
            style={[
              styles.secondaryButton,
              {
                width: currentSize.secondarySize,
                height: currentSize.secondarySize,
                borderRadius: currentSize.secondarySize / 2,
                backgroundColor: secondaryColor,
                transform: [
                  { scale: anim.scale },
                  { translateX: anim.translateX },
                  { translateY: anim.translateY },
                ],
                opacity: anim.opacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.secondaryButtonTouch}
              onPress={() => handleSecondaryAction(action)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={action.label || `Action ${index + 1}`}
            >
              {action.icon}
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Main FAB Button */}
      <Animated.View
        style={[
          styles.mainButton,
          {
            width: currentSize.mainSize,
            height: currentSize.mainSize,
            borderRadius: currentSize.mainSize / 2,
            backgroundColor: disabled ? color_scheme.grey_bg : mainColor,
            transform: [
              { scale: mainScaleAnim },
              { rotate: rotation },
            ],
            opacity: mainOpacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.mainButtonTouch}
          onPress={toggleSpeedDial}
          onPressIn={handleMainPressIn}
          onPressOut={handleMainPressOut}
          disabled={disabled}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel="Speed dial menu"
          accessibilityHint="Tap to open or close action menu"
        >
          {mainIcon || (
            <Store
              size={currentSize.iconSize}
              color={disabled ? color_scheme.placeholder_color : color_scheme.light}
              strokeWidth={2.5}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    right: 24,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: -screenHeight,
    left: -screenWidth,
    width: screenWidth * 2,
    height: screenHeight * 2,
    backgroundColor: color_scheme.dark,
    zIndex: -1,
  },
  mainButton: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: color_scheme.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  mainButtonTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: color_scheme.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 5,
  },
  secondaryButtonTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpeedDialFAB;