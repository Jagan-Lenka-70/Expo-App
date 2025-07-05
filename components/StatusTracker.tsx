import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { CircleCheck as CheckCircle, Clock, Package, Eye, CircleCheck } from 'lucide-react-native';

interface StatusTrackerProps {
  currentStatus: 'pending' | 'accepted' | 'in-process' | 'pending-approval' | 'completed';
}

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle },
  { key: 'in-process', label: 'In Process', icon: Package },
  { key: 'pending-approval', label: 'Approval', icon: Eye },
  { key: 'completed', label: 'Completed', icon: CircleCheck },
];

export function StatusTracker({ currentStatus }: StatusTrackerProps) {
  const { state: themeState } = useTheme();
  const { theme } = themeState;

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepColor = (stepIndex: number) => {
    if (stepIndex <= currentStepIndex) {
      return theme.colors.primary;
    }
    return theme.colors.textSecondary;
  };

  const getConnectorColor = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) {
      return theme.colors.primary;
    }
    return theme.colors.border;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    stepsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    stepContainer: {
      alignItems: 'center',
      flex: 1,
    },
    stepIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    stepLabel: {
      fontSize: 10,
      fontFamily: 'Inter-Medium',
      textAlign: 'center',
      maxWidth: 60,
    },
    connector: {
      height: 2,
      flex: 1,
      marginHorizontal: theme.spacing.xs,
      marginBottom: 24,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pickup Status</Text>
      <View style={styles.stepsContainer}>
        {statusSteps.map((step, index) => {
          const IconComponent = step.icon;
          const isActive = index <= currentStepIndex;
          const stepColor = getStepColor(index);
          
          return (
            <React.Fragment key={step.key}>
              <View style={styles.stepContainer}>
                <View style={[
                  styles.stepIcon,
                  { 
                    backgroundColor: isActive ? stepColor : theme.colors.border,
                  }
                ]}>
                  <IconComponent 
                    size={20} 
                    color={isActive ? '#FFFFFF' : theme.colors.textSecondary} 
                  />
                </View>
                <Text style={[
                  styles.stepLabel,
                  { color: stepColor }
                ]}>
                  {step.label}
                </Text>
              </View>
              {index < statusSteps.length - 1 && (
                <View style={[
                  styles.connector,
                  { backgroundColor: getConnectorColor(index) }
                ]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}